import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SeriesPriceBadge } from "@/components/series/SeriesPriceBadge";
import type { Chapter, Series } from "@/lib/types/series";
import { formatSeriesPrice, requiresPurchase } from "@/lib/utils/series-pricing";

interface SeriesHeroProps {
  series: Series;
  firstChapter?: Chapter | null;
  continueChapterId?: string | null;
  footerActions?: ReactNode;
}

export function SeriesHero({
  series,
  firstChapter,
  continueChapterId,
  footerActions,
}: SeriesHeroProps) {
  const readHref = continueChapterId
    ? `/series/${series.slug}/read/${continueChapterId}`
    : firstChapter
      ? `/series/${series.slug}/read/${firstChapter.id}`
      : undefined;

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow)] md:mx-0">
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="gradient-title mb-2 text-3xl font-bold sm:text-4xl">
            {series.title}
          </h1>
          {series.tagline && (
            <p className="mb-3 text-lg italic opacity-80">{series.tagline}</p>
          )}
          <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {series.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-[var(--primary)] px-3 py-1 text-xs font-bold text-[var(--primary)]"
              >
                {genre}
              </span>
            ))}
            <span className="rounded-full bg-[var(--chap-card-bg)] px-3 py-1 text-xs font-bold capitalize">
              {series.status}
            </span>
            <SeriesPriceBadge series={series} size="md" />
          </div>
          {requiresPurchase(series) && (
            <p className="mb-3 text-lg font-bold text-[var(--primary)]">
              Giá trọn bộ: {formatSeriesPrice(series)}
            </p>
          )}
          <p className="mb-4 text-base leading-relaxed opacity-90">
            {series.synopsis}
          </p>
          {footerActions && (
            <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {footerActions}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {readHref && (
              <Button href={readHref} variant="primary">
                {continueChapterId ? "📖 Đọc tiếp" : "▶ Bắt đầu đọc"}
              </Button>
            )}
            <Button href="/" variant="outline">
              ⬅ Trang chủ
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
