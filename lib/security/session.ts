import { createHmac, randomBytes } from "node:crypto";
import { signingSecret } from "./config";
import { safeEqual } from "./request";

export const SESSION_COOKIE = "pf_cid";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const sign = (id: string) =>
  createHmac("sha256", signingSecret).update(`session:${id}`).digest("base64url");

export const createSessionId = (): string => randomBytes(16).toString("hex");

export const toSessionCookieValue = (id: string): string => `${id}.${sign(id)}`;

/** Returns the session id only when the cookie carries our own signature. */
export const readSessionId = (cookieValue: string | undefined): string | null => {
  if (!cookieValue) {
    return null;
  }

  const separator = cookieValue.lastIndexOf(".");

  if (separator <= 0) {
    return null;
  }

  const id = cookieValue.slice(0, separator);
  const signature = cookieValue.slice(separator + 1);

  return safeEqual(sign(id), signature) ? id : null;
};

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
} as const;
