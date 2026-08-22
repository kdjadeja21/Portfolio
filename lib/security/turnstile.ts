const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const secretKey = process.env.TURNSTILE_SECRET_KEY;
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Turnstile is enforced only when both keys are present, so the form keeps
 * working (rate limits, honeypot and form token still apply) before the keys
 * are configured.
 */
export const turnstile = {
  enabled: Boolean(secretKey && siteKey),
  siteKey: siteKey ?? null,
} as const;

export type TurnstileResult = {
  success: boolean;
  errorCodes: string[];
};

export const verifyTurnstileToken = async (
  token: unknown,
  options: { ip: string | null; idempotencyKey: string }
): Promise<TurnstileResult> => {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({
    secret: secretKey ?? "",
    response: token,
    idempotency_key: options.idempotencyKey,
  });

  if (options.ip) {
    body.set("remoteip", options.ip);
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
      errorCodes: [error instanceof Error ? error.name : "verification-failed"],
    };
  }
};
