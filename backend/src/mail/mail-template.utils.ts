import { mailColors } from './colors';

export interface MailDetail {
  label: string;
  value: string;
}

export interface BrandedMailTemplate {
  eyebrow: string;
  title: string;
  greeting: string;
  message: string;
  details: MailDetail[];
  actionLabel: string;
  actionUrl: string;
  footer: string;
}

export function buildBrandedMailHtml(template: BrandedMailTemplate) {
  const details = template.details
    .map(
      (detail) => `<tr>
        <td style="padding:10px 12px;color:${mailColors.textMuted};font-size:13px;border-bottom:1px solid ${mailColors.border};">${escapeHtml(detail.label)}</td>
        <td style="padding:10px 12px;color:${mailColors.text};font-size:14px;font-weight:700;text-align:right;border-bottom:1px solid ${mailColors.border};">${escapeHtml(detail.value)}</td>
      </tr>`
    )
    .join('');

  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:${mailColors.background};font-family:Arial,sans-serif;color:${mailColors.text};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${mailColors.background};padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:${mailColors.surface};border:1px solid ${mailColors.border};border-radius:22px;overflow:hidden;">
          <tr><td style="padding:24px 30px;background:${mailColors.primary};">
            <img src="cid:homeeasy-logo" width="48" height="48" alt="Logo Home Easy" style="display:inline-block;width:48px;height:48px;object-fit:contain;vertical-align:middle;" />
            <span style="margin-left:10px;color:${mailColors.surface};font-size:22px;font-weight:800;vertical-align:middle;">home easy</span>
          </td></tr>
          <tr><td style="padding:34px 30px;">
            <div style="color:${mailColors.accent};font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">${escapeHtml(template.eyebrow)}</div>
            <h1 style="margin:10px 0 18px;color:${mailColors.text};font-size:30px;line-height:1.2;">${escapeHtml(template.title)}</h1>
            <p style="margin:0 0 8px;font-size:16px;line-height:1.6;">${escapeHtml(template.greeting)}</p>
            <p style="margin:0 0 24px;color:${mailColors.textMuted};font-size:15px;line-height:1.65;">${escapeHtml(template.message)}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:26px;border:1px solid ${mailColors.border};border-radius:14px;border-collapse:separate;overflow:hidden;">${details}</table>
            <a href="${escapeHtml(template.actionUrl)}" style="display:inline-block;padding:14px 22px;border-radius:12px;background:${mailColors.primary};color:${mailColors.surface};font-size:15px;font-weight:800;text-decoration:none;">${escapeHtml(template.actionLabel)}</a>
          </td></tr>
          <tr><td style="padding:20px 30px;background:${mailColors.background};color:${mailColors.textMuted};font-size:12px;line-height:1.5;">${escapeHtml(template.footer)}</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function buildBrandedMailText(template: BrandedMailTemplate) {
  const details = template.details.map((detail) => `${detail.label}: ${detail.value}`).join('\n');
  return `${template.greeting}\n\n${template.message}\n\n${details}\n\n${template.actionLabel}: ${template.actionUrl}\n\n${template.footer}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
