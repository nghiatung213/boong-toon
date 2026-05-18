import { renderEmailLayout } from "@/lib/email/templates/layout";

export interface WelcomeEmailVars {
  username: string;
  email: string;
  platformName: string;
  siteUrl: string;
  registeredAt: Date;
}

export function renderWelcomeEmail(vars: WelcomeEmailVars): {
  subject: string;
  html: string;
} {
  const dateStr = vars.registeredAt.toLocaleString("vi-VN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:24px;color:#ff6b81;">Chào mừng, ${escapeHtml(vars.username)}! ✨</h1>
    <p style="margin:0 0 12px;">Cảm ơn bạn đã gia nhập <strong style="color:#a29bfe;">${escapeHtml(vars.platformName)}</strong>.</p>
    <p style="margin:0 0 12px;">Tài khoản <strong>${escapeHtml(vars.email)}</strong> đã được tạo thành công vào lúc <strong>${dateStr}</strong>.</p>
    <p style="margin:0 0 12px;">Từ nay, mọi thông báo xác minh mua truyện premium và cập nhật quan trọng sẽ được gửi tới email này.</p>
    <p style="margin:16px 0 0;padding:14px;border-radius:12px;background:rgba(162,155,254,0.12);border:1px solid rgba(162,155,254,0.25);font-size:14px;">
      💌 Hãy khám phá thư viện truyện và bắt đầu hành trình đọc của bạn.
    </p>
  `;

  return {
    subject: `Chào mừng đến ${vars.platformName}`,
    html: renderEmailLayout({
      previewText: `Đăng ký thành công — chào mừng ${vars.username}!`,
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
