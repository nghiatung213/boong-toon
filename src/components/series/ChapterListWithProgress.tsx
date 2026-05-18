"use client";

import { useLibrary } from "@/components/providers/LibraryProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { ChapterCard } from "@/components/series/ChapterCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { progressKey } from "@/lib/storage/keys";
import type { Chapter, Series } from "@/lib/types/series";
import { isSeriesFree } from "@/lib/utils/series-pricing";

interface ChapterListWithProgressProps {
  series: Series;
  chapters: Chapter[];
  title?: string;
}

export function ChapterListWithProgress({
  series,
  chapters,
  title = "📖 Mục lục",
}: ChapterListWithProgressProps) {
  const { ready: libReady, library, hasPurchasedSeries, hasPurchasedChapter } =
    useLibrary();
  const { hasEntitlement } = useAuth();

  const fullAccess =
    isSeriesFree(series) ||
    hasEntitlement(series.slug) ||
    hasPurchasedSeries(series.slug);

  return (
    <GlassCard>
      <h2 className="mb-4 text-xl font-bold text-[var(--text)]">{title}</h2>
      {chapters.length === 0 ? (
        <p className="text-center opacity-70">
          Chưa có chương nào được phát hành.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {chapters.map((chapter) => {
            const locked =
              Boolean(chapter.isLocked) &&
              !fullAccess &&
              !hasPurchasedChapter(series.slug, chapter.id);

            const progress = libReady
              ? library.progress[progressKey(series.slug, chapter.id)]
              : null;

            return (
              <ChapterCard
                key={chapter.id}
                href={`/series/${series.slug}/read/${chapter.id}`}
                title={chapter.title}
                isLocked={locked}
                percent={progress?.percent}
              />
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
