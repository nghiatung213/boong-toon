export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import { handlePurchaseApproval } from "@/lib/services/purchase-service";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    adminNote?: string;
  };

  try {
    const result = await handlePurchaseApproval(id, body.adminNote);
    if (!result) return jsonError("Không tìm thấy yêu cầu", 404);
    return jsonOk({ purchase: result });
  } catch (e) {
    console.error("[MirAi] approve purchase", e);
    return jsonError(e instanceof Error ? e.message : "Duyệt thất bại", 500);
  }
}
