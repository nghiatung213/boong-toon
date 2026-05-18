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

export async function listSeriesWithStats() {
  const catalog = await loadCatalog();
  return Promise.all(
    catalog.series.map(async (series) => {
      const chapters = await getChaptersForSeriesId(series.id);
      return {
        ...series,
        chapterCount: chapters.length,
        lockedCount: chapters.filter((c) => c.isLocked).length,
      };
    }),
  );
}

export async function createSeries(input: SeriesInput): Promise<Series> {
  const id = generateId("series");
  const slug =
    slugify(input.slug?.trim() ?? "") || slugify(input.title) || id;
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

export async function updateSeries(
  id: string,
  input: Partial<SeriesInput>,
): Promise<Series> {
  const existing = await getSeriesById(id);
  if (!existing) {
    throw new Error("Series not found");
  }

  const series: Series = {
    ...existing,
    title: input.title?.trim() ?? existing.title,
    slug: input.slug?.trim()
      ? slugify(input.slug.trim()) || existing.slug
      : existing.slug,
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

export async function removeSeries(id: string): Promise<void> {
  await deleteSeriesChapters(id);
  await deleteSeries(id);
}

export async function createChapter(
  seriesId: string,
  input: ChapterInput,
): Promise<ChapterRecord> {
  const chapters = await getChaptersForSeriesId(seriesId);
  const id = generateId("chap");
  const order =
    typeof input.order === "number" ? input.order : chapters.length;

  const file = `content/${seriesId}/${id}.md`;

  const record: ChapterRecord = {
    id,
    title: input.title.trim(),
    file,
    order,
    isLocked: input.isLocked ?? false,
    timestamp: input.timestamp ?? undefined,
  };

  return upsertChapter(seriesId, record, input.content);
}

export async function updateChapter(
  seriesId: string,
  chapterId: string,
  input: Partial<ChapterInput>,
): Promise<ChapterRecord> {
  const chapters = await getChaptersForSeriesId(seriesId);
  const existing = chapters.find((c) => c.id === chapterId);
  if (!existing) {
    throw new Error("Chapter not found");
  }

  const file =
    typeof input.content === "string"
      ? `content/${seriesId}/${chapterId}.md`
      : existing.file;

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

  return upsertChapter(
    seriesId,
    record,
    typeof input.content === "string" ? input.content : undefined,
  );
}
