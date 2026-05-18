"use client";

import Image from "next/image";
import Link from "next/link";
import { useLibrary } from "@/components/providers/LibraryProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Series } from "@/lib/types/series";

interface ContinueReadingSectionProps {
  seriesCatalog: Series[];
}

export function ContinueReadingSection({
  seriesCatalog,
}: ContinueReadingSectionProps) {
  const { ready, continueList } = useLibrary();

  if (!ready || continueList.length === 0) {
    return null;
  }

  const seriesMap = Object.fromEntries(
    seriesCatalog.map((s) => [s.slug, s]),
  );

  return (
    <GlassCard>
      <h2 className="mb-4 text-xl font-bold">📖 Đọc tiếp</h2>
      <div className="flex flex-col gap-3">
        {continueList.map((entry) => {
          const series = seriesMap[entry.seriesSlug];
          if (!series) return null;

          return (
            <Link
              key={`${entry.seriesSlug}-${entry.chapterId}`}
              href={`/series/${entry.seriesSlug}/read/${entry.chapterId}`}
              className="flex items-center gap-4 rounded-xl bg-[var(--chap-card-bg)] p-3 transition duration-300 hover:translate-x-1 hover:border-l-4 hover:border-[var(--primary)]"
            >
              <div className="relative hidden h-16 w-12 shrink-0 overflow-hidden rounded-lg sm:block">
                <Image
                  src={series.coverUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[var(--primary)]">
                  {series.title}
                </p>
                <p className="truncate font-semibold">{entry.chapterTitle}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all"
                    style={{ width: `${entry.percent}%` }}
                  />
                </div>
                <p className="mt-1 text-xs opacity-60">
                  {entry.percent}% hoàn thành
                </p>
              </div>
              <span className="shrink-0 text-lg" aria-hidden>
                →
              </span>
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
}
