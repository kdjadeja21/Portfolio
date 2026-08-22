# Contact form setup

The contact form uses EmailJS from the browser and optional Cloudflare Turnstile for bot protection.

## Environment variables

Copy `.env.example` to `.env.local` (and set the same vars in Vercel for production).

### EmailJS

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### Cloudflare Turnstile (optional)

Turnstile is opt-in: the form works without it (honeypot only) until both vars are set.

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — public site key, exposed to the browser.
- `TURNSTILE_SECRET_KEY` — secret key, server-side only. **Never** prefix with `NEXT_PUBLIC_`.

---

## EmailJS configuration

The app sends these template variables to EmailJS (see `components/contact.tsx`). The rendered HTML body and reply-to address are sent under alternate names so different EmailJS template presets work:

| Variable | Description |
|----------|-------------|
| `subject` | Email subject |
| `email_html` / `message_html` | Fully rendered email body (identical value), built by `lib/email-template.ts` |
| `from_email` / `reply_to` / `email` | Sender's address (identical value) |
| `name` | Also set to the sender's address (form only collects email) |
| `message` | Plain text fallback |
| `to_email` | Recipient |
| `site_name` | Site name |
| `submitted_at` | Submission timestamp |

### Setting up the EmailJS template

The email body is generated in code (`lib/email-template.ts`), not in the EmailJS dashboard editor. This avoids the common mistake of leaving EmailJS's default sample content in the template, which produces blank or generic emails.

To install the template, you only need 4 field values — no HTML to paste:

1. Go to the [EmailJS templates dashboard](https://dashboard.emailjs.com/admin/templates) and open your template.
2. On the **Content** tab, set:
   - **Subject**: `{{subject}}`
   - **Content**: `{{{message_html}}}` (or `{{{email_html}}}` — both work). Use **triple braces** so HTML renders instead of showing as literal text.
3. On the **Settings** tab, set:
   - **To Email**: `{{to_email}}`
   - **From Name**: `{{name}}` (or a static string like `Portfolio Contact`)
   - **Reply To**: `{{email}}` (or `{{reply_to}}` — both work)
4. Click **Save**, then use **Test It** to confirm the preview shows the dark card design — not EmailJS sample text and not a blank body.

See `email/emailjs-template.html` for the full setup reference.

---

## Bot protection

The contact form is protected in two ways:

### 1. Honeypot field

A hidden input (`company_website`) is invisible and unreachable to real visitors (removed from tab order, no autofill, zero-size). Bots that fill every field will fill this one too; the submit handler in `components/contact.tsx` silently discards those submissions. No configuration required.

### 2. Cloudflare Turnstile

A CAPTCHA alternative running in `interaction-only` mode — invisible for most visitors, challenge only when Cloudflare is unsure. The token is verified server-side in `app/api/contact/verify-turnstile/route.ts` before EmailJS is called, so scripts that skip the widget still can't send email without a valid token.

### Turnstile setup

1. Create a widget at the [Cloudflare Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile) with widget mode **Invisible** (or **Managed**).
2. Copy the **Site Key** and **Secret Key** into the env vars above, locally (`.env.local`) and in Vercel.
3. Redeploy — the widget appears in the contact form once `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
