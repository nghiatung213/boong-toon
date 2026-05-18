import type {
  ChapterProgress,
  ContinueReadingEntry,
  HistoryEntry,
  MiraiLibrary,
  PurchasedSeries,
} from "@/lib/types/library";
import { EMPTY_LIBRARY } from "@/lib/types/library";
import { readJson, readRaw, writeJson, writeRaw } from "@/lib/storage/client";
import { progressKey, storageKeys } from "@/lib/storage/keys";

const HISTORY_LIMIT = 50;

function loadLibrary(): MiraiLibrary {
  const stored = readJson<MiraiLibrary | null>(storageKeys.library, null);
  if (stored?.version === 1) {
    return { ...EMPTY_LIBRARY, ...stored };
  }
  return migrateLegacyLibrary();
}

function saveLibrary(library: MiraiLibrary): void {
  writeJson(storageKeys.library, library);
  if (isBrowserDispatch()) {
    window.dispatchEvent(new CustomEvent("mirai-library-updated"));
  }
}

function isBrowserDispatch(): boolean {
  return typeof window !== "undefined";
}

function migrateLegacyLibrary(): MiraiLibrary {
  return structuredClone(EMPTY_LIBRARY);
}

export function getLibrary(): MiraiLibrary {
  return loadLibrary();
}

export function subscribeLibrary(listener: () => void): () => void {
  if (!isBrowserDispatch()) return () => undefined;
  const handler = () => listener();
  window.addEventListener("mirai-library-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("mirai-library-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

export function setContinueReading(entry: ContinueReadingEntry): void {
  const library = loadLibrary();
  library.continue[entry.seriesSlug] = entry;
  writeRaw(storageKeys.continue(entry.seriesSlug), entry.chapterId);
  saveLibrary(library);
}

export function getContinueReading(
  seriesSlug: string,
): ContinueReadingEntry | null {
  const library = loadLibrary();
  return library.continue[seriesSlug] ?? null;
}

export function getAllContinueReading(): ContinueReadingEntry[] {
  const library = loadLibrary();
  return Object.values(library.continue).sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );
}

export function setChapterProgress(progress: ChapterProgress): void {
  const library = loadLibrary();
  const key = progressKey(progress.seriesSlug, progress.chapterId);
  library.progress[key] = progress;
  writeRaw(
    storageKeys.scroll(progress.seriesSlug, progress.chapterId),
    String(progress.scrollY),
  );
  saveLibrary(library);
}

export function getChapterProgress(
  seriesSlug: string,
  chapterId: string,
): ChapterProgress | null {
  const library = loadLibrary();
  const key = progressKey(seriesSlug, chapterId);
  const fromLibrary = library.progress[key];
  if (fromLibrary) return fromLibrary;

  const legacyScroll = readRaw(storageKeys.scroll(seriesSlug, chapterId));
  if (!legacyScroll) return null;
  const scrollY = parseInt(legacyScroll, 10);
  if (Number.isNaN(scrollY)) return null;

  return {
    seriesSlug,
    chapterId,
    scrollY,
    percent: 0,
    updatedAt: Date.now(),
  };
}

export function addHistoryEntry(entry: HistoryEntry): void {
  const library = loadLibrary();
  library.history = [
    entry,
    ...library.history.filter(
      (h) =>
        !(h.seriesSlug === entry.seriesSlug && h.chapterId === entry.chapterId),
    ),
  ].slice(0, HISTORY_LIMIT);
  saveLibrary(library);
}

export function getHistory(): HistoryEntry[] {
  return loadLibrary().history;
}

export function toggleFavorite(seriesSlug: string): boolean {
  const library = loadLibrary();
  const index = library.favorites.indexOf(seriesSlug);
  if (index >= 0) {
    library.favorites.splice(index, 1);
    saveLibrary(library);
    return false;
  }
  library.favorites.push(seriesSlug);
  saveLibrary(library);
  return true;
}

export function isFavorite(seriesSlug: string): boolean {
  return loadLibrary().favorites.includes(seriesSlug);
}

export function getFavorites(): string[] {
  return loadLibrary().favorites;
}

export function purchaseSeries(seriesSlug: string, full = true): void {
  const library = loadLibrary();
  library.purchased[seriesSlug] = {
    full,
    chapterIds: library.purchased[seriesSlug]?.chapterIds ?? [],
    purchasedAt: Date.now(),
  };
  saveLibrary(library);
}

export function purchaseChapter(seriesSlug: string, chapterId: string): void {
  const library = loadLibrary();
  const existing = library.purchased[seriesSlug] ?? {
    full: false,
    chapterIds: [],
    purchasedAt: Date.now(),
  };
  if (!existing.chapterIds.includes(chapterId)) {
    existing.chapterIds.push(chapterId);
  }
  existing.purchasedAt = Date.now();
  library.purchased[seriesSlug] = existing;
  saveLibrary(library);
}

export function isSeriesPurchased(seriesSlug: string): boolean {
  const entry = loadLibrary().purchased[seriesSlug];
  return Boolean(entry?.full);
}

export function isChapterPurchased(
  seriesSlug: string,
  chapterId: string,
): boolean {
  const entry = loadLibrary().purchased[seriesSlug];
  if (!entry) return false;
  if (entry.full) return true;
  return entry.chapterIds.includes(chapterId);
}

export function getPurchasedSeries(): Record<string, PurchasedSeries> {
  return loadLibrary().purchased;
}

export function resolveContinueChapterId(
  seriesSlug: string,
  publishedChapterIds: string[],
  allChapterIds?: string[],
): string | null {
  const entry = getContinueReading(seriesSlug);
  if (entry?.chapterId && publishedChapterIds.includes(entry.chapterId)) {
    return entry.chapterId;
  }

  const legacyContinue = readRaw(storageKeys.continue(seriesSlug));
  if (legacyContinue && publishedChapterIds.includes(legacyContinue)) {
    return legacyContinue;
  }

  const legacyIndex = readRaw(storageKeys.legacyBookmark);
  if (legacyIndex && seriesSlug === "mirai") {
    const ids = allChapterIds ?? publishedChapterIds;
    const index = parseInt(legacyIndex, 10);
    if (!Number.isNaN(index) && ids[index]) {
      const id = ids[index];
      if (publishedChapterIds.includes(id)) return id;
    }
  }

  return null;
}
