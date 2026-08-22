type ContactEmailTemplateInput = {
  senderEmail: string;
  message: string;
  submittedAt: string;
  siteName: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Builds the full HTML body for the contact-form notification email.
 *
 * This is sent to EmailJS as the `email_html` template variable. The
 * EmailJS template must reference it with triple braces —
 * `{{{email_html}}}` — so EmailJS renders it as HTML instead of escaping
 * it as text. Because triple-brace variables are rendered unescaped, every
 * user-supplied value is HTML-escaped here first to prevent HTML/script
 * injection in the recipient's inbox.
 */
export function buildContactEmailHtml({
  senderEmail,
  message,
  submittedAt,
  siteName,
}: ContactEmailTemplateInput): string {
  const safeSenderEmail = escapeHtml(senderEmail);
  const safeMessage = escapeHtml(message);
  const safeSiteName = escapeHtml(siteName);
  const safeSubmittedAt = escapeHtml(submittedAt);

  return `<div style="margin:0;padding:0;background:#0a0a0c;color:#f0efe9;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0c;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;overflow:hidden;border:1px solid rgba(240,239,233,0.12);border-radius:24px;background:#121216;">
          <tr>
            <td style="padding:28px 32px;border-bottom:1px solid rgba(240,239,233,0.1);background:radial-gradient(circle at top right, rgba(205,241,56,0.18), transparent 34%), #121216;">
              <p style="margin:0 0 12px;color:#cdf138;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;">New portfolio inquiry</p>
              <h1 style="margin:0;color:#f0efe9;font-size:28px;line-height:1.1;letter-spacing:-0.04em;">Someone reached out from ${safeSiteName}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;color:#8f8f98;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">Sender</p>
              <p style="margin:0 0 24px;color:#cdf138;font-size:18px;">${safeSenderEmail}</p>
              <p style="margin:0 0 8px;color:#8f8f98;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">Message</p>
              <div style="margin:0;padding:22px;border:1px solid rgba(240,239,233,0.1);border-radius:18px;background:#17171d;color:#f0efe9;font-size:16px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(240,239,233,0.1);color:#8f8f98;font-size:12px;line-height:1.6;">
              Sent at ${safeSubmittedAt}. Reply directly to this email to respond to ${safeSenderEmail}.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
}
