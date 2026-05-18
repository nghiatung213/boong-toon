import "server-only";

import fs from "node:fs";
import type { EmailOutboxEntry } from "@/lib/types/notification";
import { ensureDataDirs, getEmailOutboxPath } from "@/lib/data/repository/paths";
import { generateId } from "@/lib/utils/slug";

function readOutbox(): EmailOutboxEntry[] {
  ensureDataDirs();
  const file = getEmailOutboxPath();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as EmailOutboxEntry[];
}

function writeOutbox(items: EmailOutboxEntry[]): void {
  ensureDataDirs();
  fs.writeFileSync(getEmailOutboxPath(), JSON.stringify(items, null, 2), "utf-8");
}

function wrapHtml(body: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#0f0f12;color:#dfe4ea;padding:24px"><div style="max-width:520px;margin:0 auto;background:rgba(30,30,30,.95);border-radius:16px;padding:28px;border:1px solid rgba(255,107,129,.3)">${body}</div></body></html>`;
}

export async function sendMockEmail(input: {
  to: string;
  subject: string;
  template: string;
  bodyHtml: string;
}): Promise<EmailOutboxEntry> {
  const entry: EmailOutboxEntry = {
    id: generateId("email"),
    to: input.to,
    subject: input.subject,
    template: input.template,
    html: wrapHtml(input.bodyHtml),
    createdAt: Date.now(),
  };
  const items = readOutbox();
  items.unshift(entry);
  writeOutbox(items.slice(0, 200));
  if (process.env.NODE_ENV === "development") {
    console.info(`[MirAi Email Mock] → ${input.to}: ${input.subject}`);
  }
  return entry;
}

export function sendWelcomeEmail(to: string, username: string): Promise<EmailOutboxEntry> {
  return sendMockEmail({
    to,
    subject: "Chào mừng đến MirAi Project",
    template: "welcome",
    bodyHtml: `
      <h1 style="color:#ff6b81">Chào ${username}!</h1>
      <p>Đăng ký thành công. Từ nay, mọi thông báo xác minh mua truyện sẽ được gửi qua email này.</p>
    `,
  });
}

export function sendPurchaseApprovedEmail(
  to: string,
  username: string,
  seriesTitle: string,
): Promise<EmailOutboxEntry> {
  return sendMockEmail({
    to,
    subject: `Đã mở khóa: ${seriesTitle}`,
    template: "purchase_approved",
    bodyHtml: `
      <h1 style="color:#ff6b81">Mua truyện thành công</h1>
      <p>Xin chào <strong>${username}</strong>,</p>
      <p>Admin đã xác minh thanh toán. Bạn đã sở hữu trọn bộ <strong>${seriesTitle}</strong> — bao gồm mọi chương hiện tại và tương lai.</p>
      <p><a href="/library/purchased" style="color:#a29bfe">Mở thư viện đã mua →</a></p>
    `,
  });
}
