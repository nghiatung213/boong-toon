"use client";

import Link from "next/link";
import { useLibrary } from "@/components/providers/LibraryProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import type { Series } from "@/lib/types/series";

interface PurchasedPreviewProps {
  seriesCatalog: Series[];
}

export function PurchasedPreview({ seriesCatalog }: PurchasedPreviewProps) {
  const { ready, purchased } = useLibrary();

  if (!ready) return null;

  const slugs = Object.keys(purchased);
  const items = seriesCatalog.filter((s) => slugs.includes(s.slug));

  if (items.length === 0) {
    return (
      <GlassCard>
        <h2 className="mb-2 text-xl font-bold">🔓 Đã mua</h2>
        <p className="mb-4 text-sm opacity-70">
          Chưa có truyện đã mua. Mua truyện premium từ trang chi tiết (demo local).
        </p>
        <Button href="/library/purchased" variant="outline">
          Trang đã mua
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold">🔓 Đã mua</h2>
        <Button href="/library/purchased" variant="ghost" className="text-xs">
          Xem tất cả
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((series) => (
          <li key={series.id}>
            <Link
              href={`/series/${series.slug}`}
              className="flex items-center justify-between rounded-xl bg-[var(--chap-card-bg)] px-4 py-3 font-semibold transition hover:text-[var(--primary)]"
            >
              <span>{series.title}</span>
              <span className="text-xs opacity-60">✅ Full</span>
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
