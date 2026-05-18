import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { listSeriesWithStats } from "@/lib/admin/series-service";

export default async function AdminSeriesListPage() {
  const series = await listSeriesWithStats();

  return (
    <div className="space-y-4">
      <GlassCard className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="gradient-title text-2xl font-bold">📘 Truyện</h1>
        <Button href="/admin/series/new" variant="primary">
          + Thêm truyện
        </Button>
      </GlassCard>

      <GlassCard padding="sm">
        <ul className="divide-y divide-[var(--glass-border)]">
          {series.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/series/${s.id}`}
                className="flex flex-wrap items-center justify-between gap-2 px-2 py-4 transition hover:bg-white/30 [data-theme=dark]:hover:bg-white/5"
              >
                <div>
                  <p className="font-bold">{s.title}</p>
                  <p className="text-xs opacity-60">
                    /{s.slug} · {s.status}
                    {s.isPremium && " · premium"}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[var(--primary)]">
                  {s.chapterCount} ch
                  {s.lockedCount > 0 && ` · ${s.lockedCount}🔒`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {series.length === 0 && (
          <p className="py-8 text-center opacity-60">Chưa có truyện.</p>
        )}
      </GlassCard>
    </div>
  );
}
