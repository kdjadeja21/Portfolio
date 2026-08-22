# Development

## Tech stack

- React & Next.js (App Router)
- TypeScript
- Tailwind CSS
- GSAP (ScrollTrigger, SplitText) & Lenis smooth scroll
- EmailJS
- Vercel hosting

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when you need the contact form to send email or use Turnstile. See [contact-form.md](./contact-form.md).

## Project structure

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router pages and API routes |
| `components/` | UI components |
| `lib/` | Shared utilities, data, and hooks |
| `email/` | EmailJS template reference |
| `public/` | Static assets |

## Features

- Dark, editorial single-page design with an interactive dot-field hero, smooth scrolling, and scroll-driven animations.
- Sections: hero, about, shipped products, Cursor community stats, selected client work, skills, experience, and contact.
- Public products: EventClaim, In-Hand Helper, Backdrop Studio, SIP Calculator, Router Pulse.
- Contact form via EmailJS, protected against bots with Cloudflare Turnstile and a honeypot field.
- Respects `prefers-reduced-motion`; animations degrade gracefully.
