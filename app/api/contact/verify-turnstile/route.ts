import { NextRequest, NextResponse } from "next/server";
import { turnstileConfig, verifyTurnstileToken } from "@/lib/turnstile";

/**
 * Verifies a Cloudflare Turnstile token before the browser is allowed to
 * call EmailJS. This runs server-side so a script can't skip straight to
 * submitting the form without ever solving the challenge that a real
 * browser would be shown.
 */
export async function POST(request: NextRequest) {
  if (!turnstileConfig.enabled) {
    return NextResponse.json({ success: true });
  }

  let token: unknown;
  try {
    const body = await request.json();
    token = body?.token;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const remoteIp = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

  const result = await verifyTurnstileToken(token, remoteIp);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Verification failed. Please try again.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
