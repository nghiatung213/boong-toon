import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--chap-card-bg)]",
        className,
      )}
      aria-hidden
    />
  );
}

export function GlassCardSkeleton() {
  return (
    <div className="glass-box mb-6 space-y-3 p-8">
      <Skeleton className="mx-auto h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
