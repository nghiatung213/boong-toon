import type { ReactNode } from "react";

interface EmailLayoutProps {
  title: string;
  children: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmailLayout({
  title,
  children,
  ctaHref,
  ctaLabel,
}: EmailLayoutProps) {
  return (
    <div className="mx-auto max-w-lg animate-fade-in rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-8 shadow-[var(--shadow)] backdrop-blur-xl">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
        MirAi Email
      </p>
      <h1 className="gradient-title mb-4 text-2xl font-bold">{title}</h1>
      <div className="space-y-3 text-sm leading-relaxed opacity-90">
        {children}
      </div>
      {ctaHref && ctaLabel && (
        <a
          href={ctaHref}
          className="mt-6 inline-block rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] px-6 py-2.5 text-sm font-bold text-white"
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );
}
