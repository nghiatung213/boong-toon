import { PurchasedPageView } from "@/components/library/PurchasedPageView";
import { PageShell } from "@/components/layout/PageShell";
import { getAllSeries } from "@/lib/data/catalog";

export const metadata = {
  title: "Đã mua",
};

export default function PurchasedPage() {
  return (
    <PageShell maxWidth="catalog" className="pb-24 md:pb-8">
      <PurchasedPageView seriesCatalog={getAllSeries()} />
    </PageShell>
  );
}
