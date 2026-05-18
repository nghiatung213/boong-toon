import "server-only";

import { Resend } from "resend";
import type { EmailOutboxEntry } from "@/lib/types/notification";
import { emailConfig, isEmailLive } from "@/lib/email/config";
import { renderWelcomeEmail } from "@/lib/email/templates/welcome";
import { renderPurchaseApprovedEmail } from "@/lib/email/templates/purchase-approved";
import { logEmailToOutbox } from "@/lib/email/outbox";

import type { SendEmailInput } from "@/lib/email/types";

export type { SendEmailInput };

export async function sendEmail(
  input: SendEmailInput,
): Promise<EmailOutboxEntry> {
  if (isEmailLive()) {
    const resend = new Resend(emailConfig.resendApiKey!);
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: emailConfig.replyTo,
    });

    if (error) {
      console.error("[MirAi Email] Resend error:", error);
      throw new Error(error.message ?? "Gửi email thất bại");
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info(
      `[MirAi Email Mock] → ${input.to}: ${input.subject} (set RESEND_API_KEY to send live)`,
    );
  }

  if (emailConfig.logToOutbox || !isEmailLive()) {
    return logEmailToOutbox(input);
  }

  return {
    id: `live_${Date.now()}`,
    to: input.to,
    subject: input.subject,
    template: input.template,
    html: input.html,
    createdAt: Date.now(),
  };
}

export async function sendWelcomeEmail(
  to: string,
  username: string,
  registeredAt = new Date(),
): Promise<EmailOutboxEntry> {
  const { subject, html } = renderWelcomeEmail({
    username,
    email: to,
    platformName: emailConfig.platformName,
    siteUrl: emailConfig.siteUrl,
    registeredAt,
  });

  return sendEmail({
    to,
    subject,
    html,
    template: "welcome",
  });
}

export async function sendPurchaseApprovedEmail(input: {
  to: string;
  username: string;
  seriesName: string;
  purchaseDate: Date;
  approvalDate: Date;
}): Promise<EmailOutboxEntry> {
  const libraryUrl = `${emailConfig.siteUrl}/library/purchased`;

  const { subject, html } = renderPurchaseApprovedEmail({
    username: input.username,
    email: input.to,
    seriesName: input.seriesName,
    platformName: emailConfig.platformName,
    siteUrl: emailConfig.siteUrl,
    purchaseDate: input.purchaseDate,
    approvalDate: input.approvalDate,
    libraryUrl,
  });

  return sendEmail({
    to: input.to,
    subject,
    html,
    template: "purchase_approved",
  });
}
