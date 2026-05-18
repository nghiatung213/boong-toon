import { notFound } from "next/navigation";
import { ChapterListWithProgress } from "@/components/series/ChapterListWithProgress";
import { SeriesHeroWithContinue } from "@/components/series/SeriesHeroWithContinue";
import { PageShell } from "@/components/layout/PageShell";
import {
  getChaptersForSeries,
  getPublishedChapters,
  getSeriesBySlug,
} from "@/lib/data/catalog";

interface SeriesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return { title: "Không tìm thấy" };
  return {
    title: series.title,
    description: series.synopsis,
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const chapters = getPublishedChapters(series.id);
  const allChapters = getChaptersForSeries(series.id);
  const firstChapter = chapters[0] ?? null;
  const publishedChapterIds = chapters.map((c) => c.id);
  const allChapterIds = allChapters.map((c) => c.id);

  return (
    <PageShell maxWidth="catalog" className="pb-24 md:pb-8">
      <SeriesHeroWithContinue
        series={series}
        firstChapter={firstChapter}
        publishedChapterIds={publishedChapterIds}
        allChapterIds={allChapterIds}
      />
      <ChapterListWithProgress series={series} chapters={chapters} />
    </PageShell>
  );
}
