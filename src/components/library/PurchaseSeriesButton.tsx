"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { SeriesPriceBadge } from "@/components/series/SeriesPriceBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { Series } from "@/lib/types/series";
import { isSeriesFree, requiresPurchase } from "@/lib/utils/series-pricing";

interface PurchaseSeriesButtonProps {
  series: Series;
  className?: string;
}

export function PurchaseSeriesButton({
  series,
  className,
}: PurchaseSeriesButtonProps) {
  const { ready, user, hasEntitlement, getPurchaseStatus } = useAuth();
  const free = isSeriesFree(series);
  const paid = requiresPurchase(series);

  if (!paid && !free) return null;

  if (free) {
    return (
      <SeriesPriceBadge series={series} size="md" className={className} />
    );
  }

  if (!ready) {
    return (
      <Button variant="outline" type="button" disabled className={className}>
        🔒 Premium
      </Button>
    );
  }

  if (hasEntitlement(series.slug)) {
    return (
      <Button variant="ghost" type="button" disabled className={cn(className)}>
        ✅ Đã sở hữu trọn bộ
      </Button>
    );
  }

  const status = getPurchaseStatus(series.slug);

  if (status === "pending") {
    return (
      <Button
        href={`/series/${series.slug}/purchase`}
        variant="outline"
        className={className}
      >
        ⏳ Chờ xác minh
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        href={`/auth/login?from=/series/${series.slug}/purchase`}
        variant="primary"
        className={className}
      >
        🔓 Đăng nhập để mua
      </Button>
    );
  }

  return (
    <Button
      href={`/series/${series.slug}/purchase`}
      variant="primary"
      className={className}
    >
      🔓 Mua &quot;{series.title}&quot;
    </Button>
  );
}
