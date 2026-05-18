import { renderEmailLayout } from "@/lib/email/templates/layout";

export interface PurchaseApprovedEmailVars {
  username: string;
  email: string;
  seriesName: string;
  platformName: string;
  siteUrl: string;
  purchaseDate: Date;
  approvalDate: Date;
  libraryUrl: string;
}

export function renderPurchaseApprovedEmail(
  vars: PurchaseApprovedEmailVars,
): { subject: string; html: string } {
  const purchaseStr = vars.purchaseDate.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const approvalStr = vars.approvalDate.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:24px;color:#ff6b81;">Premium đã được mở khóa! 🎉</h1>
    <p style="margin:0 0 12px;">Xin chào <strong>${escapeHtml(vars.username)}</strong>,</p>
    <p style="margin:0 0 12px;">Thanh toán của bạn đã được xác minh. Bạn đã sở hữu trọn bộ <strong style="color:#a29bfe;">${escapeHtml(vars.seriesName)}</strong> — bao gồm mọi chương hiện tại và chương mới phát hành sau này.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;border-radius:12px;background:rgba(255,107,129,0.08);border:1px solid rgba(255,107,129,0.2);">
      <tr><td style="padding:12px 16px;font-size:13px;color:#bbb;">Email</td><td style="padding:12px 16px;font-size:13px;text-align:right;">${escapeHtml(vars.email)}</td></tr>
      <tr><td style="padding:12px 16px;font-size:13px;color:#bbb;border-top:1px solid rgba(255,255,255,0.06);">Ngày yêu cầu</td><td style="padding:12px 16px;font-size:13px;text-align:right;border-top:1px solid rgba(255,255,255,0.06);">${purchaseStr}</td></tr>
      <tr><td style="padding:12px 16px;font-size:13px;color:#bbb;border-top:1px solid rgba(255,255,255,0.06);">Ngày duyệt</td><td style="padding:12px 16px;font-size:13px;text-align:right;border-top:1px solid rgba(255,255,255,0.06);color:#27ae60;font-weight:700;">${approvalStr}</td></tr>
    </table>
    <p style="margin:16px 0 0;text-align:center;">
      <a href="${vars.libraryUrl}" style="display:inline-block;padding:12px 28px;border-radius:999px;background:linear-gradient(135deg,#ff6b81,#a29bfe);color:#fff;font-weight:700;text-decoration:none;font-size:14px;">Mở thư viện đã mua</a>
    </p>
  `;

  return {
    subject: `Đã mở khóa: ${vars.seriesName} — ${vars.platformName}`,
    html: renderEmailLayout({
      previewText: `Truyện ${vars.seriesName} đã sẵn sàng để đọc.`,
      bodyHtml,
      siteUrl: vars.siteUrl,
      platformName: vars.platformName,
    }),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
