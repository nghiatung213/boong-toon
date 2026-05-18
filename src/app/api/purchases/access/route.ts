export const runtime = "nodejs";

import { getSessionUserFromRequest } from "@/lib/auth/auth-service";
import { getEntitlementStatus } from "@/lib/data/repository/purchase-repository";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

export async function GET(request: Request) {
  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonOk({ status: "none", entitled: false });

  const { searchParams } = new URL(request.url);
  const seriesSlug = searchParams.get("seriesSlug");
  if (!seriesSlug) return jsonError("seriesSlug required");

  const status = await getEntitlementStatus(user.id, seriesSlug);
  return jsonOk({
    status,
    entitled: status === "approved",
  });
}
