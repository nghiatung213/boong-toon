import { LibraryPageView } from "@/components/library/LibraryPageView";
import { PageShell } from "@/components/layout/PageShell";
import { getAllSeries } from "@/lib/data/catalog";

export const metadata = {
  title: "Thư viện",
};

export default async function LibraryPage() {
  const seriesCatalog = await getAllSeries();
  return (
    <PageShell className="pb-24 md:pb-8">
      <LibraryPageView seriesCatalog={seriesCatalog} />
    </PageShell>
  );
}
