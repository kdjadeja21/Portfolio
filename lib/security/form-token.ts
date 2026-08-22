import { createHmac, randomBytes } from "node:crypto";
import { contactSecurity, signingSecret } from "./config";
import { fingerprint, safeEqual } from "./request";
import { abuseStore } from "./store";

export type FormToken = {
  token: string;
  issuedAt: number;
  expiresAt: number;
  /** Earliest time a submission carrying this token is accepted. */
  notBefore: number;
};

export type FormTokenFailure =
  | "missing"
  | "malformed"
  | "bad-signature"
  | "expired"
  | "too-fast"
  | "replayed"
  | "session-mismatch";

const sign = (payload: string) =>
  createHmac("sha256", signingSecret).update(payload).digest("base64url");

/**
 * A signed, single-use, session-bound submit ticket. Because it can only be
 * obtained from `/api/contact/prepare` (which sets the session cookie and is
 * itself rate limited), a script cannot post straight at the send endpoint.
 */
export const issueFormToken = (sessionId: string): FormToken => {
  const issuedAt = Date.now();
  const nonce = randomBytes(12).toString("base64url");
  const payload = `v1.${issuedAt.toString(36)}.${nonce}.${fingerprint(sessionId)}`;

  return {
    token: `${payload}.${sign(payload)}`,
    issuedAt,
    expiresAt: issuedAt + contactSecurity.formTokenTtlMs,
    notBefore: issuedAt + contactSecurity.minFillMs,
  };
};

export const verifyFormToken = async (
  token: unknown,
  sessionId: string | null
): Promise<{ ok: true } | { ok: false; reason: FormTokenFailure }> => {
  if (typeof token !== "string" || token.length === 0 || token.length > 256) {
    return { ok: false, reason: "missing" };
  }

  const parts = token.split(".");

  if (parts.length !== 5 || parts[0] !== "v1") {
    return { ok: false, reason: "malformed" };
  }

  const [, issuedAtRaw, nonce, boundSession, signature] = parts;
  const payload = `v1.${issuedAtRaw}.${nonce}.${boundSession}`;

  if (!safeEqual(sign(payload), signature)) {
    return { ok: false, reason: "bad-signature" };
  }

  if (!sessionId || boundSession !== fingerprint(sessionId)) {
    return { ok: false, reason: "session-mismatch" };
  }

  const issuedAt = Number.parseInt(issuedAtRaw, 36);

  if (!Number.isFinite(issuedAt)) {
    return { ok: false, reason: "malformed" };
  }

  const age = Date.now() - issuedAt;

  if (age > contactSecurity.formTokenTtlMs || age < -60_000) {
    return { ok: false, reason: "expired" };
  }

  if (age < contactSecurity.minFillMs) {
    return { ok: false, reason: "too-fast" };
  }

  // Burn the nonce before the payload is examined, so a single token cannot be
  // reused to probe validation behaviour.
  const claimed = await abuseStore.claimOnce(
    `token:${nonce}`,
    contactSecurity.formTokenTtlMs
  );

  if (!claimed) {
    return { ok: false, reason: "replayed" };
  }

  return { ok: true };
};
