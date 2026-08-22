# Portfolio Website

Personal portfolio for Krushnasinh Jadeja — Senior Software Engineer, Cursor Ambassador, and AI Consultant.

## Features

- Dark, editorial single-page design with an interactive dot-field hero, smooth scrolling, and scroll-driven animations.
- Sections: hero, about, shipped products, Cursor community stats, selected client work, skills, experience, and contact.
- Public products: EventClaim, In-Hand Helper, Backdrop Studio, SIP Calculator, Router Pulse.
- Contact form via EmailJS, protected against bots with Cloudflare Turnstile and a honeypot field.
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
`components/contact.tsx`). The rendered HTML body and the reply-to/sender
address are each sent under two alternate names, because different EmailJS
template presets reference them differently — whichever name your dashboard
already uses will be populated correctly:

- `subject`
- `email_html` / `message_html` — the fully rendered email body (identical
  value under both names), built by `lib/email-template.ts`
- `from_email` / `reply_to` / `email` — the sender's address (identical value
  under all three names)
- `name` — also set to the sender's address, since the form only collects an
  email
- `message` (plain text)
- `to_email`
- `site_name`
- `submitted_at`

### Setting up the EmailJS template

The email body is generated in code (`lib/email-template.ts`), not in the
EmailJS dashboard editor. This avoids the most common EmailJS setup mistake:
a newly created template starts pre-filled with EmailJS's own sample content
(blank subject, body "Email sent via EmailJS.com"), and if the dashboard
Content field is never replaced — or references a variable name the app
doesn't send — every email you receive is blank or looks like that sample
instead of the custom design in this repo.

To install the template, all you need is 4 field values — no HTML to paste:

1. Go to the [EmailJS templates dashboard](https://dashboard.emailjs.com/admin/templates)
   and open your template.
2. On the **Content** tab, set:
   - **Subject**: `{{subject}}`
   - **Content**: `{{{message_html}}}` (or `{{{email_html}}}` — both work).
     This MUST use triple braces — double braces would escape the HTML and
     show it as literal text instead of rendering it.
3. On the **Settings** tab, set:
   - **To Email**: `{{to_email}}`
   - **From Name**: `{{name}}` (or a static string like `Portfolio Contact`)
   - **Reply To**: `{{email}}` (or `{{reply_to}}` — both work)
4. Click **Save**, then use **Test It** to confirm the preview shows a
   rendered dark card design, not EmailJS's own sample text and not a blank
   body. A blank body means the Content field references a variable name
   the app doesn't send — double-check step 2 against the variable list
   above.

See `email/emailjs-template.html` for the full setup reference.

## Contact form bot protection

The contact form is protected against bots/scripts submitting it in two ways:

1. **Honeypot field** — a hidden input (`company_website`) that's invisible
   and unreachable to real visitors (removed from tab order, no autofill,
   zero-size). A bot that programmatically fills every field in the form's
   HTML will fill this one too, and the submit handler in
   `components/contact.tsx` silently discards the submission when it's
   non-empty. Requires no configuration.
2. **Cloudflare Turnstile** — a CAPTCHA alternative that runs in
   `interaction-only` mode, so it's invisible for most visitors and only
   shows a challenge when Cloudflare is unsure the visitor is human. The
   token it produces is verified server-side, in
   `app/api/contact/verify-turnstile/route.ts`, before the browser is
   allowed to call EmailJS — so a script that skips the widget entirely
   (e.g. calling the form's submit handler directly) still can't get an
   email sent without a valid, freshly-solved token.

Turnstile is opt-in: the form works without it (only the honeypot applies)
until both env vars below are set, mirroring how the EmailJS vars are
optional in local development.

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — public site key, exposed to the browser.
- `TURNSTILE_SECRET_KEY` — secret key, used only server-side to verify tokens.
  **Never** prefix this with `NEXT_PUBLIC_`.

To set it up:

1. Create a widget at the
   [Cloudflare Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
   with widget mode **Invisible** (or **Managed**).
2. Copy the **Site Key** and **Secret Key** into the env vars above, both
   locally (`.env.local`) and in Vercel.
3. Redeploy — the widget appears in the contact form automatically once
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
