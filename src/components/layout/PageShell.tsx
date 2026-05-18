import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "reader" | "catalog" | "wide";
}

const maxWidthMap = {
  reader: "max-w-[900px]",
  catalog: "max-w-[1000px]",
  wide: "max-w-[1100px]",
};

export function PageShell({
  children,
  className,
  maxWidth = "catalog",
}: PageShellProps) {
  return (
    <div
      className={cn(
        "relative z-[1] mx-auto w-full px-4 py-5 sm:px-5 sm:py-6",
        maxWidthMap[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}

