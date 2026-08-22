import { contactSecurity } from "@/lib/security/config";
import { verifyFormToken } from "@/lib/security/form-token";
import {
  describeUserAgent,
  logSecurityEvent,
  sendSecurityAlert,
} from "@/lib/security/log";
import { consumeRateRules, type RateVerdict } from "@/lib/security/rate-limit";
import {
  checkOrigin,
  fingerprint,
  getClientIp,
  hashContent,
  toIpBucket,
  type OriginCheck,
} from "@/lib/security/request";
import { abuseStore } from "@/lib/security/store";
import { turnstile, verifyTurnstileToken } from "@/lib/security/turnstile";
import { formatDuration } from "@/lib/utils";
import {
  HONEYPOT_FIELDS,
  normalizeEmailIdentity,
  parseContactPayload,
  type ContactPayload,
} from "./schema";

export type RequestIdentity = {
  ip: string | null;
  ipBucket: string;
  ipHash: string;
  sessionId: string | null;
  sessionHash: string;
  userAgent: string | undefined;
  origin: OriginCheck;
};

export type GuardOutcome =
  | { type: "accept"; payload: ContactPayload; identity: RequestIdentity }
  | { type: "silent-drop"; identity: RequestIdentity }
  | {
      type: "reject";
      status: 400 | 403 | 409 | 429;
      error: string;
      retryAfterSeconds?: number;
      identity: RequestIdentity;
    };

export const buildRequestIdentity = (
  request: Request,
  sessionId: string | null
): RequestIdentity => {
  const ip = getClientIp(request.headers);

  return {
    ip,
    ipBucket: toIpBucket(ip),
    ipHash: fingerprint(toIpBucket(ip)),
    sessionId,
    sessionHash: sessionId ? fingerprint(sessionId) : "none",
    userAgent: describeUserAgent(request.headers),
    origin: checkOrigin(request),
  };
};

const blockKey = (identity: RequestIdentity) => `block:${identity.ipBucket}`;

/**
 * Every rejection costs a strike. Enough strikes inside the window and the IP
 * bucket is parked, which is what turns "one blocked request" into "scripted
 * probing stops working".
 */
const recordStrike = async (identity: RequestIdentity, reason: string) => {
  const { count } = await abuseStore.increment(
    `strike:${identity.ipBucket}`,
    contactSecurity.abuse.strikeWindowMs
  );

  if (count < contactSecurity.abuse.maxStrikes) {
    return count;
  }

  await abuseStore.setFlag(blockKey(identity), contactSecurity.abuse.blockMs);

  logSecurityEvent({
    event: "contact_blocked",
    reason,
    ipHash: identity.ipHash,
    sessionHash: identity.sessionHash,
    strikes: count,
    userAgent: identity.userAgent,
    store: abuseStore.kind,
  });

  await sendSecurityAlert({
    event: "contact_blocked",
    reason,
    ipHash: identity.ipHash,
    strikes: count,
  });

  return count;
};

const reject = async (
  identity: RequestIdentity,
  args: {
    status: 400 | 403 | 409 | 429;
    error: string;
    reason: string;
    retryAfterSeconds?: number;
    ruleId?: string;
    counts?: Record<string, number>;
  }
): Promise<GuardOutcome> => {
  const strikes = await recordStrike(identity, args.reason);

  logSecurityEvent({
    event: "contact_rejected",
    reason: args.reason,
    ipHash: identity.ipHash,
    sessionHash: identity.sessionHash,
    ruleId: args.ruleId,
    retryAfterSeconds: args.retryAfterSeconds,
    counts: args.counts,
    strikes,
    origin: identity.origin,
    userAgent: identity.userAgent,
    store: abuseStore.kind,
  });

  return {
    type: "reject",
    status: args.status,
    error: args.error,
    retryAfterSeconds: args.retryAfterSeconds,
    identity,
  };
};

const hasHoneypotValue = (body: Record<string, unknown>) =>
  HONEYPOT_FIELDS.some((field) => {
    const value = body[field];

    return typeof value === "string" && value.trim().length > 0;
  });

const worstVerdict = (verdicts: RateVerdict[]) =>
  verdicts
    .filter((verdict) => !verdict.allowed)
    .sort((a, b) => b.retryAfterSeconds - a.retryAfterSeconds)[0] ?? null;

const mergeCounts = (verdicts: RateVerdict[]) =>
  Object.assign({}, ...verdicts.map((verdict) => verdict.counts)) as Record<
    string,
    number
  >;

