import { GlassCard } from "@/components/ui/GlassCard";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { siteConfig } from "@/lib/config/site";

export function HomeHero() {
  return (
    <GlassCard className="text-center">
      <h1 className="gradient-title mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
        {siteConfig.webName}
      </h1>
      <p className="tagline mb-1 text-lg italic opacity-80">{siteConfig.subTitle}</p>
      <p className="mb-6 text-sm opacity-70">{siteConfig.tagline}</p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <ThemeToggle />
      </div>
    </GlassCard>
  );
}
