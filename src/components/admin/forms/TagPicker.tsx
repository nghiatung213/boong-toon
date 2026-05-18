"use client";

import { useState } from "react";
import { AdminInput } from "@/components/admin/forms/AdminInput";
import { FormField } from "@/components/admin/forms/FormField";
import { cn } from "@/lib/utils/cn";

interface TagPickerProps {
  label?: string;
  availableTags: string[];
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagPicker({
  label = "Thể loại / Tags",
  availableTags,
  value,
  onChange,
}: TagPickerProps) {
  const [custom, setCustom] = useState("");

  const toggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  const addCustom = () => {
    const tag = custom.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setCustom("");
  };

  return (
    <FormField label={label} hint="Chọn từ danh sách hoặc thêm tag mới">
      <div className="mb-3 flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-bold transition",
              value.includes(tag)
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--glass-border)] bg-[var(--chap-card-bg)]",
            )}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <AdminInput
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Tag mới..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <button
          type="button"
          onClick={addCustom}
          className="shrink-0 rounded-full border-2 border-[var(--primary)] px-4 py-2 text-sm font-bold text-[var(--primary)]"
        >
          +
        </button>
      </div>
    </FormField>
  );
}
