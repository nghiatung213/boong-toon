"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { SeriesPriceBadge } from "@/components/series/SeriesPriceBadge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Chapter, Series } from "@/lib/types/series";
import { formatSeriesPrice, requiresPurchase } from "@/lib/utils/series-pricing";

interface ChapterPaywallProps {
  seriesSlug: string;
  seriesTitle: string;
  series: Series;
  chapter: Chapter;
}

export function ChapterPaywall({
  seriesSlug,
  seriesTitle,
  series,
  chapter,
}: ChapterPaywallProps) {
  const { user, getPurchaseStatus } = useAuth();
  const status = getPurchaseStatus(seriesSlug);
  const paid = requiresPurchase(series);

  return (
    <GlassCard className="text-center">
      <SeriesPriceBadge series={series} size="md" className="mb-3" />
      <p className="mb-2 text-4xl">🔒</p>
      <h1 className="mb-2 text-2xl font-bold text-[var(--primary)]">
        {chapter.title}
      </h1>
      <p className="mb-2 opacity-80">
        Mua trọn bộ <strong>{seriesTitle}</strong> để mở khóa chương này và mọi
        chương tương lai.
      </p>
      {paid && (
        <p className="mb-6 text-lg font-bold text-[var(--accent)]">
          {formatSeriesPrice(series)}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {user ? (
          <Button href={`/series/${seriesSlug}/purchase`} variant="primary">
            {status === "pending" ? "⏳ Xem trạng thái mua" : "Mua trọn bộ"}
          </Button>
        ) : (
          <Button
            href={`/auth/login?from=/series/${seriesSlug}/purchase`}
            variant="primary"
          >
            Đăng nhập để mua
          </Button>
        )}
        <Button href={`/series/${seriesSlug}`} variant="outline">
          ⬅ Quay lại
        </Button>
      </div>
    </GlassCard>
  );
}
