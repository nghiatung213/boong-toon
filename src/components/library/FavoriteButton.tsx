"use client";

import { useLibrary } from "@/components/providers/LibraryProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface FavoriteButtonProps {
  seriesSlug: string;
  className?: string;
  compact?: boolean;
}

export function FavoriteButton({
  seriesSlug,
  className,
  compact,
}: FavoriteButtonProps) {
  const { ready, isSeriesFavorite, toggleFavoriteSeries } = useLibrary();
  const active = isSeriesFavorite(seriesSlug);

  if (!ready) {
    return (
      <Button variant="outline" type="button" disabled className={className}>
        ♡ Yêu thích
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={active ? "primary" : "outline"}
      className={cn(compact && "px-3 py-2 text-xs", className)}
      onClick={() => toggleFavoriteSeries(seriesSlug)}
      aria-pressed={active}
    >
      {active ? "❤️ Đã thích" : "♡ Yêu thích"}
    </Button>
  );
}
