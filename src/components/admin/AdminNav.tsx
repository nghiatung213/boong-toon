"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin/api-client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin", label: "Tổng quan", icon: "📊" },
  { href: "/admin/series", label: "Truyện", icon: "📘" },
  { href: "/admin/series/new", label: "Thêm truyện", icon: "➕" },
  { href: "/admin/genres", label: "Thể loại", icon: "🏷️" },
  { href: "/admin/purchases", label: "Xác minh mua", icon: "💳" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="glass-box h-fit w-full shrink-0 p-4 sm:w-52">
      <nav className="flex flex-row flex-wrap gap-2 sm:flex-col">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-bold transition",
                active
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white"
                  : "bg-[var(--chap-card-bg)] hover:text-[var(--primary)]",
              )}
            >
              {link.icon} {link.label}
            </Link>
          );
        })}
      </nav>
      <Button
        type="button"
        variant="ghost"
        className="mt-4 w-full text-xs"
        onClick={async () => {
          await adminApi.logout();
          router.push("/admin/login");
        }}
      >
        Đăng xuất
      </Button>
    </aside>
  );
}
