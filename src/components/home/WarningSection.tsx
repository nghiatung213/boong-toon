import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";

export function WarningSection() {
  return (
    <GlassCard className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--primary)]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start md:text-left">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[var(--primary)]/40 shadow-[0_0_40px_rgba(255,107,129,0.25)]">
          <Image
            src="/images/BoongToon_Warning.jpg"
            alt="WarningSection"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="max-w-2xl text-center md:text-left">
          
          <h2 className="gradient-title mb-1 text-2xl font-bold sm:text-3xl">
          ⚠️ CẢNH BÁO BẢN QUYỀN – BOONGTOON
          </h2>
          
          <p className="leading-relaxed opacity-90">
          Toàn bộ tiểu thuyết, hình ảnh minh họa, nhân vật, nội dung sáng tạo và các tác phẩm được đăng tải trên nền tảng BoongToon đều thuộc quyền sở hữu của tác giả và/hoặc BoongToon, được bảo hộ theo quy định của pháp luật về quyền tác giả và sở hữu trí tuệ.

Nghiêm cấm mọi hành vi: • Sao chép, đăng lại, chuyển thể hoặc chỉnh sửa nội dung khi chưa có sự cho phép. • Re-up truyện lên website, mạng xã hội hoặc bất kỳ nền tảng nào khác dưới mọi hình thức. • Sử dụng nội dung nhằm mục đích thương mại trái phép. • Cắt ghép, dịch thuật hoặc phát tán bản lậu gây ảnh hưởng đến tác giả và nền tảng.

Mọi hành vi vi phạm bản quyền sẽ được BoongToon lưu trữ bằng chứng và xử lý theo quy định pháp luật hiện hành.

Vui lòng tôn trọng công sức sáng tạo của tác giả. Đọc truyện chính thức duy nhất tại BoongToon.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
