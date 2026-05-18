import Image from "next/image";
import Link from "next/link";
import { SeriesPremiumCornerBadge } from "@/components/series/SeriesPriceBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Series } from "@/lib/types/series";
import { formatSeriesPrice, requiresPurchase } from "@/lib/utils/series-pricing";
import { cn } from "@/lib/utils/cn";

interface SeriesCardProps {
  series: Series;
  className?: string;
}

export function SeriesCard({ series, className }: SeriesCardProps) {
  const showPrice = requiresPurchase(series) || series.isPremium;

  return (
    <Link href={`/series/${series.slug}`} className={cn("group block", className)}>
      <GlassCard
        padding="sm"
        className="mb-0 h-full overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(255,107,129,0.25)]"
        animate={false}
      >
        <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl">
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
            unoptimized
          />
          <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {series.type === "novel" ? "Novel" : "Manga"}
          </span>
          {showPrice && <SeriesPremiumCornerBadge series={series} />}
        </div>
        <h3 className="mb-1 line-clamp-2 text-base font-bold text-[var(--text)] group-hover:text-[var(--primary)]">
          {series.title}
        </h3>
        {series.tagline && (
          <p className="mb-2 text-sm italic opacity-70">{series.tagline}</p>
        )}
        {showPrice && (
          <p className="mb-2 text-sm font-bold text-[var(--primary)]">
            {formatSeriesPrice(series)}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {series.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="rounded-full border border-[var(--glass-border)] px-2 py-0.5 text-xs font-semibold opacity-80"
            >
              {genre}
            </span>
          ))}
        </div>
      </GlassCard>
    </Link>
  );
}
