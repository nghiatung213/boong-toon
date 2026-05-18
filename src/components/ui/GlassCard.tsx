import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article";
  padding?: "sm" | "md" | "lg";
  animate?: boolean;
}

const paddingMap = {
  sm: "p-4",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-[30px]",
};

export function GlassCard({
  as = "div",
  className,
  children,
  padding = "lg",
  animate = true,
  ...props
}: GlassCardProps) {
  const classes = cn(
    "glass-box mb-6",
    paddingMap[padding],
    animate && "animate-fade-in",
    className,
  );

  if (as === "section") {
    return (
      <section className={classes} {...props}>
        {children}
      </section>
    );
  }

  if (as === "article") {
    return (
      <article className={classes} {...props}>
        {children}
      </article>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
