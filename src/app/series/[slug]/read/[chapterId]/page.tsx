import { notFound } from "next/navigation";
import { ReaderGate } from "@/components/reader/ReaderGate";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PageShell } from "@/components/layout/PageShell";
import {
  getAdjacentChapters,
  getChapterById,
  getSeriesBySlug,
  isChapterPublished,
} from "@/lib/data/catalog";
import { readChapterMarkdown } from "@/lib/data/content";

interface ReadPageProps {
  params: Promise<{ slug: string; chapterId: string }>;
}

export async function generateMetadata({ params }: ReadPageProps) {
  const { slug, chapterId } = await params;
  const chapter = await getChapterById(slug, chapterId);
  const series = await getSeriesBySlug(slug);
  if (!chapter || !series) return { title: "Đọc truyện" };
  return { title: `${chapter.title} — ${series.title}` };
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { slug, chapterId } = await params;
  const series = await getSeriesBySlug(slug);
  const chapter = await getChapterById(slug, chapterId);

  if (!series || !chapter) {
    notFound();
  }

  if (!isChapterPublished(chapter)) {
    return (
      <PageShell maxWidth="reader">
        <GlassCard className="text-center">
          <p className="text-lg font-bold">Chương chưa được phát hành</p>
          <p className="mt-2 text-sm opacity-80">
            Chương này được hẹn giờ đăng. Vui lòng quay lại sau.
          </p>
          <Button href={`/series/${slug}`} variant="outline" className="mt-4">
            Về trang truyện
          </Button>
        </GlassCard>
      </PageShell>
    );
  }

  const markdown = (await readChapterMarkdown(chapter.file)) ?? "";

  const { prev, next } = await getAdjacentChapters(slug, chapterId);

  return (
    <PageShell maxWidth="reader" className="pb-0 md:pb-8">
      <ReaderGate
        series={series}
        chapter={chapter}
        markdown={markdown}
        prevId={prev?.id ?? null}
        nextId={next?.id ?? null}
      />
    </PageShell>
  );
}
