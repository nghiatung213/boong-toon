import "server-only";

import { isSupabaseEnabled } from "@/lib/config/env";
import type { AppNotification, NotificationType } from "@/lib/types/notification";
import * as json from "@/lib/data/repository/json/notification-repository";
import * as supabase from "@/lib/data/repository/supabase/notification-repository";

export async function getUserNotifications(
  userId: string,
): Promise<AppNotification[]> {
  return isSupabaseEnabled()
    ? supabase.getUserNotifications(userId)
    : json.getUserNotifications(userId);
}

export async function getUnreadCount(userId: string): Promise<number> {
  return isSupabaseEnabled()
    ? supabase.getUnreadCount(userId)
    : json.getUnreadCount(userId);
}

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
}): Promise<AppNotification> {
  return isSupabaseEnabled()
    ? supabase.createNotification(input)
    : json.createNotification(input);
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<boolean> {
  return isSupabaseEnabled()
    ? supabase.markNotificationRead(userId, notificationId)
    : json.markNotificationRead(userId, notificationId);
}

export async function markAllRead(userId: string): Promise<void> {
  return isSupabaseEnabled()
    ? supabase.markAllRead(userId)
    : json.markAllRead(userId);
}
