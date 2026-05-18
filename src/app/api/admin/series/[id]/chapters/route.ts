export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import { createChapter } from "@/lib/admin/series-service";
import type { ChapterInput } from "@/lib/admin/series-service";
import { getChaptersForSeriesId } from "@/lib/data/repository/chapter-repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  const { id } = await params;
  return jsonOk({ chapters: getChaptersForSeriesId(id) });
}

export async function POST(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = (await request.json()) as ChapterInput;
    if (!body.title?.trim()) {
      return jsonError("Tiêu đề chương là bắt buộc");
    }
    if (!body.content?.trim()) {
      return jsonError("Nội dung chương là bắt buộc");
    }
    const chapter = createChapter(id, body);
    return jsonOk({ chapter }, 201);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Lỗi tạo chương");
  }
}
