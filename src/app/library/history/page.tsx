import { HistoryPageView } from "@/components/library/HistoryPageView";
import { PageShell } from "@/components/layout/PageShell";

export const metadata = {
  title: "Lịch sử đọc",
};

export default function HistoryPage() {
  return (
    <PageShell maxWidth="catalog" className="pb-24 md:pb-8">
      <HistoryPageView />
    </PageShell>
  );
}
