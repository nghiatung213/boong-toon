"use client";

import Image from "next/image";
import { useState } from "react";
import { paymentConfig } from "@/lib/config/payment";
import { cn } from "@/lib/utils/cn";

interface PaymentQrProps {
  className?: string;
}

export function PaymentQr({ className }: PaymentQrProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-white/95 shadow-[var(--shadow)]",
        className,
      )}
    >
      {!failed ? (
        <Image
          src={paymentConfig.qrImageUrl}
          alt="Mã QR chuyển khoản"
          fill
          className="object-contain p-3"
          unoptimized
          priority
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-[#5c4b37]">
          <span className="text-3xl">📷</span>
          <p className="font-bold">Không tải được mã QR</p>
          <p className="text-xs opacity-70">
            Vui lòng chuyển khoản thủ công theo thông tin bên cạnh.
          </p>
        </div>
      )}
    </div>
  );
}
