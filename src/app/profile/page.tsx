"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageShell } from "@/components/layout/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready, purchases, entitlements, logout } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/");
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <PageShell>
        <Skeleton className="h-48 w-full" />
      </PageShell>
    );
  }

  if (!user) return null;

  return (
    <PageShell className="pb-24 md:pb-8">
      <GlassCard>
        <h1 className="gradient-title mb-2 text-3xl font-bold">Tài khoản</h1>
        <p className="opacity-80">@{user.username}</p>
        <p className="text-sm opacity-60">{user.email}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => void logout()}
        >
          Đăng xuất
        </Button>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-3 text-xl font-bold">🔓 Truyện đã sở hữu</h2>
        {entitlements.length === 0 ? (
          <p className="opacity-70">Chưa có truyện premium đã xác minh.</p>
        ) : (
          <ul className="space-y-2">
            {entitlements.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/series/${slug}`}
                  className="block rounded-xl bg-[var(--chap-card-bg)] px-4 py-3 font-semibold hover:text-[var(--primary)]"
                >
                  /{slug}{" "}
                  <span className="text-xs text-[#27ae60]">✅ Full access</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="mb-3 text-xl font-bold">📋 Lịch sử mua</h2>
        {purchases.length === 0 ? (
          <p className="opacity-70">Chưa có yêu cầu mua nào.</p>
        ) : (
          <ul className="space-y-2">
            {purchases.map((p) => (
              <li
                key={p.id}
                className="rounded-xl bg-[var(--chap-card-bg)] px-4 py-3 text-sm"
              >
                <p className="font-bold">{p.seriesTitle}</p>
                <p className="opacity-70">ND: {p.transferNote}</p>
                <p className="mt-1">
                  <span
                    className={
                      p.status === "approved"
                        ? "text-[#27ae60]"
                        : p.status === "pending"
                          ? "text-[var(--accent)]"
                          : "text-[#e74c3c]"
                    }
                  >
                    {p.status === "approved"
                      ? "✅ Đã duyệt"
                      : p.status === "pending"
                        ? "⏳ Chờ xác minh"
                        : "❌ Từ chối"}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
        <Button href="/library/purchased" variant="outline" className="mt-4">
          Thư viện đã mua
        </Button>
      </GlassCard>
    </PageShell>
  );
}
