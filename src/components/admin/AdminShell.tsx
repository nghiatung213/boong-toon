import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { siteConfig } from "@/lib/config/site";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-[var(--surface)]">
      <header className="glass-box mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:mx-6">
        <Link href="/admin" className="gradient-title text-xl font-bold">
          ⛔ Studio — {siteConfig.webName}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--text)] opacity-70 hover:text-[var(--primary)]"
          >
            Xem site →
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:px-6">
        <AdminNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
