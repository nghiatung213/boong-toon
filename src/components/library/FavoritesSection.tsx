"use client";

import { useLibrary } from "@/components/providers/LibraryProvider";
import { SeriesCard } from "@/components/series/SeriesCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import type { Series } from "@/lib/types/series";

interface FavoritesSectionProps {
  seriesCatalog: Series[];
}

export function FavoritesSection({ seriesCatalog }: FavoritesSectionProps) {
  const { ready, favorites } = useLibrary();

  if (!ready) return null;

  const favoriteSeries = seriesCatalog.filter((s) =>
    favorites.includes(s.slug),
  );

  if (favoriteSeries.length === 0) {
    return (
      <GlassCard>
        <h2 className="mb-2 text-xl font-bold">❤️ Yêu thích</h2>
        <p className="mb-4 text-sm opacity-70">
          Chưa có truyện yêu thích. Nhấn ♡ trên trang truyện để lưu.
        </p>
        <Button href="/library" variant="outline">
          Mở thư viện
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold">❤️ Yêu thích</h2>
        <Button href="/library" variant="ghost" className="text-xs">
          Xem tất cả
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {favoriteSeries.map((series) => (
          <SeriesCard key={series.id} series={series} />
        ))}
      </div>
    </GlassCard>
  );
}
