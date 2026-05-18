import "server-only";

import { isSupabaseEnabled } from "@/lib/config/env";
import type { ChapterRecord } from "@/lib/types/catalog";
import type { Chapter } from "@/lib/types/series";
import * as json from "@/lib/data/repository/json/chapter-repository";
import * as supabase from "@/lib/data/repository/supabase/chapter-repository";

export async function getChaptersForSeriesId(
  seriesId: string,
): Promise<Chapter[]> {
  return isSupabaseEnabled()
    ? supabase.getChaptersForSeriesId(seriesId)
    : json.getChaptersForSeriesId(seriesId);
}

export async function getChapterRecord(
  seriesId: string,
  chapterId: string,
): Promise<ChapterRecord | undefined> {
  return isSupabaseEnabled()
    ? supabase.getChapterRecord(seriesId, chapterId)
    : json.getChapterRecord(seriesId, chapterId);
}

export async function upsertChapter(
  seriesId: string,
  record: ChapterRecord,
  contentMarkdown?: string,
): Promise<ChapterRecord> {
  return isSupabaseEnabled()
    ? supabase.upsertChapter(seriesId, record, contentMarkdown)
    : json.upsertChapter(seriesId, record);
}

export async function deleteChapter(
  seriesId: string,
  chapterId: string,
): Promise<boolean> {
  return isSupabaseEnabled()
    ? supabase.deleteChapter(seriesId, chapterId)
    : json.deleteChapter(seriesId, chapterId);
}

export async function writeChapterContent(
  seriesId: string,
  chapterId: string,
  markdown: string,
): Promise<string> {
  return isSupabaseEnabled()
    ? supabase.writeChapterContent(seriesId, chapterId, markdown)
    : json.writeChapterContent(seriesId, chapterId, markdown);
}

export async function readChapterContentByFile(
  relativeFile: string,
): Promise<string | null> {
  return isSupabaseEnabled()
    ? supabase.readChapterContentByFile(relativeFile)
    : json.readChapterContentByFile(relativeFile);
}

export async function deleteSeriesChapters(seriesId: string): Promise<void> {
  return isSupabaseEnabled()
    ? supabase.deleteSeriesChapters(seriesId)
    : json.deleteSeriesChapters(seriesId);
}
