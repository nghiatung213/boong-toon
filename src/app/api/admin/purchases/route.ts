export const runtime = "nodejs";

import { requireAdmin, jsonOk } from "@/lib/admin/api-helpers";
import { listPurchaseRequests } from "@/lib/data/repository/purchase-repository";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as
    | "pending"
    | "approved"
    | "rejected"
    | null;
  const seriesSlug = searchParams.get("seriesSlug") ?? undefined;
  const userId = searchParams.get("userId") ?? undefined;
  const username = searchParams.get("username") ?? undefined;

  return jsonOk({
    purchases: await listPurchaseRequests({
      status: status ?? undefined,
      seriesSlug,
      userId,
      username,
    }),
  });
}
