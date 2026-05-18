export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import {
  createSeries,
  listSeriesWithStats,
} from "@/lib/admin/series-service";
import type { SeriesInput } from "@/lib/admin/series-service";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  return jsonOk({ series: await listSeriesWithStats() });
}

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const body = (await request.json()) as SeriesInput;
    if (!body.title?.trim()) {
      return jsonError("Tiêu đề là bắt buộc");
    }
    const series = await createSeries(body);
    return jsonOk({ series }, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Lỗi tạo truyện");
  }
}
