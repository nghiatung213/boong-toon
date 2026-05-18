export const runtime = "nodejs";

import { getSessionUserFromRequest } from "@/lib/auth/auth-service";
import { getSeriesBySlugFromStore } from "@/lib/data/repository/catalog-repository";
import {
  createPurchaseRequest,
  getUserPurchases,
} from "@/lib/data/repository/purchase-repository";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonError("Đăng nhập để xem", 401);
  return jsonOk({ purchases: await getUserPurchases(user.id) });
}

export async function POST(request: Request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonError("Đăng nhập để mua truyện", 401);

  const body = (await request.json()) as { seriesSlug?: string };
  const series = getSeriesBySlugFromStore(body.seriesSlug ?? "");
  if (!series) return jsonError("Không tìm thấy truyện");

  const purchase = await createPurchaseRequest({
    userId: user.id,
    username: user.username,
    email: user.email,
    seriesId: series.id,
    seriesSlug: series.slug,
    seriesTitle: series.title,
  });

  return jsonOk({ purchase }, 201);
}
