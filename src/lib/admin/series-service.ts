import "server-only";

import {
  deleteSeries,
  getSeriesById,
  loadCatalog,
  upsertSeries,
} from "@/lib/data/repository/catalog-repository";
import {
  deleteSeriesChapters,
  getChaptersForSeriesId,
  upsertChapter,
  writeChapterContent,
} from "@/lib/data/repository/chapter-repository";
import type { ChapterRecord } from "@/lib/types/catalog";
import type { Series, SeriesStatus, SeriesType } from "@/lib/types/series";
import { generateId, slugify } from "@/lib/utils/slug";

export interface SeriesInput {
  title: string;
  slug?: string;
  type: SeriesType;
  synopsis: string;
  coverUrl: string;
  genres: string[];
  status: SeriesStatus;
  tagline?: string;
  isPremium?: boolean;
  price?: number;
}

export interface ChapterInput {
  title: string;
  content: string;
  isLocked?: boolean;
  timestamp?: number | null;
  order?: number;
}

export function listSeriesWithStats() {
  const catalog = loadCatalog();
  return catalog.series.map((series) => {
    const chapters = getChaptersForSeriesId(series.id);
    return {
      ...series,
      chapterCount: chapters.length,
      lockedCount: chapters.filter((c) => c.isLocked).length,
    };
  });
}

export function createSeries(input: SeriesInput): Series {
  const id = generateId("series");
  const slug = input.slug?.trim() || slugify(input.title) || id;
  const series: Series = {
    id,
    slug,
    title: input.title.trim(),
    type: input.type,
    synopsis: input.synopsis.trim(),
    coverUrl: input.coverUrl.trim(),
    genres: input.genres,
    status: input.status,
    tagline: input.tagline?.trim() || undefined,
    isPremium: input.isPremium ?? false,
    price: normalizePrice(input.price, input.isPremium ?? false),
  };
  return upsertSeries(series);
}

export function updateSeries(id: string, input: Partial<SeriesInput>): Series {
  const existing = getSeriesById(id);
  if (!existing) {
    throw new Error("Series not found");
  }

  const series: Series = {
    ...existing,
    title: input.title?.trim() ?? existing.title,
    slug: input.slug?.trim() || existing.slug,
    type: input.type ?? existing.type,
    synopsis: input.synopsis?.trim() ?? existing.synopsis,
    coverUrl: input.coverUrl?.trim() ?? existing.coverUrl,
    genres: input.genres ?? existing.genres,
    status: input.status ?? existing.status,
    tagline: input.tagline?.trim() ?? existing.tagline,
    isPremium: input.isPremium ?? existing.isPremium,
    price:
      input.price !== undefined
        ? normalizePrice(
            input.price,
            input.isPremium ?? existing.isPremium ?? false,
          )
        : existing.price,
  };

  return upsertSeries(series);
}

function normalizePrice(price: number | undefined, isPremium: boolean): number {
  if (typeof price === "number" && price >= 0) return Math.round(price);
  return isPremium ? 49_000 : 0;
}

export function removeSeries(id: string): void {
  deleteSeriesChapters(id);
  deleteSeries(id);
}

export function createChapter(
  seriesId: string,
  input: ChapterInput,
): ChapterRecord {
  const chapters = getChaptersForSeriesId(seriesId);
  const id = generateId("chap");
  const order =
    typeof input.order === "number" ? input.order : chapters.length;

  const file = writeChapterContent(seriesId, id, input.content);

  const record: ChapterRecord = {
    id,
    title: input.title.trim(),
    file,
    order,
    isLocked: input.isLocked ?? false,
    timestamp: input.timestamp ?? undefined,
  };

  return upsertChapter(seriesId, record);
}

export function updateChapter(
  seriesId: string,
  chapterId: string,
  input: Partial<ChapterInput>,
): ChapterRecord {
  const chapters = getChaptersForSeriesId(seriesId);
  const existing = chapters.find((c) => c.id === chapterId);
  if (!existing) {
    throw new Error("Chapter not found");
  }

  let file = existing.file;
  if (typeof input.content === "string") {
    file = writeChapterContent(seriesId, chapterId, input.content);
  }

  const record: ChapterRecord = {
    id: chapterId,
    title: input.title?.trim() ?? existing.title,
    file,
    order: input.order ?? existing.order,
    isLocked: input.isLocked ?? existing.isLocked,
    timestamp:
      input.timestamp === null
        ? undefined
        : (input.timestamp ?? existing.timestamp),
  };

  return upsertChapter(seriesId, record);
}
