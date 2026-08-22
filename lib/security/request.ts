import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { signingSecret } from "./config";
import { siteUrl } from "@/lib/site";

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

const isIpv4 = (value: string) =>
  IPV4.test(value) &&
  value.split(".").every((part) => Number.parseInt(part, 10) <= 255);

const isIpv6 = (value: string) => value.includes(":") && /^[0-9a-f:.]+$/i.test(value);

/**
 * Reads the client IP from the proxy headers set by the hosting platform
 * (Vercel / Cloudflare). These headers are only trustworthy because the app is
 * always served through that proxy; never trust them when running behind an
 * arbitrary reverse proxy.
 */
export const getClientIp = (headers: Headers): string | null => {
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    headers.get("x-vercel-forwarded-for")?.split(",")[0],
    headers.get("x-forwarded-for")?.split(",")[0],
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim().replace(/^\[|\]$/g, "");

    if (value && (isIpv4(value) || isIpv6(value))) {
      return value;
    }
  }

  return null;
};

/**
 * IPv6 clients routinely get a whole /64, so counting per address would let one
 * host rotate through billions of "new" clients. IPv4 is counted per address.
 */
export const toIpBucket = (ip: string | null): string => {
  if (!ip) {
    return "unknown";
  }

  if (isIpv4(ip)) {
    return ip;
  }

  const groups = ip.split(":");
  const prefix: string[] = [];

  for (const group of groups) {
    if (prefix.length === 4) {
      break;
    }

    if (group === "") {
      break;
    }

    prefix.push(group);
  }

  return `${prefix.join(":")}::/64`;
};

/** Short, stable, non-reversible id so logs can correlate without storing PII. */
export const fingerprint = (value: string): string =>
  createHmac("sha256", signingSecret).update(value).digest("hex").slice(0, 16);

export const hashContent = (value: string): string =>
  createHash("sha256").update(value).digest("hex").slice(0, 32);

export const safeEqual = (a: string, b: string): boolean => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
};

const allowedHosts = new Set<string>();

const addAllowedHost = (value: string | undefined) => {
  if (!value) {
    return;
  }

  try {
    allowedHosts.add(
      new URL(value.startsWith("http") ? value : `https://${value}`).host
    );
  } catch {
    // Ignore malformed configuration rather than breaking every request.
  }
};

addAllowedHost(siteUrl);
addAllowedHost(process.env.VERCEL_URL);
addAllowedHost(process.env.VERCEL_BRANCH_URL);
addAllowedHost(process.env.VERCEL_PROJECT_PRODUCTION_URL);
addAllowedHost(process.env.CONTACT_ALLOWED_ORIGIN);

export type OriginCheck = "same-origin" | "cross-origin" | "unknown";

/**
 * The form token plus its HttpOnly cookie already blocks cross-site scripted
 * posts, so a missing Origin/Referer is only reported, not rejected. A present
 * but foreign origin is a hard signal.
 */
export const checkOrigin = (request: Request): OriginCheck => {
  const requestHost = new URL(request.url).host;
  const stated = request.headers.get("origin") ?? request.headers.get("referer");

  if (!stated) {
    return "unknown";
  }

  let host: string;

  try {
    host = new URL(stated).host;
  } catch {
    return "cross-origin";
  }

  if (host === requestHost || allowedHosts.has(host)) {
    return "same-origin";
  }

  const forwardedHost = request.headers.get("x-forwarded-host");

  return host === forwardedHost ? "same-origin" : "cross-origin";
};
