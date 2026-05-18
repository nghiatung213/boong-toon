export const runtime = "nodejs";

import { getSessionUserFromRequest } from "@/lib/auth/auth-service";
import { markNotificationRead } from "@/lib/data/repository/notification-repository";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonError("Unauthorized", 401);
  const { id } = await params;
  await markNotificationRead(user.id, id);
  return jsonOk({ ok: true });
}
