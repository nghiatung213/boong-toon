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

export function getAllSeries(): Series[] {
  return getAllSeriesFromStore();
}

export function getSeriesBySlug(slug: string): Series | undefined {
  return getSeriesBySlugFromStore(slug);
}

export function getChaptersForSeries(seriesId: string): Chapter[] {
  return getChaptersForSeriesId(seriesId);
}

export function getPublishedChapters(seriesId: string): Chapter[] {
  return getChaptersForSeries(seriesId).filter(isChapterPublished);
}

export function getChapterById(
  seriesSlug: string,
  chapterId: string,
): Chapter | undefined {
  const series = getSeriesBySlug(seriesSlug);
  if (!series) return undefined;
  return getChaptersForSeries(series.id).find((c) => c.id === chapterId);
}

export function getAdjacentChapters(
  seriesSlug: string,
  chapterId: string,
): {
  prev: Chapter | null;
  next: Chapter | null;
  current: Chapter | null;
} {
  const series = getSeriesBySlug(seriesSlug);
  if (!series) return { prev: null, next: null, current: null };

  const published = getPublishedChapters(series.id);
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
