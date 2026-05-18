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
  /** Local dev only — Vercel filesystem is read-only */
  logToOutbox:
    process.env.EMAIL_LOG_OUTBOX === "true" &&
    process.env.NODE_ENV !== "production" &&
    !process.env.VERCEL,
} as const;

export function isEmailLive(): boolean {
  return Boolean(emailConfig.resendApiKey?.trim());
}
