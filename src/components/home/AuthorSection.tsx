import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";

export function AuthorSection() {
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
            src="/images/author-image.svg"
            alt="Nguyễn Ngọc Quỳnh Trang"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="max-w-2xl text-center md:text-left">
          
          <h2 className="gradient-title mb-1 text-2xl font-bold sm:text-3xl">
          Nơi BoongTooon bắt đầu
          </h2>
          
          <p className="leading-relaxed opacity-90">
          BoongToon.com — Gửi thời thanh xuân ấm áp của chúng ta. 
          Giữa dòng đời vội vã, có những câu chuyện sinh ra là để sưởi ấm những tâm hồn cô độc. BoongToon tựa như một góc nhỏ bình yên, nơi thời gian ngừng lại bên hiên nhà đầy nắng, nơi khói trà vừa lên và những trang sách cổ bắt đầu lật mở.
BoongToon ra đời không chỉ để mở ra một trang sách, mà là để tạo nên một trạm dừng chân giữa dòng chảy xiết của năm tháng. Nơi đây lưu giữ bóng hình chàng trai năm mười bảy tuổi đứng dưới vạt nắng sân trường, dệt nên những chấp niệm thanh xuân bỏ ngỏ; cũng là nơi chứng kiến những mối tình khắc cốt ghi tâm xuyên qua ngàn năm tuế nguyệt, những kiếp nhân sinh vương vấn chốn tiên hiền huyền ảo.
Lật mở một chương truyện, khép lại những muộn phiền. Hãy để BoongToon đồng hành cùng bạn đi qua những đêm trường cô tịch, hong khô những tiếc nuối và tìm lại những rung động nguyên sơ nhất.
Gặp gỡ tại BoongToon, thanh xuân là mãi mãi.
          </p>
          <p className="mt-3 text-sm italic opacity-70">
            Cảm ơn bạn đã ghé thăm — hy vọng mỗi chương truyện sẽ là một hành trình
            nhỏ bên bạn.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
