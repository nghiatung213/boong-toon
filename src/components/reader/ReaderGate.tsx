"use client";

import { ChapterPaywall } from "@/components/reader/ChapterPaywall";
import { ReaderExperience } from "@/components/reader/ReaderExperience";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLibrary } from "@/components/providers/LibraryProvider";
import type { Chapter, Series } from "@/lib/types/series";
import { isSeriesFree } from "@/lib/utils/series-pricing";

interface ReaderGateProps {
  series: Series;
  chapter: Chapter;
  markdown: string;
  prevId: string | null;
  nextId: string | null;
}

export function ReaderGate({
  series,
  chapter,
  markdown,
  prevId,
  nextId,
}: ReaderGateProps) {
  const { ready: authReady, hasEntitlement } = useAuth();
  const { ready: libReady, hasPurchasedSeries, hasPurchasedChapter } =
    useLibrary();
  const locked = Boolean(chapter.isLocked);
  const freeAccess = isSeriesFree(series);

  const entitled =
    freeAccess ||
    hasEntitlement(series.slug) ||
    hasPurchasedSeries(series.slug) ||
    hasPurchasedChapter(series.slug, chapter.id);

  if (locked && !freeAccess && (!authReady || !libReady)) {
    return (
      <GlassCard className="min-h-[40vh] animate-pulse" aria-busy="true" />
    );
  }

  if (locked && !entitled) {
    return (
      <ChapterPaywall
        seriesSlug={series.slug}
        seriesTitle={series.title}
        series={series}
        chapter={chapter}
      />
    );
  }

  return (
    <ReaderExperience
      seriesSlug={series.slug}
      seriesTitle={series.title}
      chapter={chapter}
      markdown={markdown}
      prevId={prevId}
      nextId={nextId}
    />
  );
}
