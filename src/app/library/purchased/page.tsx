import { PurchasedPageView } from "@/components/library/PurchasedPageView";
import { PageShell } from "@/components/layout/PageShell";
import { getAllSeries } from "@/lib/data/catalog";

export const metadata = {
  title: "Đã mua",
};

export default async function PurchasedPage() {
  const seriesCatalog = await getAllSeries();
  return (
    <PageShell maxWidth="catalog" className="pb-24 md:pb-8">
      <PurchasedPageView seriesCatalog={seriesCatalog} />
    </PageShell>
  );
}
