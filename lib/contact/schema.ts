export const EMAIL_MAX_LENGTH = 254;
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 5000;
export const MAX_LINKS_IN_MESSAGE = 6;

/**
 * Hidden fields no human can see. Bots that fill every input give themselves
 * away; the names are deliberately not autofill targets.
 */
export const HONEYPOT_FIELDS = [
  "contact_website_url",
  "contact_reference_code",
] as const;

export type ContactPayload = {
  senderEmail: string;
  message: string;
};

export type ContactParseResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; field: "senderEmail" | "message"; error: string };

// Deliberately conservative: a single address, no separators, no whitespace,
// nothing that could smuggle a header into the Reply-To.
const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i;

const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

const LINK_PATTERN = /(https?:\/\/|www\.)/gi;

const countLinks = (value: string) => value.match(LINK_PATTERN)?.length ?? 0;

export const parseContactPayload = (input: unknown): ContactParseResult => {
  const record = (input ?? {}) as Record<string, unknown>;
  const rawEmail = record.senderEmail;
  const rawMessage = record.message;

  if (typeof rawEmail !== "string" || typeof rawMessage !== "string") {
    return { ok: false, field: "senderEmail", error: "Missing form fields." };
  }

  const senderEmail = rawEmail.trim().replace(CONTROL_CHARS, "");

  if (
    senderEmail.length < 5 ||
    senderEmail.length > EMAIL_MAX_LENGTH ||
    !EMAIL_PATTERN.test(senderEmail)
  ) {
    return {
      ok: false,
      field: "senderEmail",
      error: "Please enter a valid email address.",
    };
  }

  const message = rawMessage.replace(CONTROL_CHARS, "").trim();

  if (message.length < MESSAGE_MIN_LENGTH) {
    return {
      ok: false,
      field: "message",
      error: `Please write at least ${MESSAGE_MIN_LENGTH} characters.`,
    };
  }

  if (message.length > MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      field: "message",
      error: `Please keep the message under ${MESSAGE_MAX_LENGTH} characters.`,
    };
  }

  if (countLinks(message) > MAX_LINKS_IN_MESSAGE) {
    return {
      ok: false,
      field: "message",
      error: "Too many links in the message.",
    };
  }

  return { ok: true, value: { senderEmail, message } };
};

/**
 * Collapses the aliases that resolve to one mailbox (Gmail dots and `+tags`)
 * so per-address quotas cannot be reset with `me+1@`, `me+2@`, …
 */
export const normalizeEmailIdentity = (email: string): string => {
  const [localPart, domain] = email.toLowerCase().split("@");

  if (!domain) {
    return email.toLowerCase();
  }

  const withoutTag = localPart.split("+")[0];
  const isGoogleMail = domain === "gmail.com" || domain === "googlemail.com";
  const normalizedLocal = isGoogleMail
    ? withoutTag.replaceAll(".", "")
    : withoutTag;

  return `${normalizedLocal}@${domain}`;
};
