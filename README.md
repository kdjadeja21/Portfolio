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
- `from_email`
- `reply_to`
- `message`
- `to_email`
- `site_name`
- `submitted_at`

### Setting up the EmailJS template

A newly created EmailJS template starts pre-filled with EmailJS's own sample
content (blank subject, body "Email sent via EmailJS.com"). If you don't
replace that sample, every email you receive will look like the sample —
not the custom design in this repo. To install the real template:

1. Go to the [EmailJS templates dashboard](https://dashboard.emailjs.com/admin/templates)
   and open your template.
2. On the **Content** tab, switch the editor to **Code** mode (not
   Design/drag-and-drop — that mode won't render raw HTML).
3. Delete the sample content and paste the full contents of
   `email/emailjs-template.html` in its place.
4. Set the **Subject** field (same tab) to:
   `New inquiry: {{subject}}`
5. On the **Settings** tab, set:
   - **To Email**: `{{to_email}}`
   - **From Name**: `Portfolio Contact`
   - **Reply To**: `{{reply_to}}`
6. Click **Save**, then use **Test It** to confirm the preview shows the
   custom design before testing from the live site.
