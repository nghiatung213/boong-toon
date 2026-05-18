import { createAdminClient } from "@/lib/supabase/admin";
import type { AppNotification, NotificationType } from "@/lib/types/notification";
import { generateId } from "@/lib/utils/slug";

function mapRow(row: Record<string, unknown>): AppNotification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    type: row.type as NotificationType,
    title: row.title as string,
    message: row.message as string,
    href: row.href as string | undefined,
    read: row.read as boolean,
    createdAt: new Date(row.created_at as string).getTime(),
  };
}

export async function getUserNotifications(
  userId: string,
): Promise<AppNotification[]> {
  const { data } = await createAdminClient()
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await createAdminClient()
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  return count ?? 0;
}

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
}): Promise<AppNotification> {
  const row = {
    id: generateId("notif"),
    user_id: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    href: input.href ?? null,
    read: false,
  };

  const { data, error } = await createAdminClient()
    .from("notifications")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<boolean> {
  const { error } = await createAdminClient()
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);
  return !error;
}

export async function markAllRead(userId: string): Promise<void> {
  await createAdminClient()
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId);
}
