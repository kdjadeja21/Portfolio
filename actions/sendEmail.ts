"use server";

import React from "react";
import { Resend } from "resend";
import { email } from "@/lib/site";
import { validateString, getErrorMessage } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

const RESEND_TEST_MODE_ERROR =
  "You can only send testing emails to your own email address";

const getResendErrorMessage = (message: string) => {
  if (message.includes(RESEND_TEST_MODE_ERROR)) {
    return "Email provider is still in testing mode. Please use the direct email link.";
  }

  return message;
};

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  // simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: "Invalid message",
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return {
      error: "Email service is not configured. Please try the direct email link.",
    };
  }

  const resend = new Resend(resendApiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_EMAIL_TO ?? email;

  try {
    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact Form <${fromEmail}>`,
      to: toEmail,
      subject: "Message from Portfolio contact form",
      replyTo: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message,
        senderEmail: senderEmail,
      }),
    });

    if (error) {
      return {
        error: getResendErrorMessage(error.message),
      };
    }

    return {
      data,
    };
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }
};
