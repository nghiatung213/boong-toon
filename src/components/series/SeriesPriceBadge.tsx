import { cn } from "@/lib/utils/cn";
import {
  formatSeriesPrice,
  getSeriesPrice,
  isSeriesFree,
  requiresPurchase,
} from "@/lib/utils/series-pricing";
import type { Series } from "@/lib/types/series";

interface SeriesPriceBadgeProps {
  series: Series;
  size?: "sm" | "md";
  className?: string;
}

export function SeriesPriceBadge({
  series,
  size = "sm",
  className,
}: SeriesPriceBadgeProps) {
  const free = isSeriesFree(series);
  const paid = requiresPurchase(series);

  const sizeClass =
    size === "md"
      ? "px-3 py-1 text-xs"
      : "px-2 py-0.5 text-[10px] sm:text-xs";

  if (free) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border border-[#27ae60]/40 bg-[#27ae60]/15 font-bold uppercase tracking-wide text-[#27ae60]",
          sizeClass,
          className,
        )}
      >
        FREE
      </span>
    );
  }

  if (paid) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-[var(--primary)]/50 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 font-bold text-[var(--primary)]",
          sizeClass,
          className,
        )}
      >
        <span className="opacity-80">✦</span>
        {formatSeriesPrice(series)}
      </span>
    );
  }

  return null;
}

export function SeriesPremiumCornerBadge({
  series,
  className,
}: {
  series: Series;
  className?: string;
}) {
  if (!series.isPremium && getSeriesPrice(series) === 0) return null;

  return (
    <SeriesPriceBadge
      series={series}
      className={cn("absolute right-2 top-2 z-10 shadow-sm backdrop-blur-sm", className)}
    />
  );
}
