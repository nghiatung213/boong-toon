import "server-only";

import fs from "node:fs";
import type { AppNotification, NotificationType } from "@/lib/types/notification";
import { ensureDataDirs, getNotificationsPath } from "@/lib/data/repository/paths";
import { generateId } from "@/lib/utils/slug";

function readAll(): AppNotification[] {
  ensureDataDirs();
  const file = getNotificationsPath();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as AppNotification[];
}

function writeAll(items: AppNotification[]): void {
  ensureDataDirs();
  fs.writeFileSync(
    getNotificationsPath(),
    JSON.stringify(items, null, 2),
    "utf-8",
  );
}

export function getUserNotifications(userId: string): AppNotification[] {
  return readAll()
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getUnreadCount(userId: string): number {
  return getUserNotifications(userId).filter((n) => !n.read).length;
}

export function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
}): AppNotification {
  const items = readAll();
  const notification: AppNotification = {
    id: generateId("notif"),
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    href: input.href,
    read: false,
    createdAt: Date.now(),
  };
  items.push(notification);
  writeAll(items);
  return notification;
}

export function markNotificationRead(
  userId: string,
  notificationId: string,
): boolean {
  const items = readAll();
  const item = items.find((n) => n.id === notificationId && n.userId === userId);
  if (!item) return false;
  item.read = true;
  writeAll(items);
  return true;
}

export function markAllRead(userId: string): void {
  const items = readAll();
  items.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  writeAll(items);
}
