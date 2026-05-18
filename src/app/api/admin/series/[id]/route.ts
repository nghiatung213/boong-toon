export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import {
  removeSeries,
  updateSeries,
} from "@/lib/admin/series-service";
import { getSeriesById } from "@/lib/data/repository/catalog-repository";
import { getChaptersForSeriesId } from "@/lib/data/repository/chapter-repository";
import type { SeriesInput } from "@/lib/admin/series-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { id } = await params;
  const series = await getSeriesById(id);
  if (!series) return jsonError("Không tìm thấy truyện", 404);

  return jsonOk({
    series,
    chapters: await getChaptersForSeriesId(id),
  });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<SeriesInput>;
    const series = await updateSeries(id, body);
    return jsonOk({ series });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Lỗi cập nhật");
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const { id } = await params;
    await removeSeries(id);
    return jsonOk({ ok: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Lỗi xóa");
  }
}
