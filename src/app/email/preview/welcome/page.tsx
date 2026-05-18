import { EmailLayout } from "@/components/email/EmailLayout";
import { PageShell } from "@/components/layout/PageShell";

export default function WelcomeEmailPreviewPage() {
  return (
    <PageShell maxWidth="reader">
      <EmailLayout
        title="Chào mừng đến MirAi!"
        ctaHref="/auth/login"
        ctaLabel="Đăng nhập"
      >
        <p>
          Đăng ký thành công. Từ nay, mọi thông báo xác minh mua truyện và cập nhật
          premium sẽ được gửi qua email đã đăng ký.
        </p>
        <p className="text-xs opacity-60">
          (Preview mẫu email — nội dung thật được ghi vào{" "}
          <code>data/email-outbox.json</code>)
        </p>
      </EmailLayout>
    </PageShell>
  );
}
