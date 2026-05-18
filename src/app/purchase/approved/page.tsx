import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageShell } from "@/components/layout/PageShell";

export default function PurchaseApprovedScreenPage() {
  return (
    <PageShell maxWidth="reader">
      <GlassCard className="mx-auto max-w-lg text-center animate-fade-in">
        <p className="mb-4 text-5xl">🎉</p>
        <h1 className="gradient-title mb-3 text-3xl font-bold">
          Premium đã được mở khóa!
        </h1>
        <p className="mb-6 leading-relaxed opacity-90">
          Thanh toán đã được xác minh. Bạn có quyền đọc trọn bộ — mọi chương hiện
          tại và chương mới phát hành sau này.
        </p>
        <p className="mb-8 text-sm opacity-60">
          Kiểm tra hộp thư email để xem thông báo chi tiết.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/library/purchased" variant="primary">
            Thư viện đã mua
          </Button>
          <Button href="/" variant="outline">
            Trang chủ
          </Button>
        </div>
        <p className="mt-6 text-xs opacity-50">
          <Link href="/email/preview/purchase-approved" className="underline">
            Xem mẫu email
          </Link>
        </p>
      </GlassCard>
    </PageShell>
  );
}
