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

The app sends the following template variables to EmailJS (see
`components/contact.tsx`):

- `subject`
- `email_html` — the fully rendered email body, built by
  `lib/email-template.ts`
- `from_email`
- `reply_to`
- `message` (plain text)
- `to_email`
- `site_name`
- `submitted_at`

### Setting up the EmailJS template

The email body is generated in code (`lib/email-template.ts`), not in the
EmailJS dashboard editor. This avoids the most common EmailJS setup mistake:
a newly created template starts pre-filled with EmailJS's own sample content
(blank subject, body "Email sent via EmailJS.com"), and if the dashboard
Content field is never replaced, every email you receive looks like that
sample instead of the custom design in this repo.

To install the template, all you need is 4 field values — no HTML to paste:

1. Go to the [EmailJS templates dashboard](https://dashboard.emailjs.com/admin/templates)
   and open your template.
2. On the **Content** tab, set:
   - **Subject**: `{{subject}}`
   - **Content**: `{{{email_html}}}` (triple braces — double braces would
     escape the HTML and show it as literal text instead of rendering it)
3. On the **Settings** tab, set:
   - **To Email**: `{{to_email}}`
   - **From Name**: `Portfolio Contact`
   - **Reply To**: `{{reply_to}}`
4. Click **Save**, then use **Test It** to confirm the preview shows a
   rendered dark card design — not EmailJS's own sample text. If the preview
   still shows "Email sent via EmailJS.com", the Content field was not saved
   as `{{{email_html}}}`.

See `email/emailjs-template.html` for the full setup reference.
