"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/components/providers/AuthProvider";
import { siteConfig } from "@/lib/config/site";

export function SiteHeader() {
  const { user, ready, logout } = useAuth();

  return (
    <header className="site-chrome mb-4">
      <nav className="glass-box flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group">
        <img
      src="/images/BoongToon_Web_Logo.jpg" alt="BoongToon Logo" className="h-8 w-auto max-w-[150px] object-contain transition-transform group-hover:scale-105 sm:h-9 md:h-10" 
  />
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:text-[var(--primary)]"
          >
            Trang chủ
          </Link>
          <Link
            href="/library"
            className="hidden rounded-full px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:text-[var(--primary)] sm:inline-block"
          >
            Thư viện
          </Link>
          {ready && user ? (
            <>
              <NotificationBell />
              <Link
                href="/profile"
                className="rounded-full bg-[var(--chap-card-bg)] px-3 py-2 text-sm font-bold text-[var(--primary)]"
              >
                @{user.username}
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="hidden rounded-full px-3 py-2 text-xs font-semibold opacity-70 hover:text-[var(--primary)] sm:inline-block"
              >
                Đăng xuất
              </button>
            </>
          ) : ready ? (
            <>
              <Link
                href="/auth/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:text-[var(--primary)]"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] px-3 py-2 text-sm font-bold text-white"
              >
                Đăng ký
              </Link>
            </>
          ) : null}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
