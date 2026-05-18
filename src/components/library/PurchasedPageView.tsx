"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SeriesPriceBadge } from "@/components/series/SeriesPriceBadge";
import type { Series } from "@/lib/types/series";
import { formatSeriesPrice, requiresPurchase } from "@/lib/utils/series-pricing";

interface PurchasedPageViewProps {
  seriesCatalog: Series[];
}

export function PurchasedPageView({ seriesCatalog }: PurchasedPageViewProps) {
  const { ready, user, entitlements, purchases } = useAuth();

  if (!ready) return <p className="opacity-60">Đang tải...</p>;

  const owned = seriesCatalog.filter((s) => entitlements.includes(s.slug));
  const pending = purchases.filter((p) => p.status === "pending");
  const history = purchases.filter((p) => p.status !== "pending");

  return (
    <>
      <GlassCard>
        <h1 className="gradient-title mb-2 text-3xl font-bold">🔓 Đã mua</h1>
        <p className="text-sm opacity-80">
          Truyện đã được admin xác minh — quyền truy cập trọn bộ + chương tương lai.
        </p>
      </GlassCard>

      {pending.length > 0 && (
        <GlassCard className="border border-[var(--accent)]">
          <h2 className="mb-2 font-bold text-[var(--accent)]">⏳ Chờ xác minh</h2>
          <ul className="space-y-2 text-sm">
            {pending.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/series/${p.seriesSlug}/purchase`}
                  className="font-semibold hover:text-[var(--primary)]"
                >
                  {p.seriesTitle} — {p.transferNote}
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      {history.length > 0 && (
        <GlassCard>
          <h2 className="mb-3 font-bold">📜 Lịch sử mua</h2>
          <ul className="space-y-2 text-sm opacity-90">
            {history.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[var(--chap-card-bg)] px-3 py-2"
              >
                <span>
                  {p.seriesTitle}
                  {(() => {
                    const s = seriesCatalog.find((x) => x.slug === p.seriesSlug);
                    return s && requiresPurchase(s) ? (
                      <span className="ml-2 text-xs opacity-60">
                        ({formatSeriesPrice(s)})
                      </span>
                    ) : null;
                  })()}
                </span>
                <span
                  className={
                    p.status === "approved"
                      ? "text-[#27ae60]"
                      : "text-[var(--primary)]"
                  }
                >
                  {p.status === "approved"
                    ? "Đã duyệt"
                    : p.status === "rejected"
                      ? "Từ chối"
                      : p.status}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      <GlassCard>
        {owned.length === 0 ? (
          <>
            <p className="mb-4 opacity-70">
              {user
                ? "Chưa có truyện premium đã duyệt."
                : "Đăng nhập để xem truyện đã mua."}
            </p>
            {user ? (
              <Button href="/" variant="primary">
                Khám phá truyện
              </Button>
            ) : (
              <Button href="/auth/login" variant="primary">
                Đăng nhập
              </Button>
            )}
          </>
        ) : (
          <ul className="flex flex-col gap-2">
            {owned.map((series) => (
              <li key={series.id}>
                <Link
                  href={`/series/${series.slug}`}
                  className="flex items-center justify-between rounded-xl bg-[var(--chap-card-bg)] px-4 py-4 font-semibold transition hover:text-[var(--primary)]"
                >
                  <span>{series.title}</span>
                  <span className="flex items-center gap-2">
                    <SeriesPriceBadge series={series} />
                    <span className="rounded-full bg-[#27ae60]/20 px-2 py-0.5 text-xs font-bold text-[#27ae60]">
                      ✓
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </>
  );
}
