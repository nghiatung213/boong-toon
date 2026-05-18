import { EmailLayout } from "@/components/email/EmailLayout";
import { PageShell } from "@/components/layout/PageShell";

export default function PurchaseApprovedEmailPreviewPage() {
  return (
    <PageShell maxWidth="reader">
      <EmailLayout
        title="Mua truyện thành công!"
        ctaHref="/library/purchased"
        ctaLabel="Mở thư viện đã mua"
      >
        <p>
          Admin đã xác minh thanh toán. Bạn đã sở hữu trọn bộ{" "}
          <strong>MirAi Project</strong> — bao gồm mọi chương hiện tại và tương lai.
        </p>
        <p className="text-xs opacity-60">
          (Preview mẫu email sau khi admin duyệt)
        </p>
      </EmailLayout>
    </PageShell>
  );
}
