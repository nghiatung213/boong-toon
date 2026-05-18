import {
  getAllSeriesFromStore,
  getSeriesBySlugFromStore,
} from "@/lib/data/repository/catalog-repository";
import { getChaptersForSeriesId } from "@/lib/data/repository/chapter-repository";
import type { Chapter, Series } from "@/lib/types/series";

export function isChapterPublished(chapter: Chapter, now = Date.now()): boolean {
  if (!chapter.timestamp) return true;
  return chapter.timestamp <= now;
}

export async function getAllSeries(): Promise<Series[]> {
  return getAllSeriesFromStore();
}

export async function getSeriesBySlug(slug: string): Promise<Series | undefined> {
  return getSeriesBySlugFromStore(slug);
}

export async function getChaptersForSeries(seriesId: string): Promise<Chapter[]> {
  return getChaptersForSeriesId(seriesId);
}

export async function getPublishedChapters(seriesId: string): Promise<Chapter[]> {
  const chapters = await getChaptersForSeries(seriesId);
  return chapters.filter(isChapterPublished);
}

export async function getChapterById(
  seriesSlug: string,
  chapterId: string,
): Promise<Chapter | undefined> {
  const series = await getSeriesBySlug(seriesSlug);
  if (!series) return undefined;
  const chapters = await getChaptersForSeries(series.id);
  return chapters.find((c) => c.id === chapterId);
}

export async function getAdjacentChapters(
  seriesSlug: string,
  chapterId: string,
): Promise<{
  prev: Chapter | null;
  next: Chapter | null;
  current: Chapter | null;
}> {
  const series = await getSeriesBySlug(seriesSlug);
  if (!series) return { prev: null, next: null, current: null };

  const published = await getPublishedChapters(series.id);
  const index = published.findIndex((c) => c.id === chapterId);
  if (index === -1) {
    return { prev: null, next: null, current: null };
  }

  return {
    current: published[index],
    prev: index > 0 ? published[index - 1] : null,
    next: index < published.length - 1 ? published[index + 1] : null,
  };
}