export const guardContactRequest = async (params: {
  request: Request;
  body: unknown;
  identity: RequestIdentity;
}): Promise<GuardOutcome> => {
  const { identity } = params;
  const body = (params.body ?? {}) as Record<string, unknown>;

  const blockTtl = await abuseStore.flagTtl(blockKey(identity));

  if (blockTtl > 0) {
    const retryAfterSeconds = Math.ceil(blockTtl / 1000);

    logSecurityEvent({
      event: "contact_rejected",
      reason: "temporarily-blocked",
      ipHash: identity.ipHash,
      sessionHash: identity.sessionHash,
      retryAfterSeconds,
      userAgent: identity.userAgent,
      store: abuseStore.kind,
    });

    return {
      type: "reject",
      status: 429,
      error: `Too many attempts from your network. Try again in ${formatDuration(
        retryAfterSeconds
      )}.`,
      retryAfterSeconds,
      identity,
    };
  }

  if (identity.origin === "cross-origin") {
    return reject(identity, {
      status: 403,
      error: "Request rejected.",
      reason: "cross-origin",
    });
  }

  if (hasHoneypotValue(body)) {
    await recordStrike(identity, "honeypot");

    logSecurityEvent({
      event: "contact_rejected",
      reason: "honeypot",
      ipHash: identity.ipHash,
      sessionHash: identity.sessionHash,
      userAgent: identity.userAgent,
      store: abuseStore.kind,
    });

    // Answered as a success so bots get no signal about what tripped them.
    return { type: "silent-drop", identity };
  }

  const tokenCheck = await verifyFormToken(body.formToken, identity.sessionId);

  if (!tokenCheck.ok) {
    const isRecoverable =
      tokenCheck.reason === "expired" || tokenCheck.reason === "replayed";

    return reject(identity, {
      status: 403,
      error: isRecoverable
        ? "This form session expired. Please reload the page and try again."
        : "Request rejected. Please reload the page and try again.",
      reason: `form-token-${tokenCheck.reason}`,
    });
  }

  if (turnstile.enabled) {
    const verification = await verifyTurnstileToken(body.turnstileToken, {
      ip: identity.ip,
      idempotencySeed: `${identity.sessionHash}:${String(body.formToken).slice(-24)}`,
    });

    if (!verification.success) {
      return reject(identity, {
        status: 403,
        error: "Human verification failed. Please retry the challenge.",
        reason: `turnstile-${verification.errorCodes[0] ?? "failed"}`,
      });
    }
  }

  const parsed = parseContactPayload(body);

  if (!parsed.ok) {
    return reject(identity, {
      status: 400,
      error: parsed.error,
      reason: `invalid-${parsed.field}`,
    });
  }

  const emailIdentity = normalizeEmailIdentity(parsed.value.senderEmail);

  // All scopes are consumed on every accepted-shape request. IP, session and
  // global quotas are independent of the payload, so editing the email or the
  // message body cannot buy extra sends.
  const verdicts = await Promise.all([
    consumeRateRules("ip", identity.ipBucket, contactSecurity.ipRules),
    consumeRateRules(
      "session",
      identity.sessionId ?? identity.ipBucket,
      contactSecurity.sessionRules
    ),
    consumeRateRules("global", "all", contactSecurity.globalRules),
    consumeRateRules(
      "email",
      fingerprint(emailIdentity),
      contactSecurity.emailRules
    ),
  ]);

  const failed = worstVerdict(verdicts);

  if (failed?.exceeded) {
    const { exceeded, retryAfterSeconds } = failed;

    return reject(identity, {
      status: 429,
      error:
        exceeded.id === "global-1h" || exceeded.id === "global-1d"
          ? `The contact form is busy right now. Please try again in ${formatDuration(
              retryAfterSeconds
            )} or email me directly.`
          : `You can send ${exceeded.limit} message${
              exceeded.limit === 1 ? "" : "s"
            } per ${exceeded.window}. Please try again in ${formatDuration(
              retryAfterSeconds
            )}.`,
      reason: "rate-limited",
      ruleId: exceeded.id,
      retryAfterSeconds,
      counts: mergeCounts(verdicts),
    });
  }

  const isNewMessage = await abuseStore.claimOnce(
    `duplicate:${hashContent(`${emailIdentity}|${parsed.value.message}`)}`,
    contactSecurity.duplicateWindowMs
  );

  if (!isNewMessage) {
    return reject(identity, {
      status: 409,
      error: "You already sent this message. I have it — no need to resend.",
      reason: "duplicate-message",
    });
  }

  logSecurityEvent({
    event: "contact_submit",
    ipHash: identity.ipHash,
    sessionHash: identity.sessionHash,
    counts: mergeCounts(verdicts),
    origin: identity.origin,
    userAgent: identity.userAgent,
    store: abuseStore.kind,
  });

  return { type: "accept", payload: parsed.value, identity };
};
