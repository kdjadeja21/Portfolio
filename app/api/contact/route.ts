import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildRequestIdentity, guardContactRequest } from "@/lib/contact/guard";
import { sendContactEmail } from "@/lib/contact/send";
import { contactSecurity } from "@/lib/security/config";
import { logSecurityEvent, sendSecurityAlert } from "@/lib/security/log";
import { SESSION_COOKIE, readSessionId } from "@/lib/security/session";
import { abuseStore } from "@/lib/security/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" } as const;

const jsonResponse = (
  status: number,
  body: Record<string, unknown>,
  retryAfterSeconds?: number
) =>
  NextResponse.json(body, {
    status,
    headers: retryAfterSeconds
      ? { ...noStore, "Retry-After": String(retryAfterSeconds) }
      : noStore,
  });

type BodyResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; status: 400 | 413 };

const readJsonBody = async (request: Request): Promise<BodyResult> => {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");

  if (declaredLength > contactSecurity.maxBodyBytes) {
    return { ok: false, status: 413 };
  }

  const raw = await request.text();

  if (raw.length > contactSecurity.maxBodyBytes) {
    return { ok: false, status: 413 };
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? { ok: true, value: parsed as Record<string, unknown> }
      : { ok: false, status: 400 };
  } catch {
    return { ok: false, status: 400 };
  }
};

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return jsonResponse(415, { error: "Unsupported content type." });
  }

  const cookieStore = await cookies();
  const sessionId = readSessionId(cookieStore.get(SESSION_COOKIE)?.value);
  const identity = buildRequestIdentity(request, sessionId);
  const body = await readJsonBody(request);

  if (!body.ok) {
    return jsonResponse(body.status, {
      error:
        body.status === 413 ? "Message is too large." : "Malformed request.",
    });
  }

  const outcome = await guardContactRequest({
    request,
    body: body.value,
    identity,
  });

  switch (outcome.type) {
    case "reject":
      return jsonResponse(
        outcome.status,
        {
          error: outcome.error,
          retryAfterSeconds: outcome.retryAfterSeconds,
        },
        outcome.retryAfterSeconds
      );

    // A tripped honeypot gets the success shape on purpose: nothing is sent,
    // and the bot learns nothing about why it failed.
    case "silent-drop":
      return jsonResponse(202, { ok: true });

    case "accept": {
      const result = await sendContactEmail(outcome.payload, {
        ip: outcome.identity.ip,
      });

      if (!result.ok) {
        logSecurityEvent({
          event: "contact_send_failed",
          reason: result.error,
          ipHash: outcome.identity.ipHash,
          sessionHash: outcome.identity.sessionHash,
          store: abuseStore.kind,
        });

        await sendSecurityAlert({
          event: "contact_send_failed",
          reason: result.error,
        });

        return jsonResponse(502, {
          error: "Message could not be delivered. Please email me directly.",
        });
      }

      return jsonResponse(200, { ok: true });
    }

    default: {
      const exhaustive: never = outcome;

      throw new Error(`Unhandled guard outcome: ${JSON.stringify(exhaustive)}`);
    }
  }
}
