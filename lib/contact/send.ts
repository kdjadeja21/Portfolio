import React from "react";
import { Resend } from "resend";
import ContactFormEmail from "@/email/contact-form-email";
import { email as inboxAddress } from "@/lib/site";
import { getErrorMessage } from "@/lib/utils";
import type { ContactPayload } from "./schema";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.CONTACT_FROM_ADDRESS ??
  "Portfolio Contact Form <onboarding@resend.dev>";

export type SendResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

export const sendContactEmail = async (
  payload: ContactPayload,
  meta: { ip: string | null }
): Promise<SendResult> => {
  if (!apiKey) {
    return { ok: false, error: "Email delivery is not configured." };
  }

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from: fromAddress,
      to: inboxAddress,
      subject: `Portfolio contact — ${payload.senderEmail}`,
      replyTo: payload.senderEmail,
      react: React.createElement(ContactFormEmail, {
        message: payload.message,
        senderEmail: payload.senderEmail,
        submittedAt: new Date().toISOString(),
        clientIp: meta.ip,
      }),
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id ?? null };
  } catch (error: unknown) {
    return { ok: false, error: getErrorMessage(error) };
  }
};
