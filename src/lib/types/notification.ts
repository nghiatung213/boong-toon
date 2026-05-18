export type NotificationType =
  | "purchase_approved"
  | "purchase_rejected"
  | "welcome"
  | "system";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  read: boolean;
  createdAt: number;
}

export interface EmailOutboxEntry {
  id: string;
  to: string;
  subject: string;
  template: string;
  html: string;
  createdAt: number;
}
