import { ContinueReadingSection } from "@/components/library/ContinueReadingSection";
import { FavoritesSection } from "@/components/library/FavoritesSection";
import { PurchasedPreview } from "@/components/library/PurchasedPreview";
import { AuthorSection } from "@/components/home/AuthorSection";
import { HomeHero } from "@/components/home/HomeHero";
import { SeriesGrid } from "@/components/home/SeriesGrid";
import { PageShell } from "@/components/layout/PageShell";
import { getAllSeries } from "@/lib/data/catalog";

export default async function HomePage() {
  const seriesList = await getAllSeries();

  return (
    <PageShell className="pb-24 md:pb-8">
      <HomeHero />
      <AuthorSection />
      <ContinueReadingSection seriesCatalog={seriesList} />
      <FavoritesSection seriesCatalog={seriesList} />
      <PurchasedPreview seriesCatalog={seriesList} />
      <SeriesGrid series={seriesList} />
    </PageShell>
  );
}
