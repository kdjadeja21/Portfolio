import { alertWebhookUrl, contactSecurity } from "./config";
import { abuseStore } from "./store";

export type SecurityEvent = {
  event:
    | "contact_submit"
    | "contact_rejected"
    | "contact_prepare"
    | "contact_blocked"
    | "contact_send_failed";
  reason?: string;
  /** Hashed client identifiers — never log raw IPs or addresses. */
  ipHash?: string;
  sessionHash?: string;
  ruleId?: string;
  retryAfterSeconds?: number;
  strikes?: number;
  counts?: Record<string, number>;
  store?: string;
  origin?: string;
  userAgent?: string;
};

const truncate = (value: string | null, max = 120) =>
  value ? value.slice(0, max) : undefined;

export const logSecurityEvent = (event: SecurityEvent) => {
  const line = JSON.stringify({
    scope: "contact-security",
    at: new Date().toISOString(),
    ...event,
  });

  if (event.event === "contact_submit" || event.event === "contact_prepare") {
    console.info(line);
    return;
  }

  console.warn(line);
};

export const describeUserAgent = (headers: Headers) =>
  truncate(headers.get("user-agent"));

/**
 * Best-effort alert for the events worth waking up for. Coalesced through the
 * shared store so a flood produces one notification, not thousands.
 */
export const sendSecurityAlert = async (event: SecurityEvent) => {
  if (!alertWebhookUrl) {
    return;
  }

  const shouldSend = await abuseStore.claimOnce(
    `alert:${event.event}:${event.reason ?? "none"}`,
    contactSecurity.alertCooldownMs
  );

  if (!shouldSend) {
    return;
  }

  try {
    await fetch(alertWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `Portfolio contact form: ${event.event} (${event.reason ?? "n/a"})`,
        details: event,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        scope: "contact-security",
        event: "alert_failed",
        message: error instanceof Error ? error.message : String(error),
      })
    );
  }
};
