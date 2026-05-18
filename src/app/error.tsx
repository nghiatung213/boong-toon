"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageShell } from "@/components/layout/PageShell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell maxWidth="reader">
      <GlassCard className="text-center">
        <h1 className="gradient-title mb-2 text-2xl font-bold">
          Đã xảy ra lỗi
        </h1>
        <p className="mb-6 opacity-80">
          Hệ thống gặp sự cố tạm thời. Vui lòng thử lại.
        </p>
        <div className="flex justify-center gap-3">
          <Button type="button" variant="primary" onClick={reset}>
            Thử lại
          </Button>
          <Button href="/" variant="outline">
            Trang chủ
          </Button>
        </div>
      </GlassCard>
    </PageShell>
  );
}
