"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface ChapterImageUploaderProps {
  seriesId: string;
  onInsert: (markdown: string) => void;
}

export function ChapterImageUploader({
  seriesId,
  onInsert,
}: ChapterImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<{ url: string; markdown: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Chỉ chấp nhận file ảnh");
        return;
      }
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("seriesId", seriesId);
        const res = await fetch("/api/admin/upload/chapter-image", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as {
          url?: string;
          markdown?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        setPreview({ url: data.url!, markdown: data.markdown! });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lỗi upload");
      } finally {
        setUploading(false);
      }
    },
    [seriesId],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void upload(file);
  };

  return (
    <div className="mb-4 rounded-xl border border-dashed border-[var(--glass-border)] p-4">
      <p className="mb-2 text-sm font-bold">📷 Chèn ảnh vào chương</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-xl p-6 text-center transition",
          dragOver
            ? "bg-[var(--primary)]/15 border-2 border-[var(--primary)]"
            : "bg-[var(--chap-card-bg)]",
        )}
      >
        <p className="mb-2 text-sm opacity-70">
          Kéo thả ảnh vào đây hoặc chọn file
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Đang tải..." : "Chọn ảnh"}
        </Button>
      </div>

      {error && <p className="mt-2 text-sm text-[#e74c3c]">{error}</p>}

      {preview && (
        <div className="mt-4 rounded-xl bg-black/20 p-3">
          <p className="mb-2 text-xs font-bold">Xem trước</p>
          <div className="relative mx-auto mb-3 aspect-video max-h-48 w-full max-w-md overflow-hidden rounded-lg">
            <Image
              src={preview.url}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="primary"
              className="flex-1 text-xs"
              onClick={() => {
                onInsert(`\n\n${preview.markdown}\n\n`);
                setPreview(null);
              }}
            >
              Chèn vào nội dung
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-xs"
              onClick={() => setPreview(null)}
            >
              Hủy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
