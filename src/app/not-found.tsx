import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell maxWidth="reader">
      <GlassCard className="text-center">
        <h1 className="gradient-title mb-4 text-3xl font-bold">404</h1>
        <p className="mb-6 opacity-80">Không tìm thấy trang hoặc chương này.</p>
        <Button href="/">⬅ Về trang chủ</Button>
      </GlassCard>
    </PageShell>
  );
}
