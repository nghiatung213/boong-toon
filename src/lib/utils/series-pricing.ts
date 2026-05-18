import type { Series } from "@/lib/types/series";

/** Resolved price in VND (0 = free). */
export function getSeriesPrice(series: Series): number {
  if (typeof series.price === "number" && series.price >= 0) {
    return series.price;
  }
  return series.isPremium ? 49_000 : 0;
}

export function isSeriesFree(series: Series): boolean {
  return getSeriesPrice(series) === 0;
}

/** Paid premium: locked content requires purchase flow. */
export function requiresPurchase(series: Series): boolean {
  return Boolean(series.isPremium) && getSeriesPrice(series) > 0;
}

export function formatSeriesPrice(series: Series): string {
  const price = getSeriesPrice(series);
  if (price === 0) return "FREE";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}
