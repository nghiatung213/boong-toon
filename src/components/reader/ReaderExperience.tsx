"use client";

import { useCallback, useEffect, useState } from "react";
import { ChapterNavigation } from "@/components/reader/ChapterNavigation";
import { NovelContent } from "@/components/reader/NovelContent";
import { ReaderMobileNav } from "@/components/reader/ReaderMobileNav";
import { ReadingProgressBar } from "@/components/reader/ReadingProgressBar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  useReaderSettings,
  type ReaderColorMode,
} from "@/hooks/use-reader-settings";
import { useReadingSession } from "@/hooks/use-reading-session";
import type { Chapter } from "@/lib/types/series";
import { cn } from "@/lib/utils/cn";

interface ReaderExperienceProps {
  seriesSlug: string;
  seriesTitle: string;
  chapter: Chapter;
  markdown: string;
  prevId: string | null;
  nextId: string | null;
}

const READER_MODE_LABELS: Record<ReaderColorMode, string> = {
  default: "Theo web",
  sepia: "Sepia",
  light: "Sáng",
  dark: "Tối",
};

export function ReaderExperience({
  seriesSlug,
  seriesTitle,
  chapter,
  markdown,
  prevId,
  nextId,
}: ReaderExperienceProps) {
  const {
    fontSize,
    fontFamily,
    colorMode,
    changeFontSize,
    setFontFamily,
    setColorMode,
  } = useReaderSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleRestoredScroll = useCallback(() => {
    setToast("📍 Đã quay lại vị trí cũ");
  }, []);

  useReadingSession({
    seriesSlug,
    seriesTitle,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    onRestoredScroll: handleRestoredScroll,
  });

  useEffect(() => {
    document.body.classList.toggle("reader-focus", focusMode);
    return () => document.body.classList.remove("reader-focus");
  }, [focusMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) setFocusMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode]);

  useEffect(() => {
    if (!settingsOpen) return;

    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".reader-settings-root")) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [settingsOpen]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const readerThemeAttr =
    colorMode === "default" ? undefined : colorMode;

  return (
    <div
      className="reader-shell transition-colors duration-300"
      data-reader-theme={readerThemeAttr}
    >
      <ReadingProgressBar />

      {focusMode && (
        <button
          type="button"
          onClick={() => setFocusMode(false)}
          className="fixed right-4 top-4 z-[10001] rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm"
        >
          ❌ Thoát Focus (ESC)
        </button>
      )}

      {toast && (
        <div
          className="fixed bottom-24 right-4 z-[10001] animate-fade-in rounded-full bg-black/70 px-4 py-2 text-sm text-white md:bottom-20"
          role="status"
        >
          {toast}
        </div>
      )}

      <GlassCard
        padding="md"
        className={cn(
          "site-chrome reader-controls sticky top-2 z-[99] flex flex-wrap items-center justify-between gap-3",
        )}
      >
        <Button href={`/series/${seriesSlug}`} variant="outline">
          ⬅ Trang truyện
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFocusMode((v) => {
                showToast(v ? "Đã tắt Focus" : "Chế độ Focus bật");
                return !v;
              });
            }}
          >
            👁️ Focus
          </Button>
          <div className="reader-settings-root relative">
            <Button
              type="button"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                setSettingsOpen((v) => !v);
              }}
            >
              ⚙️ Cài đặt
            </Button>
            {settingsOpen && (
              <div
                className="absolute right-0 top-full z-[100] mt-2 min-w-[240px] rounded-xl border border-[var(--glass-border)] p-4 shadow-[var(--shadow)] glass-box"
                role="dialog"
                aria-label="Cài đặt đọc"
              >
                <p className="mb-2 text-sm font-bold">Cỡ chữ</p>
                <div className="mb-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 px-3"
                    onClick={() => changeFontSize("down")}
                  >
                    A-
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 px-3"
                    onClick={() => changeFontSize("up")}
                  >
                    A+
                  </Button>
                </div>
                <p className="mb-2 text-sm font-bold">Font chữ</p>
                <div className="mb-3 flex gap-2">
                  <Button
                    type="button"
                    variant={fontFamily === "sans" ? "primary" : "outline"}
                    className="flex-1 px-2 text-xs"
                    onClick={() => setFontFamily("sans")}
                  >
                    Hiện đại
                  </Button>
                  <Button
                    type="button"
                    variant={fontFamily === "serif" ? "primary" : "outline"}
                    className="flex-1 px-2 text-xs"
                    onClick={() => setFontFamily("serif")}
                  >
                    Cổ điển
                  </Button>
                </div>
                <p className="mb-2 text-sm font-bold">Giao diện đọc</p>
                <div className="mb-1 grid grid-cols-2 gap-2">
                  {(Object.keys(READER_MODE_LABELS) as ReaderColorMode[]).map(
                    (mode) => (
                      <Button
                        key={mode}
                        type="button"
                        variant={colorMode === mode ? "primary" : "outline"}
                        className="px-2 text-xs"
                        onClick={() => setColorMode(mode)}
                      >
                        {READER_MODE_LABELS[mode]}
                      </Button>
                    ),
                  )}
                </div>
                <p className="text-[10px] opacity-50">
                  Chỉ áp dụng trong trang đọc — không đổi theme toàn site
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="reader-content-card pb-24 md:pb-8">
        <h1 className="mb-6 text-center text-xl font-bold text-[var(--reader-heading,var(--primary))] sm:text-2xl">
          {chapter.title}
        </h1>
        <NovelContent
          markdown={markdown}
          fontFamily={fontFamily}
          fontSize={fontSize}
        />
      </GlassCard>

      <div className="site-chrome hidden md:block">
        <ChapterNavigation
          seriesSlug={seriesSlug}
          prevId={prevId}
          nextId={nextId}
        />
      </div>

      <ReaderMobileNav
        seriesSlug={seriesSlug}
        prevId={prevId}
        nextId={nextId}
      />
    </div>
  );
}
