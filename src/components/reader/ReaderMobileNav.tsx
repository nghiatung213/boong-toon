"use client";

import { Button } from "@/components/ui/Button";

interface ReaderMobileNavProps {
  seriesSlug: string;
  prevId: string | null;
  nextId: string | null;
}

export function ReaderMobileNav({
  seriesSlug,
  prevId,
  nextId,
}: ReaderMobileNavProps) {
  if (!prevId && !nextId) return null;

  return (
    <nav
      className="reader-mobile-nav fixed bottom-0 left-0 right-0 z-[98] flex gap-2 border-t border-[var(--glass-border)] bg-[var(--glass)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
      aria-label="Điều hướng chương"
    >
      {prevId ? (
        <Button
          href={`/series/${seriesSlug}/read/${prevId}`}
          variant="outline"
          className="flex-1 text-xs"
        >
          ⬅ Trước
        </Button>
      ) : (
        <span className="flex-1" />
      )}
      {nextId ? (
        <Button
          href={`/series/${seriesSlug}/read/${nextId}`}
          variant="primary"
          className="flex-1 text-xs"
        >
          Sau ➡
        </Button>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
