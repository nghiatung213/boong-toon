"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/forms/ImageUpload";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/forms/AdminInput";
import { FormField } from "@/components/admin/forms/FormField";
import { TagPicker } from "@/components/admin/forms/TagPicker";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Series, SeriesStatus, SeriesType } from "@/lib/types/series";
import { siteConfig } from "@/lib/config/site";

export interface SeriesFormValues {
  title: string;
  slug: string;
  type: SeriesType;
  synopsis: string;
  coverUrl: string;
  genres: string[];
  status: SeriesStatus;
  tagline: string;
  isPremium: boolean;
  price: number;
}

interface SeriesFormProps {
  initial?: Partial<Series>;
  availableGenres: string[];
  onSubmit: (values: SeriesFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitLabel?: string;
}

const defaultValues: SeriesFormValues = {
  title: "",
  slug: "",
  type: "novel",
  synopsis: "",
  coverUrl: siteConfig.defaultCover,
  genres: [],
  status: "ongoing",
  tagline: "",
  isPremium: false,
  price: 0,
};

export function SeriesForm({
  initial,
  availableGenres,
  onSubmit,
  onDelete,
  submitLabel = "Lưu truyện",
}: SeriesFormProps) {
  const [values, setValues] = useState<SeriesFormValues>({
    ...defaultValues,
    ...initial,
    tagline: initial?.tagline ?? "",
    slug: initial?.slug ?? "",
    genres: initial?.genres ?? [],
    isPremium: initial?.isPremium ?? false,
    price: initial?.price ?? (initial?.isPremium ? 49_000 : 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof SeriesFormValues>(
    key: K,
    val: SeriesFormValues[K],
  ) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard as="section">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-4 text-xl font-bold">Thông tin truyện</h2>

        <FormField label="Tiêu đề" htmlFor="title">
          <AdminInput
            id="title"
            required
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </FormField>

        <FormField label="Slug (URL)" htmlFor="slug" hint="/series/[slug]">
          <AdminInput
            id="slug"
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="mirai-project"
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Loại">
            <AdminSelect
              value={values.type}
              onChange={(e) => set("type", e.target.value as SeriesType)}
            >
              <option value="novel">Novel</option>
              <option value="manga">Manga</option>
            </AdminSelect>
          </FormField>
          <FormField label="Trạng thái">
            <AdminSelect
              value={values.status}
              onChange={(e) => set("status", e.target.value as SeriesStatus)}
            >
              <option value="ongoing">Đang ra</option>
              <option value="completed">Hoàn thành</option>
              <option value="hiatus">Tạm dừng</option>
            </AdminSelect>
          </FormField>
        </div>

        <FormField label="Tagline">
          <AdminInput
            value={values.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </FormField>

        <FormField label="Mô tả">
          <AdminTextarea
            value={values.synopsis}
            onChange={(e) => set("synopsis", e.target.value)}
            rows={4}
          />
        </FormField>

        <ImageUpload value={values.coverUrl} onChange={(url) => set("coverUrl", url)} />

        <TagPicker
          availableTags={availableGenres}
          value={values.genres}
          onChange={(genres) => set("genres", genres)}
        />

        <FormField
          label="Giá trọn bộ (VND)"
          htmlFor="price"
          hint="Nhập 0 = miễn phí (tự mở khóa). Giá > 0 = cần mua qua xác minh."
        >
          <AdminInput
            id="price"
            type="number"
            min={0}
            step={1000}
            value={values.price}
            onChange={(e) => set("price", Math.max(0, Number(e.target.value) || 0))}
          />
        </FormField>

        <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={values.isPremium}
            onChange={(e) => {
              const checked = e.target.checked;
              set("isPremium", checked);
              if (!checked) set("price", 0);
              else if (values.price === 0) set("price", 49_000);
            }}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          Truyện premium (có chương khóa / mua)
        </label>

        {error && <p className="mb-3 text-sm text-[#e74c3c]">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Đang lưu..." : submitLabel}
          </Button>
          {onDelete && (
            <Button
              type="button"
              variant="danger"
              disabled={saving}
              onClick={() => {
                if (
                  confirm(
                    "Xóa truyện và TẤT CẢ chương? Hành động không hoàn tác.",
                  )
                ) {
                  void onDelete();
                }
              }}
            >
              Xóa truyện
            </Button>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
