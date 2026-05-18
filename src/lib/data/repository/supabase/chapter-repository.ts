import { createAdminClient } from "@/lib/supabase/admin";
import type { ChapterRecord } from "@/lib/types/catalog";
import type { Chapter } from "@/lib/types/series";

function mapChapterRecord(
  seriesId: string,
  row: Record<string, unknown>,
): ChapterRecord {
  return {
    id: row.id as string,
    title: row.title as string,
    file: (row.file_path as string) || `content/${seriesId}/${row.id}.md`,
    order: (row.sort_order as number) ?? 0,
    isLocked: Boolean(row.is_locked),
    timestamp: row.published_at
      ? new Date(row.published_at as string).getTime()
      : undefined,
  };
}

function mapChapter(seriesId: string, record: ChapterRecord): Chapter {
  return {
    id: record.id,
    seriesId,
    title: record.title,
    order: record.order,
    file: record.file,
    isLocked: record.isLocked ?? false,
    timestamp: record.timestamp,
  };
}

function mapChapterRow(
  seriesId: string,
  record: ChapterRecord,
  contentMarkdown?: string | null,
): Record<string, unknown> {
  return {
    id: record.id,
    series_id: seriesId,
    title: record.title,
    file_path: record.file,
    content_markdown: contentMarkdown ?? null,
    sort_order: record.order,
    is_locked: record.isLocked ?? false,
    published_at: record.timestamp
      ? new Date(record.timestamp).toISOString()
      : null,
  };
}

function parseContentPath(relativeFile: string): {
  seriesId: string;
  chapterId: string;
} | null {
  const match = relativeFile.match(/^content\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return null;
  return { seriesId: match[1], chapterId: match[2] };
}

export async function getChaptersForSeriesId(seriesId: string): Promise<Chapter[]> {
  const { data, error } = await createAdminClient()
    .from("chapters")
    .select("*")
    .eq("series_id", seriesId)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) =>
    mapChapter(seriesId, mapChapterRecord(seriesId, row)),
  );
}

export async function getChapterRecord(
  seriesId: string,
  chapterId: string,
): Promise<ChapterRecord | undefined> {
  const { data, error } = await createAdminClient()
    .from("chapters")
    .select("*")
    .eq("series_id", seriesId)
    .eq("id", chapterId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapChapterRecord(seriesId, data) : undefined;
}

export async function upsertChapter(
  seriesId: string,
  record: ChapterRecord,
  contentMarkdown?: string,
): Promise<ChapterRecord> {
  const admin = createAdminClient();
  let markdown = contentMarkdown;
  if (markdown === undefined) {
    const { data: existing } = await admin
      .from("chapters")
      .select("content_markdown")
      .eq("series_id", seriesId)
      .eq("id", record.id)
      .maybeSingle();
    markdown = (existing?.content_markdown as string | null) ?? undefined;
  }

  const { data, error } = await admin
    .from("chapters")
    .upsert(mapChapterRow(seriesId, record, markdown), {
      onConflict: "series_id,id",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapChapterRecord(seriesId, data);
}

export async function deleteChapter(
  seriesId: string,
  chapterId: string,
): Promise<boolean> {
  const { data, error } = await createAdminClient()
    .from("chapters")
    .delete()
    .eq("series_id", seriesId)
    .eq("id", chapterId)
    .select("id");
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

export async function writeChapterContent(
  seriesId: string,
  chapterId: string,
  markdown: string,
): Promise<string> {
  const file = `content/${seriesId}/${chapterId}.md`;
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("chapters")
    .select("title, sort_order, is_locked, published_at")
    .eq("series_id", seriesId)
    .eq("id", chapterId)
    .maybeSingle();

  const { error } = await admin.from("chapters").upsert(
    {
      id: chapterId,
      series_id: seriesId,
      title: (existing?.title as string) ?? chapterId,
      file_path: file,
      content_markdown: markdown,
      sort_order: (existing?.sort_order as number) ?? 0,
      is_locked: (existing?.is_locked as boolean) ?? false,
      published_at: (existing?.published_at as string | null) ?? null,
    },
    { onConflict: "series_id,id" },
  );
  if (error) throw new Error(error.message);
  return file;
}

export async function readChapterContentByFile(
  relativeFile: string,
): Promise<string | null> {
  const admin = createAdminClient();

  const { data: byPath, error: pathError } = await admin
    .from("chapters")
    .select("content_markdown")
    .eq("file_path", relativeFile)
    .maybeSingle();
  if (pathError) throw new Error(pathError.message);
  if (byPath?.content_markdown != null && byPath.content_markdown !== "") {
    return byPath.content_markdown as string;
  }

  const parsed = parseContentPath(relativeFile);
  if (!parsed) return null;

  const { data, error } = await admin
    .from("chapters")
    .select("content_markdown")
    .eq("series_id", parsed.seriesId)
    .eq("id", parsed.chapterId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.content_markdown as string | null) ?? null;
}

export async function deleteSeriesChapters(seriesId: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("chapters")
    .delete()
    .eq("series_id", seriesId);
  if (error) throw new Error(error.message);
}
