"use client";

import { useLibrary } from "@/components/providers/LibraryProvider";
import { SeriesCard } from "@/components/series/SeriesCard";
import { ContinueReadingSection } from "@/components/library/ContinueReadingSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import type { Series } from "@/lib/types/series";

interface LibraryPageViewProps {
  seriesCatalog: Series[];
}

export function LibraryPageView({ seriesCatalog }: LibraryPageViewProps) {
  const { ready, favorites } = useLibrary();
  const favoriteSeries = seriesCatalog.filter((s) => favorites.includes(s.slug));

  return (
    <div className="flex flex-col gap-6">
      <GlassCard className="text-center sm:text-left">
        <h1 className="gradient-title mb-2 text-3xl font-bold">📚 Thư viện</h1>
        <p className="opacity-80">Yêu thích, đọc dở và truyện đã mua của bạn.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          <Button href="/library/purchased" variant="outline">
            🔓 Đã mua
          </Button>
          <Button href="/library/history" variant="outline">
            🕐 Lịch sử
          </Button>
        </div>
      </GlassCard>

      <ContinueReadingSection seriesCatalog={seriesCatalog} />

      <GlassCard>
        <h2 className="mb-4 text-xl font-bold">❤️ Yêu thích</h2>
        {!ready ? (
          <p className="opacity-60">Đang tải...</p>
        ) : favoriteSeries.length === 0 ? (
          <p className="opacity-70">
            Chưa có truyện yêu thích. Mở trang truyện và nhấn ♡ Yêu thích.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {favoriteSeries.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
