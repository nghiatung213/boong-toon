export const runtime = "nodejs";

import { getSessionUserFromRequest } from "@/lib/auth/auth-service";
import {
  getUserNotifications,
  markAllRead,
} from "@/lib/data/repository/notification-repository";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonError("Unauthorized", 401);
  return jsonOk({ notifications: await getUserNotifications(user.id) });
}

export async function PATCH(request: Request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonError("Unauthorized", 401);
  const { markAllRead } = await import(
    "@/lib/data/repository/notification-repository"
  );
  await markAllRead(user.id);
  return jsonOk({ ok: true });
}
