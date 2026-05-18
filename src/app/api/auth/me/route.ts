import "server-only";

import { getSessionUserFromRequest } from "@/lib/auth/auth-service";
import { jsonOk } from "@/lib/admin/api-helpers";
import {
  getUserEntitlements,
  getUserPurchases,
} from "@/lib/data/repository/purchase-repository";
import { getUnreadCount } from "@/lib/data/repository/notification-repository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonOk({ user: null });

  const entitlements = await getUserEntitlements(user.id);
  const purchases = await getUserPurchases(user.id);

  return jsonOk({
    user,
    entitlements: entitlements.map((e) => e.seriesSlug),
    purchases: purchases.map((p) => ({
      id: p.id,
      seriesSlug: p.seriesSlug,
      seriesTitle: p.seriesTitle,
      status: p.status,
      transferNote: p.transferNote,
      createdAt: p.createdAt,
    })),
    unreadNotifications: await getUnreadCount(user.id),
  });
}
