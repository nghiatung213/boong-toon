"use client";

import Link from "next/link";
import { useLibrary } from "@/components/providers/LibraryProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export function HistoryPageView() {
  const { ready, history } = useLibrary();

  return (
    <GlassCard>
      <h1 className="gradient-title mb-2 text-3xl font-bold">🕐 Lịch sử đọc</h1>
      <p className="mb-6 text-sm opacity-80">
        Tối đa 50 mục gần nhất, lưu trên thiết bị của bạn.
      </p>
      {!ready ? (
        <p className="opacity-60">Đang tải...</p>
      ) : history.length === 0 ? (
        <>
          <p className="mb-4 opacity-70">
            Chưa có lịch sử. Bắt đầu đọc một chương để ghi lại tại đây.
          </p>
          <Button href="/series/mirai" variant="primary">
            Đọc MirAi
          </Button>
        </>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.map((entry) => (
            <li key={`${entry.seriesSlug}-${entry.chapterId}-${entry.readAt}`}>
              <Link
                href={`/series/${entry.seriesSlug}/read/${entry.chapterId}`}
                className="block rounded-xl bg-[var(--chap-card-bg)] px-4 py-3 transition hover:translate-x-1 hover:border-l-4 hover:border-[var(--primary)]"
              >
                <p className="text-xs font-bold text-[var(--primary)]">
                  {entry.seriesTitle}
                </p>
                <p className="font-semibold">{entry.chapterTitle}</p>
                <p className="mt-1 text-xs opacity-60">
                  {new Date(entry.readAt).toLocaleString("vi-VN")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Button href="/library" variant="outline" className="mt-6">
        ⬅ Thư viện
      </Button>
    </GlassCard>
  );
}
