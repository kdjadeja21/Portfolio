import { HONEYPOT_FIELDS } from "./schema";

export type ContactPrepare = {
  token: string;
  /** Submissions before this timestamp are treated as automated. */
  notBefore: number;
  expiresAt: number;
  turnstile: {
    enabled: boolean;
    siteKey: string | null;
  };
};

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; status: number; error: string; retryAfterSeconds?: number };

export const fetchContactPrepare = async (): Promise<ContactPrepare | null> => {
  try {
    const response = await fetch("/api/contact/prepare", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ContactPrepare;
  } catch {
    return null;
  }
};

export const submitContactForm = async (input: {
  senderEmail: string;
  message: string;
  formToken: string;
  turnstileToken: string | null;
  honeypots: Record<string, string>;
}): Promise<ContactSubmitResult> => {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        senderEmail: input.senderEmail,
        message: input.message,
        formToken: input.formToken,
        turnstileToken: input.turnstileToken,
        ...input.honeypots,
      }),
    });

    if (response.ok) {
      return { ok: true };
    }

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      retryAfterSeconds?: number;
    };

    return {
      ok: false,
      status: response.status,
      error: payload.error ?? "Something went wrong. Please try again.",
      retryAfterSeconds: payload.retryAfterSeconds,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Network error. Please check your connection and try again.",
    };
  }
};

export const readHoneypotValues = (formData: FormData): Record<string, string> =>
  Object.fromEntries(
    HONEYPOT_FIELDS.map((field) => [field, String(formData.get(field) ?? "")])
  );
