import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { listSeriesWithStats } from "@/lib/admin/series-service";
import { getGenres } from "@/lib/data/repository/catalog-repository";

export default function AdminDashboardPage() {
  const series = listSeriesWithStats();
  const genres = getGenres();
  const totalChapters = series.reduce((n, s) => n + s.chapterCount, 0);
  const lockedChapters = series.reduce((n, s) => n + s.lockedCount, 0);

  return (
    <div className="space-y-6">
      <GlassCard>
        <h1 className="gradient-title mb-2 text-3xl font-bold">📊 Tổng quan</h1>
        <p className="opacity-80">Command Center — quản lý nhanh cho solo admin.</p>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard padding="md" className="text-center">
          <p className="text-3xl font-bold text-[var(--primary)]">{series.length}</p>
          <p className="text-sm opacity-70">Truyện</p>
        </GlassCard>
        <GlassCard padding="md" className="text-center">
          <p className="text-3xl font-bold text-[var(--primary)]">{totalChapters}</p>
          <p className="text-sm opacity-70">Chương</p>
        </GlassCard>
        <GlassCard padding="md" className="text-center">
          <p className="text-3xl font-bold text-[var(--accent)]">{lockedChapters}</p>
          <p className="text-sm opacity-70">Chương khóa</p>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-3 font-bold">⚡ Tác vụ nhanh</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/series/new"
            className="rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-bold text-white"
          >
            + Truyện mới
          </Link>
          <Link
            href="/admin/series"
            className="rounded-full border-2 border-[var(--primary)] px-4 py-2 text-sm font-bold text-[var(--primary)]"
          >
            Quản lý truyện
          </Link>
          <Link
            href="/admin/genres"
            className="rounded-full border border-[var(--glass-border)] px-4 py-2 text-sm font-bold"
          >
            Thể loại ({genres.length})
          </Link>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-3 font-bold">📘 Truyện gần đây</h2>
        <ul className="space-y-2">
          {series.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/series/${s.id}`}
                className="flex justify-between rounded-xl bg-[var(--chap-card-bg)] px-4 py-3 font-semibold hover:text-[var(--primary)]"
              >
                <span>{s.title}</span>
                <span className="text-xs opacity-60">
                  {s.chapterCount} ch · /{s.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
