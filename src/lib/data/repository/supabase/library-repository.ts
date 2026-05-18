import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ChapterProgress,
  ContinueReadingEntry,
  HistoryEntry,
  MiraiLibrary,
} from "@/lib/types/library";
import { EMPTY_LIBRARY } from "@/lib/types/library";
import { progressKey } from "@/lib/storage/keys";

export async function loadUserLibrary(userId: string): Promise<MiraiLibrary> {
  const admin = createAdminClient();

  const [progressRes, continueRes, favoritesRes, historyRes] = await Promise.all([
    admin.from("reading_progress").select("*").eq("user_id", userId),
    admin.from("continue_reading").select("*").eq("user_id", userId),
    admin.from("favorites").select("series_slug").eq("user_id", userId),
    admin
      .from("reading_history")
      .select("*")
      .eq("user_id", userId)
      .order("read_at", { ascending: false })
      .limit(50),
  ]);

  const library: MiraiLibrary = structuredClone(EMPTY_LIBRARY);

  for (const row of progressRes.data ?? []) {
    const key = progressKey(row.series_slug as string, row.chapter_id as string);
    library.progress[key] = {
      seriesSlug: row.series_slug as string,
      chapterId: row.chapter_id as string,
      scrollY: row.scroll_y as number,
      percent: row.percent as number,
      updatedAt: new Date(row.updated_at as string).getTime(),
    };
  }

  for (const row of continueRes.data ?? []) {
    library.continue[row.series_slug as string] = {
      seriesSlug: row.series_slug as string,
      seriesTitle: row.series_title as string,
      chapterId: row.chapter_id as string,
      chapterTitle: row.chapter_title as string,
      percent: row.percent as number,
      updatedAt: new Date(row.updated_at as string).getTime(),
    };
  }

  library.favorites = (favoritesRes.data ?? []).map(
    (r) => r.series_slug as string,
  );

  library.history = (historyRes.data ?? []).map((row) => ({
    seriesSlug: row.series_slug as string,
    seriesTitle: row.series_title as string,
    chapterId: row.chapter_id as string,
    chapterTitle: row.chapter_title as string,
    readAt: new Date(row.read_at as string).getTime(),
  }));

  return library;
}

export async function saveUserLibrary(
  userId: string,
  library: MiraiLibrary,
): Promise<void> {
  const admin = createAdminClient();

  const progressRows = Object.values(library.progress).map((p) => ({
    user_id: userId,
    series_slug: p.seriesSlug,
    chapter_id: p.chapterId,
    scroll_y: p.scrollY,
    percent: p.percent,
    updated_at: new Date(p.updatedAt).toISOString(),
  }));

  const continueRows = Object.values(library.continue).map((c) => ({
    user_id: userId,
    series_slug: c.seriesSlug,
    series_title: c.seriesTitle,
    chapter_id: c.chapterId,
    chapter_title: c.chapterTitle,
    percent: c.percent,
    updated_at: new Date(c.updatedAt).toISOString(),
  }));

  const favoriteRows = library.favorites.map((slug) => ({
    user_id: userId,
    series_slug: slug,
  }));

  if (progressRows.length > 0) {
    await admin.from("reading_progress").upsert(progressRows, {
      onConflict: "user_id,series_slug,chapter_id",
    });
  }

  if (continueRows.length > 0) {
    await admin.from("continue_reading").upsert(continueRows, {
      onConflict: "user_id,series_slug",
    });
  }

  await admin.from("favorites").delete().eq("user_id", userId);
  if (favoriteRows.length > 0) {
    await admin.from("favorites").insert(favoriteRows);
  }
}

export async function pushHistoryEntry(
  userId: string,
  entry: HistoryEntry,
): Promise<void> {
  await createAdminClient().from("reading_history").insert({
    user_id: userId,
    series_slug: entry.seriesSlug,
    series_title: entry.seriesTitle,
    chapter_id: entry.chapterId,
    chapter_title: entry.chapterTitle,
    read_at: new Date(entry.readAt).toISOString(),
  });
}

export async function upsertChapterProgress(
  userId: string,
  progress: ChapterProgress,
): Promise<void> {
  await createAdminClient().from("reading_progress").upsert(
    {
      user_id: userId,
      series_slug: progress.seriesSlug,
      chapter_id: progress.chapterId,
      scroll_y: progress.scrollY,
      percent: progress.percent,
      updated_at: new Date(progress.updatedAt).toISOString(),
    },
    { onConflict: "user_id,series_slug,chapter_id" },
  );
}

export async function upsertContinueReading(
  userId: string,
  entry: ContinueReadingEntry,
): Promise<void> {
  await createAdminClient().from("continue_reading").upsert(
    {
      user_id: userId,
      series_slug: entry.seriesSlug,
      series_title: entry.seriesTitle,
      chapter_id: entry.chapterId,
      chapter_title: entry.chapterTitle,
      percent: entry.percent,
      updated_at: new Date(entry.updatedAt).toISOString(),
    },
    { onConflict: "user_id,series_slug" },
  );
}
