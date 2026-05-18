"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Trang chủ", icon: "🏠" },
  { href: "/library", label: "Thư viện", icon: "📚" },
  { href: "/library/purchased", label: "Đã mua", icon: "🔓" },
  { href: "/library/history", label: "Lịch sử", icon: "🕐" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  const hidden =
    pathname.includes("/read/") && pathname.includes("/series/");

  if (hidden) return null;

  return (
    <nav
      className="site-chrome fixed bottom-0 left-0 right-0 z-[90] border-t border-[var(--glass-border)] bg-[var(--glass)] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
      aria-label="Điều hướng chính"
    >
      <ul className="mx-auto flex max-w-lg justify-around gap-1">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[0.65rem] font-bold transition",
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--text)] opacity-70",
                )}
              >
                <span className="text-lg leading-none">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
