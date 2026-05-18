interface EmailLayoutOptions {
  previewText: string;
  bodyHtml: string;
  siteUrl: string;
  platformName: string;
}

export function renderEmailLayout({
  previewText,
  bodyHtml,
  siteUrl,
  platformName,
}: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <title>${platformName}</title>
  <!--[if mso]><style type="text/css">body,table,td{font-family:Arial,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#0f0f12;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${previewText}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(160deg,#0f0f12 0%,#1a1520 50%,#0f0f12 100%);padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:rgba(24,24,30,0.98);border-radius:20px;border:1px solid rgba(255,107,129,0.25);overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.45);">
          <tr>
            <td style="padding:28px 28px 8px;text-align:center;background:linear-gradient(90deg,#ff6b81,#a29bfe);">
              <span style="font-size:22px;font-weight:800;color:#fff;letter-spacing:0.5px;">${platformName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#dfe4ea;font-size:15px;line-height:1.7;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;text-align:center;">
              <a href="${siteUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:linear-gradient(135deg,#ff6b81,#a29bfe);color:#fff;font-weight:700;text-decoration:none;font-size:14px;">Mở BoongToon</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;font-size:11px;color:#888;">
              © ${new Date().getFullYear()} ${platformName}. Bạn nhận email này vì đã đăng ký tài khoản hoặc mua truyện trên nền tảng.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
