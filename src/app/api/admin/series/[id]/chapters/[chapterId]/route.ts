export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import { updateChapter } from "@/lib/admin/series-service";
import type { ChapterInput } from "@/lib/admin/series-service";
import {
  deleteChapter,
  getChapterRecord,
  readChapterContentByFile,
} from "@/lib/data/repository/chapter-repository";

interface RouteParams {
  params: Promise<{ id: string; chapterId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { id, chapterId } = await params;
  const record = getChapterRecord(id, chapterId);
  if (!record) return jsonError("Không tìm thấy chương", 404);

  const content = readChapterContentByFile(record.file) ?? "";

  return jsonOk({ chapter: record, content });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const { id, chapterId } = await params;
    const body = (await request.json()) as Partial<ChapterInput>;
    const chapter = updateChapter(id, chapterId, body);
    return jsonOk({ chapter });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Lỗi cập nhật chương");
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const { id, chapterId } = await params;
  const ok = deleteChapter(id, chapterId);
  if (!ok) return jsonError("Không tìm thấy chương", 404);
  return jsonOk({ ok: true });
}
