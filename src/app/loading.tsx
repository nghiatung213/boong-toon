import { GlassCardSkeleton } from "@/components/ui/Skeleton";
import { PageShell } from "@/components/layout/PageShell";

export default function Loading() {
  return (
    <PageShell>
      <GlassCardSkeleton />
      <GlassCardSkeleton />
    </PageShell>
  );
}
