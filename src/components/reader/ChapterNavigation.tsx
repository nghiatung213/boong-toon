import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

interface ChapterNavigationProps {
  seriesSlug: string;
  prevId: string | null;
  nextId: string | null;
}

export function ChapterNavigation({
  seriesSlug,
  prevId,
  nextId,
}: ChapterNavigationProps) {
  return (
    <GlassCard
      padding="md"
      className="reader-controls flex flex-wrap items-center justify-between gap-3"
    >
      {prevId ? (
        <Button
          href={`/series/${seriesSlug}/read/${prevId}`}
          variant="primary"
        >
          ⬅ Chương trước
        </Button>
      ) : (
        <span />
      )}
      {nextId ? (
        <Button
          href={`/series/${seriesSlug}/read/${nextId}`}
          variant="primary"
        >
          Chương sau ➡
        </Button>
      ) : (
        <span />
      )}
    </GlassCard>
  );
}
