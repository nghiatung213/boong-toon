"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ChapterProgress,
  ContinueReadingEntry,
  HistoryEntry,
  MiraiLibrary,
} from "@/lib/types/library";
import { EMPTY_LIBRARY } from "@/lib/types/library";
import {
  addHistoryEntry,
  getChapterProgress,
  getContinueReading,
  getLibrary,
  isChapterPurchased,
  isFavorite,
  isSeriesPurchased,
  purchaseChapter,
  purchaseSeries,
  resolveContinueChapterId,
  setChapterProgress,
  setContinueReading,
  subscribeLibrary,
  toggleFavorite,
} from "@/lib/storage/library-store";

interface LibraryContextValue {
  ready: boolean;
  library: MiraiLibrary;
  continueList: ContinueReadingEntry[];
  favorites: string[];
  purchased: MiraiLibrary["purchased"];
  history: HistoryEntry[];
  getContinue: (seriesSlug: string) => ContinueReadingEntry | null;
  resolveContinueId: (
    seriesSlug: string,
    publishedIds: string[],
    allIds?: string[],
  ) => string | null;
  saveContinue: (entry: ContinueReadingEntry) => void;
  saveProgress: (progress: ChapterProgress) => void;
  getProgress: (seriesSlug: string, chapterId: string) => ChapterProgress | null;
  pushHistory: (entry: HistoryEntry) => void;
  toggleFavoriteSeries: (seriesSlug: string) => boolean;
  isSeriesFavorite: (seriesSlug: string) => boolean;
  buySeries: (seriesSlug: string) => void;
  buyChapter: (seriesSlug: string, chapterId: string) => void;
  hasPurchasedSeries: (seriesSlug: string) => boolean;
  hasPurchasedChapter: (seriesSlug: string, chapterId: string) => boolean;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<MiraiLibrary>(EMPTY_LIBRARY);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setLibrary(getLibrary());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
    return subscribeLibrary(refresh);
  }, [refresh]);

  const saveContinue = useCallback(
    (entry: ContinueReadingEntry) => {
      setContinueReading(entry);
      refresh();
    },
    [refresh],
  );

  const saveProgress = useCallback(
    (progress: ChapterProgress) => {
      setChapterProgress(progress);
      refresh();
    },
    [refresh],
  );

  const pushHistory = useCallback(
    (entry: HistoryEntry) => {
      addHistoryEntry(entry);
      refresh();
    },
    [refresh],
  );

  const toggleFavoriteSeries = useCallback(
    (slug: string) => {
      const added = toggleFavorite(slug);
      refresh();
      return added;
    },
    [refresh],
  );

  const buySeries = useCallback(
    (slug: string) => {
      purchaseSeries(slug, true);
      refresh();
    },
    [refresh],
  );

  const buyChapter = useCallback(
    (slug: string, chapterId: string) => {
      purchaseChapter(slug, chapterId);
      refresh();
    },
    [refresh],
  );

  const value = useMemo<LibraryContextValue>(
    () => ({
      ready,
      library,
      continueList: Object.values(library.continue).sort(
        (a, b) => b.updatedAt - a.updatedAt,
      ),
      favorites: library.favorites,
      purchased: library.purchased,
      history: library.history,
      getContinue: getContinueReading,
      resolveContinueId: resolveContinueChapterId,
      saveContinue,
      saveProgress,
      getProgress: getChapterProgress,
      pushHistory,
      toggleFavoriteSeries,
      isSeriesFavorite: isFavorite,
      buySeries,
      buyChapter,
      hasPurchasedSeries: isSeriesPurchased,
      hasPurchasedChapter: isChapterPurchased,
    }),
    [
      library,
      ready,
      saveContinue,
      saveProgress,
      pushHistory,
      toggleFavoriteSeries,
      buySeries,
      buyChapter,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error("useLibrary must be used within LibraryProvider");
  }
  return ctx;
}
