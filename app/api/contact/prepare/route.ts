import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { contactSecurity } from "@/lib/security/config";
import { issueFormToken } from "@/lib/security/form-token";
import { logSecurityEvent } from "@/lib/security/log";
import { consumeRateRules } from "@/lib/security/rate-limit";
import { fingerprint, getClientIp, toIpBucket } from "@/lib/security/request";
import {
  SESSION_COOKIE,
  createSessionId,
  readSessionId,
  sessionCookieOptions,
  toSessionCookieValue,
} from "@/lib/security/session";
import { abuseStore } from "@/lib/security/store";
import { turnstile } from "@/lib/security/turnstile";
import { formatDuration } from "@/lib/utils";
import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
} from "@/lib/contact/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" } as const;

/**
 * Issues the single-use submit ticket and establishes the session cookie the
 * per-session quota is keyed on.
 */
export async function GET(request: Request) {
  const cookieStore = await cookies();
  const existingSessionId = readSessionId(cookieStore.get(SESSION_COOKIE)?.value);
  const sessionId = existingSessionId ?? createSessionId();
  const ipBucket = toIpBucket(getClientIp(request.headers));

  const verdict = await consumeRateRules(
    "prepare",
    ipBucket,
    contactSecurity.prepareRules
  );

  if (!verdict.allowed && verdict.exceeded) {
    logSecurityEvent({
      event: "contact_rejected",
      reason: "prepare-rate-limited",
      ipHash: fingerprint(ipBucket),
      ruleId: verdict.exceeded.id,
      retryAfterSeconds: verdict.retryAfterSeconds,
      counts: verdict.counts,
      store: abuseStore.kind,
    });

    return NextResponse.json(
      {
        error: `Too many requests. Please try again in ${formatDuration(
          verdict.retryAfterSeconds
        )}.`,
        retryAfterSeconds: verdict.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { ...noStore, "Retry-After": String(verdict.retryAfterSeconds) },
      }
    );
  }

  const formToken = issueFormToken(sessionId);

  const response = NextResponse.json(
    {
      token: formToken.token,
      notBefore: formToken.notBefore,
      expiresAt: formToken.expiresAt,
      turnstile: {
        enabled: turnstile.enabled,
        siteKey: turnstile.enabled ? turnstile.siteKey : null,
      },
      limits: {
        emailMaxLength: EMAIL_MAX_LENGTH,
        messageMinLength: MESSAGE_MIN_LENGTH,
        messageMaxLength: MESSAGE_MAX_LENGTH,
      },
    },
    { status: 200, headers: noStore }
  );

  if (!existingSessionId) {
    response.cookies.set(
      SESSION_COOKIE,
      toSessionCookieValue(sessionId),
      sessionCookieOptions
    );
  }

  return response;
}
