import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { MouseEvent } from "react";

interface ChapterCardProps {
  href: string;
  title: string;
  isLocked?: boolean;
  percent?: number;
  className?: string;
  onLockedClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function ChapterCard({
  href,
  title,
  isLocked,
  percent,
  className,
  onLockedClick,
}: ChapterCardProps) {
  const showProgress = typeof percent === "number" && percent > 0 && !isLocked;

  return (
    <Link
      href={href}
      onClick={isLocked ? onLockedClick : undefined}
      className={cn(
        "block rounded-xl border-l-4 border-transparent px-4 py-3.5 font-semibold transition duration-300",
        "bg-[var(--chap-card-bg)] text-[var(--text)]",
        !isLocked &&
          "hover:translate-x-1 hover:border-[var(--primary)] hover:bg-white hover:text-[var(--primary)]",
        "[data-theme=dark]:hover:bg-white/10",
        isLocked && "cursor-not-allowed opacity-60",
        className,
      )}
      aria-disabled={isLocked}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate">{title}</span>
        {isLocked ? (
          <span className="shrink-0 text-xs">🔒 Premium</span>
        ) : showProgress ? (
          <span className="shrink-0 text-xs font-bold text-[var(--primary)]">
            {percent}%
          </span>
        ) : null}
      </span>
      {showProgress && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </Link>
  );
}
