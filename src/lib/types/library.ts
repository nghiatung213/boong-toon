export interface ContinueReadingEntry {
  seriesSlug: string;
  seriesTitle: string;
  chapterId: string;
  chapterTitle: string;
  percent: number;
  updatedAt: number;
}

export interface ChapterProgress {
  seriesSlug: string;
  chapterId: string;
  scrollY: number;
  percent: number;
  updatedAt: number;
}

export interface HistoryEntry {
  seriesSlug: string;
  seriesTitle: string;
  chapterId: string;
  chapterTitle: string;
  readAt: number;
}

export interface PurchasedSeries {
  full: boolean;
  chapterIds: string[];
  purchasedAt: number;
}

export interface MiraiLibrary {
  version: 1;
  continue: Record<string, ContinueReadingEntry>;
  favorites: string[];
  purchased: Record<string, PurchasedSeries>;
  history: HistoryEntry[];
  progress: Record<string, ChapterProgress>;
}

export const EMPTY_LIBRARY: MiraiLibrary = {
  version: 1,
  continue: {},
  favorites: [],
  purchased: {},
  history: [],
  progress: {},
};
