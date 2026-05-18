"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLibrary } from "@/components/providers/LibraryProvider";
import { getChapterProgress } from "@/lib/storage/library-store";

interface UseReadingSessionOptions {
  seriesSlug: string;
  seriesTitle: string;
  chapterId: string;
  chapterTitle: string;
  onRestoredScroll?: () => void;
}

function calcScrollPercent(): number {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  if (scrollHeight <= 0) return 0;
  return Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
}

export function useReadingSession({
  seriesSlug,
  seriesTitle,
  chapterId,
  chapterTitle,
  onRestoredScroll,
}: UseReadingSessionOptions) {
  const { saveContinue, saveProgress, pushHistory } = useLibrary();
  const restoredRef = useRef(false);
  const sessionKeyRef = useRef("");

  const sessionKey = `${seriesSlug}:${chapterId}`;

  const persistProgress = useCallback(() => {
    const scrollY = window.scrollY;
    const percent = calcScrollPercent();

    saveProgress({
      seriesSlug,
      chapterId,
      scrollY,
      percent,
      updatedAt: Date.now(),
    });

    saveContinue({
      seriesSlug,
      seriesTitle,
      chapterId,
      chapterTitle,
      percent,
      updatedAt: Date.now(),
    });
  }, [
    seriesSlug,
    seriesTitle,
    chapterId,
    chapterTitle,
    saveContinue,
    saveProgress,
  ]);

  useEffect(() => {
    if (sessionKeyRef.current === sessionKey) return;
    sessionKeyRef.current = sessionKey;
    restoredRef.current = false;

    const saved = getChapterProgress(seriesSlug, chapterId);

    saveContinue({
      seriesSlug,
      seriesTitle,
      chapterId,
      chapterTitle,
      percent: saved?.percent ?? 0,
      updatedAt: Date.now(),
    });

    pushHistory({
      seriesSlug,
      seriesTitle,
      chapterId,
      chapterTitle,
      readAt: Date.now(),
    });
  }, [
    sessionKey,
    seriesSlug,
    seriesTitle,
    chapterId,
    chapterTitle,
    saveContinue,
    pushHistory,
  ]);

  useEffect(() => {
    if (restoredRef.current) return;

    const saved = getChapterProgress(seriesSlug, chapterId);
    if (!saved || saved.scrollY <= 0) {
      restoredRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      window.scrollTo({ top: saved.scrollY, behavior: "smooth" });
      restoredRef.current = true;
      onRestoredScroll?.();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [sessionKey, seriesSlug, chapterId, onRestoredScroll]);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
          persistProgress();
        }
      }, 500);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, [persistProgress]);

  const getSavedScroll = useCallback(() => {
    return getChapterProgress(seriesSlug, chapterId);
  }, [seriesSlug, chapterId]);

  return { getSavedScroll, persistProgress };
}
