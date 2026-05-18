"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { adminApi } from "@/lib/admin/api-client";
import { AdminInput } from "@/components/admin/forms/AdminInput";
import { FormField } from "@/components/admin/forms/FormField";
import { Button } from "@/components/ui/Button";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({
  label = "Ảnh bìa",
  value,
  onChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { url } = await adminApi.uploadCover(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload lỗi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormField label={label} hint="PNG/JPG/WebP, tối đa 5MB">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {value && (
          <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-xl shadow-[var(--shadow)]">
            <Image
              src={value}
              alt="Cover preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <AdminInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL ảnh hoặc upload"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Đang tải..." : "📤 Upload ảnh"}
          </Button>
          {error && <p className="text-sm text-[#e74c3c]">{error}</p>}
        </div>
      </div>
    </FormField>
  );
}
