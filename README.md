# Portfolio Website

Personal portfolio for Krushnasinh Jadeja — Senior Software Engineer, Cursor Ambassador, and AI Consultant.

## Features

- Dark, editorial single-page design with an interactive dot-field hero, smooth scrolling, and scroll-driven animations.
- Sections: hero, about, shipped products, Cursor community stats, selected client work, skills, experience, and contact.
- Public products: EventClaim, In-Hand Helper, Backdrop Studio, SIP Calculator, Router Pulse.
- Contact form via Resend.
- Respects `prefers-reduced-motion`; animations degrade gracefully.

## Tech Stack

- React & Next.js (App Router & Server Actions)
- TypeScript
- Tailwind CSS
- GSAP (ScrollTrigger, SplitText) & Lenis smooth scroll
- React Email & Resend
- Vercel hosting

## Demo

https://krushnasinh.vercel.app/

## Contact form email configuration

The contact form uses Resend. For production delivery, Resend now requires a
verified sending domain when emailing recipients other than the Resend account
owner.

Required environment variables:

- `RESEND_API_KEY` — Resend API key.
- `RESEND_FROM_EMAIL` — sender address on a verified Resend domain, for example
  `contact@yourdomain.com`.

Optional environment variable:

- `CONTACT_EMAIL_TO` — recipient inbox. Defaults to the site email in
  `lib/site.ts`.

If `RESEND_FROM_EMAIL` is not set, the code falls back to
`onboarding@resend.dev`, which is only suitable for Resend testing mode.
