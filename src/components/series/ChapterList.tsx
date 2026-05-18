import { ChapterCard } from "@/components/series/ChapterCard";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Chapter } from "@/lib/types/series";

interface ChapterListProps {
  seriesSlug: string;
  chapters: Chapter[];
  title?: string;
}

export function ChapterList({
  seriesSlug,
  chapters,
  title = "📖 Mục lục",
}: ChapterListProps) {
  return (
    <GlassCard>
      <h2 className="mb-4 text-xl font-bold text-[var(--text)]">{title}</h2>
      {chapters.length === 0 ? (
        <p className="text-center opacity-70">Chưa có chương nào được phát hành.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              href={`/series/${seriesSlug}/read/${chapter.id}`}
              title={chapter.title}
              isLocked={chapter.isLocked}
            />
          ))}
        </div>
      )}
    </GlassCard>
  );
}
