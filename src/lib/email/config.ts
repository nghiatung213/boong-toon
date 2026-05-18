import { siteConfig } from "@/lib/config/site";

export const emailConfig = {
  platformName: siteConfig.webName,
  from:
    process.env.EMAIL_FROM ??
    `MirAi <onboarding@resend.dev>`,
  replyTo: process.env.EMAIL_REPLY_TO,
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  resendApiKey: process.env.RESEND_API_KEY,
  /** When true, also writes to data/email-outbox.json for audit/debug */
  logToOutbox: process.env.EMAIL_LOG_OUTBOX !== "false",
} as const;

export function isEmailLive(): boolean {
  return Boolean(emailConfig.resendApiKey?.trim());
}
