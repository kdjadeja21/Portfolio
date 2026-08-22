# Portfolio Website

Personal portfolio for Krushnasinh Jadeja — Senior Software Engineer, Cursor Ambassador, and AI Consultant.

## Features

- Dark, editorial single-page design with an interactive dot-field hero, smooth scrolling, and scroll-driven animations.
- Sections: hero, about, shipped products, Cursor community stats, selected client work, skills, experience, and contact.
- Public products: EventClaim, In-Hand Helper, Backdrop Studio, SIP Calculator, Router Pulse.
- Contact form via EmailJS.
- Respects `prefers-reduced-motion`; animations degrade gracefully.

## Tech Stack

- React & Next.js (App Router)
- TypeScript
- Tailwind CSS
- GSAP (ScrollTrigger, SplitText) & Lenis smooth scroll
- EmailJS
- Vercel hosting

## Demo

https://krushnasinh.vercel.app/

## Contact form email configuration

The contact form uses EmailJS from the browser. Configure these variables in
Vercel:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

The app sends the following template variables to EmailJS:

- `from_email`
- `reply_to`
- `message`
- `to_email`
- `site_name`
- `submitted_at`

Use `email/emailjs-template.html` as the EmailJS template body. In EmailJS, set:

- **To Email**: `{{to_email}}`
- **Reply To**: `{{reply_to}}`
- **Subject**: `New portfolio inquiry from {{from_email}}`
