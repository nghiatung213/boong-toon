"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { PaymentQr } from "@/components/payment/PaymentQr";
import { SeriesPriceBadge } from "@/components/series/SeriesPriceBadge";
import { paymentConfig } from "@/lib/config/payment";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageShell } from "@/components/layout/PageShell";
import type { Series } from "@/lib/types/series";
import {
  formatSeriesPrice,
  isSeriesFree,
  requiresPurchase,
} from "@/lib/utils/series-pricing";

interface PurchaseClientProps {
  series: Series;
}

const VERIFICATION_NOTICE =
  "Sau khi hoàn tất chuyển khoản, hệ thống sẽ xác minh thủ công trong vòng tối đa 12 giờ. Kết quả sẽ được gửi tới email bạn đã đăng ký — vui lòng theo dõi hộp thư để truy cập truyện sớm nhất có thể.";

export function PurchaseClient({ series }: PurchaseClientProps) {
  const router = useRouter();
  const { user, ready, refresh, getPurchaseStatus } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const transferNote = user
    ? `${user.username} + ${series.title}`
    : paymentConfig.noteTemplate
        .replace("{username}", "?")
        .replace("{seriesName}", series.title);

  useEffect(() => {
    if (!ready) return;
    if (isSeriesFree(series)) {
      router.replace(`/series/${series.slug}`);
      return;
    }
    if (getPurchaseStatus(series.slug) === "approved") {
      router.replace(`/series/${series.slug}`);
    }
  }, [ready, series, getPurchaseStatus, router]);

  if (!ready) return null;

  if (!requiresPurchase(series)) {
    return null;
  }

  const status = getPurchaseStatus(series.slug);

  const submitRequest = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesSlug: series.slug }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error);
      }
      await refresh();
      setDone(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell maxWidth="catalog" className="pb-24">
      <GlassCard className="animate-fade-in">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="gradient-title text-2xl font-bold">Mua truyện premium</h1>
          <SeriesPriceBadge series={series} size="md" />
        </div>
        <p className="mb-2 opacity-80">
          Trọn bộ <strong>{series.title}</strong> — mọi chương hiện tại & tương lai
        </p>
        <p className="mb-6 text-xl font-bold text-[var(--primary)]">
          {formatSeriesPrice(series)}
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard padding="md" className="!bg-[var(--chap-card-bg)] text-center">
            <p className="mb-3 text-sm font-bold">Quét mã QR để chuyển khoản</p>
            <PaymentQr />
          </GlassCard>

          <div className="space-y-3 text-sm">
            <p>
              <strong>Người nhận:</strong> {paymentConfig.receiverName}
            </p>
            <p>
              <strong>Ngân hàng:</strong> {paymentConfig.bankName}
            </p>
            <p>
              <strong>Số tài khoản:</strong> {paymentConfig.accountNumber}
            </p>
            <div className="rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 p-3">
              <p className="text-xs font-bold uppercase text-[var(--primary)]">
                Nội dung chuyển khoản
              </p>
              <p className="mt-1 break-all font-mono text-lg font-bold">
                {transferNote}
              </p>
            </div>
          </div>
        </div>

        <GlassCard
          padding="md"
          className="mt-6 border border-[var(--accent)]/30 !bg-[var(--accent)]/5"
        >
          <p className="text-sm leading-relaxed opacity-90">
            <span className="mr-1">ℹ️</span>
            {VERIFICATION_NOTICE}
          </p>
        </GlassCard>

        {done || status === "pending" ? (
          <GlassCard padding="md" className="mt-6 !border-[var(--accent)]">
            <p className="font-bold text-[var(--accent)]">⏳ Đang chờ xác minh</p>
            <p className="mt-2 text-sm opacity-80">
              Bạn sẽ nhận email và thông báo trong app khi admin duyệt.
            </p>
            <Button href="/profile" variant="outline" className="mt-3">
              Tài khoản
            </Button>
          </GlassCard>
        ) : (
          <Button
            type="button"
            variant="primary"
            className="mt-6 w-full"
            disabled={submitting}
            onClick={() => void submitRequest()}
          >
            {submitting ? "..." : "✓ Tôi đã chuyển khoản"}
          </Button>
        )}

        <Button href={`/series/${series.slug}`} variant="ghost" className="mt-3 w-full">
          Quay lại
        </Button>
      </GlassCard>
    </PageShell>
  );
}
