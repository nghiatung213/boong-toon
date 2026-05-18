"use client";

import { useEffect, useState } from "react";
import { useLibrary } from "@/components/providers/LibraryProvider";
import { SeriesDetailActions } from "@/components/series/SeriesDetailActions";
import { SeriesHero } from "@/components/series/SeriesHero";
import type { Chapter, Series } from "@/lib/types/series";

interface SeriesHeroWithContinueProps {
  series: Series;
  firstChapter: Chapter | null;
  publishedChapterIds: string[];
  allChapterIds: string[];
}

export function SeriesHeroWithContinue({
  series,
  firstChapter,
  publishedChapterIds,
  allChapterIds,
}: SeriesHeroWithContinueProps) {
  const { ready, resolveContinueId } = useLibrary();
  const [continueChapterId, setContinueChapterId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!ready) return;
    setContinueChapterId(
      resolveContinueId(series.slug, publishedChapterIds, allChapterIds),
    );
  }, [
    ready,
    resolveContinueId,
    series.slug,
    publishedChapterIds,
    allChapterIds,
  ]);

  return (
    <SeriesHero
      series={series}
      firstChapter={firstChapter}
      continueChapterId={continueChapterId}
      footerActions={<SeriesDetailActions series={series} />}
    />
  );
}
