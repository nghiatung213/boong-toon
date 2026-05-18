"use client";

import { FavoriteButton } from "@/components/library/FavoriteButton";
import { PurchaseSeriesButton } from "@/components/library/PurchaseSeriesButton";
import type { Series } from "@/lib/types/series";

interface SeriesDetailActionsProps {
  series: Series;
}

export function SeriesDetailActions({ series }: SeriesDetailActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      <FavoriteButton seriesSlug={series.slug} />
      <PurchaseSeriesButton series={series} />
    </div>
  );
}
