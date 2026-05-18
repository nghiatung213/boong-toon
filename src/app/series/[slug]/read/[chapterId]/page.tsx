import { notFound } from "next/navigation";
import { ReaderGate } from "@/components/reader/ReaderGate";
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
  const chapter = getChapterById(slug, chapterId);
  const series = getSeriesBySlug(slug);
  if (!chapter || !series) return { title: "Đọc truyện" };
  return { title: `${chapter.title} — ${series.title}` };
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { slug, chapterId } = await params;
  const series = getSeriesBySlug(slug);
  const chapter = getChapterById(slug, chapterId);

  if (!series || !chapter) {
    notFound();
  }

  if (!isChapterPublished(chapter)) {
    notFound();
  }

  const markdown = readChapterMarkdown(chapter.file);
  if (markdown === null) {
    notFound();
  }

  const { prev, next } = getAdjacentChapters(slug, chapterId);

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
