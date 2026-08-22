const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const secretKey = process.env.TURNSTILE_SECRET_KEY;
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Turnstile is only enforced once both keys are configured, so the contact
 * form keeps working before the keys are set up (mirrors how the EmailJS
 * env vars are treated as optional in `components/contact.tsx`).
 */
export const turnstileConfig = {
  enabled: Boolean(secretKey && siteKey),
  siteKey: siteKey ?? null,
} as const;

export type TurnstileVerifyResult = {
  success: boolean;
  errorCodes: string[];
};

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp: string | null
): Promise<TurnstileVerifyResult> {
  if (!secretKey) {
    return { success: false, errorCodes: ["missing-secret-key"] };
  }

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return { success: false, errorCodes: [`http-${response.status}`] };
    }

    const payload = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    return {
      success: payload.success === true,
      errorCodes: payload["error-codes"] ?? [],
    };
  } catch (error) {
    return {
      success: false,
      errorCodes: [
        error instanceof Error ? error.name : "verification-failed",
      ],
    };
  }
}
