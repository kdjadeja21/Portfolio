# Portfolio Website

Personal portfolio for Krushnasinh Jadeja — Senior Software Engineer, Cursor Ambassador, and AI Consultant.

## Features

- Dark, editorial single-page design with an interactive dot-field hero, smooth scrolling, and scroll-driven animations.
- Sections: hero, about, shipped products, Cursor community stats, selected client work, skills, experience, and contact.
- Public products: EventClaim, In-Hand Helper, Backdrop Studio, SIP Calculator, Router Pulse.
- Contact form via Resend, protected against email bombing (see below).
- Respects `prefers-reduced-motion`; animations degrade gracefully.

## Tech Stack

- React & Next.js (App Router & Server Actions)
- TypeScript
- Tailwind CSS
- GSAP (ScrollTrigger, SplitText) & Lenis smooth scroll
- React Email & Resend
- Vercel hosting

## Contact Form Protection

The form posts to `POST /api/contact`. Every submission first has to pass the
guard in `lib/contact/guard.ts`, in this order:

1. **Temporary block** — an IP with too many recent rejections is refused
   outright with `429` and `Retry-After`.
2. **Origin check** — a request that claims a foreign origin is refused.
3. **Honeypot** — two hidden bait fields. A hit is answered with the success
   shape so bots learn nothing, and nothing is sent.
4. **Submit ticket** — a single-use, session-bound, HMAC-signed token from
   `GET /api/contact/prepare`, valid for 30 minutes and not before the minimum
   fill delay. Scripts cannot post straight at the send endpoint, and the nonce
   is burnt before the payload is even inspected.
5. **Cloudflare Turnstile** — verified server-side when both keys are set.
6. **Validation** — strict single-address email pattern (no header injection),
   message bounds, link ceiling, body size cap.
7. **Rate limits** — fixed windows per IP (IPv6 bucketed to `/64`), per session
   cookie, per normalized sender address, and an inbox-wide ceiling. All of
   them are consumed on every request that gets this far, independently of the
   payload, so editing the email or message buys no extra sends. Exceeding any
   window returns `429` with `Retry-After`.
8. **Duplicate suppression** — the same message from the same sender is
   refused with `409` for 12 hours.

Counters live in Upstash/Vercel KV when the REST credentials are configured and
fall back to per-instance memory otherwise; a KV outage degrades protection
rather than taking the form down. Every decision is logged as a single JSON
line (`scope: "contact-security"`) with hashed identifiers, and blocks or
delivery failures can additionally fire a coalesced alert webhook.

Configuration lives in `lib/security/config.ts`; see `.env.example` for the
environment variables. Nothing is required to run the form locally — the limits
and honeypot work out of the box, Turnstile activates once its keys exist.

## Demo

https://krushnasinh.vercel.app/
