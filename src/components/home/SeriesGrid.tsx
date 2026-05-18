import { SeriesCard } from "@/components/series/SeriesCard";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Series } from "@/lib/types/series";

interface SeriesGridProps {
  series: Series[];
  title?: string;
}

export function SeriesGrid({ series, title = "📚 Thư viện truyện" }: SeriesGridProps) {
  return (
    <GlassCard>
      <h2 className="mb-5 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {series.map((item) => (
          <SeriesCard key={item.id} series={item} />
        ))}
      </div>
    </GlassCard>
  );
}
