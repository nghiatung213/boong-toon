import { ContinueReadingSection } from "@/components/library/ContinueReadingSection";
import { FavoritesSection } from "@/components/library/FavoritesSection";
import { PurchasedPreview } from "@/components/library/PurchasedPreview";
import { AuthorSection } from "@/components/home/AuthorSection";
import { WarningSection } from "@/components/home/WarningSection";  
import { HomeHero } from "@/components/home/HomeHero";
import { SeriesGrid } from "@/components/home/SeriesGrid";
import { PageShell } from "@/components/layout/PageShell";
import { getAllSeries } from "@/lib/data/catalog";

export default async function HomePage() {
  const seriesList = await getAllSeries();

  return (
    <PageShell className="pb-24 md:pb-8">
      <HomeHero />
      <SeriesGrid series={seriesList} />
      <ContinueReadingSection seriesCatalog={seriesList} />
      <FavoritesSection seriesCatalog={seriesList} />
      <PurchasedPreview seriesCatalog={seriesList} />
      <AuthorSection />
      <WarningSection />
    </PageShell>
  );
}
