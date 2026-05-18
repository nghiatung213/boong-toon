import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageShell } from "@/components/layout/PageShell";

export default function SignupSuccessPage() {
  return (
    <PageShell maxWidth="reader">
      <GlassCard className="mx-auto max-w-lg text-center animate-fade-in">
        <p className="mb-4 text-5xl">✉️</p>
        <h1 className="gradient-title mb-3 text-3xl font-bold">
          Đăng ký thành công!
        </h1>
        <p className="mb-4 leading-relaxed opacity-90">
          Tài khoản của bạn đã được tạo. Từ nay, mọi thông báo xác minh mua truyện
          và cập nhật premium sẽ được gửi tới email đã đăng ký.
        </p>
        <p className="mb-8 text-sm opacity-60">
          Kiểm tra hộp thư đăng ký của bạn — chúng tôi đã gửi email chào mừng.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/" variant="primary">
            Khám phá truyện
          </Button>
          <Button href="/profile" variant="outline">
            Tài khoản
          </Button>
        </div>
      </GlassCard>
    </PageShell>
  );
}
