export type RateRule = {
  /** Stable identifier used in keys and logs. */
  id: string;
  limit: number;
  windowMs: number;
  /** Human-readable window used in user-facing messages. */
  window: string;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const readInt = (raw: string | undefined, fallback: number): number => {
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const perIpHour = readInt(process.env.CONTACT_MAX_PER_IP_HOUR, 5);
const perIpDay = readInt(process.env.CONTACT_MAX_PER_IP_DAY, 10);
const globalHour = readInt(process.env.CONTACT_MAX_GLOBAL_HOUR, 30);
const globalDay = readInt(process.env.CONTACT_MAX_GLOBAL_DAY, 120);

export const KEY_PREFIX = "portfolio:contact";

export const contactSecurity = {
  /** Max accepted JSON body size; anything larger is refused before parsing. */
  maxBodyBytes: 24 * 1024,
  /** A form token is only usable inside this window after it was issued. */
  formTokenTtlMs: 30 * MINUTE,
  /**
   * Humans need time to type. Submitting faster than this after the token was
   * issued is treated as automation.
   */
  minFillMs: readInt(process.env.CONTACT_MIN_FILL_MS, 3 * SECOND),
  /** Identical (email, message) pairs are refused inside this window. */
  duplicateWindowMs: 12 * HOUR,

  /** Per-IP quotas. IPv6 clients are bucketed by /64 so rotation does not help. */
  ipRules: [
    { id: "ip-1m", limit: 3, windowMs: MINUTE, window: "a minute" },
    { id: "ip-1h", limit: perIpHour, windowMs: HOUR, window: "an hour" },
    { id: "ip-1d", limit: perIpDay, windowMs: DAY, window: "a day" },
  ] satisfies RateRule[],

  /** Per-browser-session quotas, keyed on a signed HttpOnly cookie. */
  sessionRules: [
    { id: "session-1h", limit: 4, windowMs: HOUR, window: "an hour" },
    { id: "session-1d", limit: 8, windowMs: DAY, window: "a day" },
  ] satisfies RateRule[],

  /** Defense in depth: one sender address cannot loop through many IPs. */
  emailRules: [
    { id: "email-1h", limit: 3, windowMs: HOUR, window: "an hour" },
    { id: "email-1d", limit: 5, windowMs: DAY, window: "a day" },
  ] satisfies RateRule[],

  /** Inbox-wide ceiling, the backstop against distributed floods. */
  globalRules: [
    { id: "global-1h", limit: globalHour, windowMs: HOUR, window: "an hour" },
    { id: "global-1d", limit: globalDay, windowMs: DAY, window: "a day" },
  ] satisfies RateRule[],

  /** Token issuing is cheap but not free, so it gets its own quota. */
  prepareRules: [
    { id: "prepare-1h", limit: 40, windowMs: HOUR, window: "an hour" },
    { id: "prepare-1d", limit: 200, windowMs: DAY, window: "a day" },
  ] satisfies RateRule[],

  /**
   * Rejected requests accumulate strikes. Enough strikes and the IP is parked
   * for `blockMs`, which is what stops a script from probing for a bypass.
   */
  abuse: {
    strikeWindowMs: 10 * MINUTE,
    maxStrikes: readInt(process.env.CONTACT_MAX_STRIKES, 10),
    blockMs: 30 * MINUTE,
  },

  /** At most one alert webhook call per window, so alerts cannot be flooded. */
  alertCooldownMs: 10 * MINUTE,
} as const;

export const signingSecret =
  process.env.CONTACT_SECRET ??
  process.env.RESEND_API_KEY ??
  "insecure-development-secret";

export const hasStrongSigningSecret = Boolean(
  process.env.CONTACT_SECRET ?? process.env.RESEND_API_KEY
);

export const alertWebhookUrl = process.env.CONTACT_ALERT_WEBHOOK_URL;
