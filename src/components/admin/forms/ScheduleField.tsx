"use client";

import { AdminInput } from "@/components/admin/forms/AdminInput";
import { FormField } from "@/components/admin/forms/FormField";

interface ScheduleFieldProps {
  value: number | null;
  onChange: (timestamp: number | null) => void;
}

function toDatetimeLocal(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ScheduleField({ value, onChange }: ScheduleFieldProps) {
  return (
    <FormField
      label="Hẹn giờ phát hành"
      hint="Để trống = phát hành ngay. Chương ẩn cho đến khi đến giờ."
    >
      <AdminInput
        type="datetime-local"
        value={toDatetimeLocal(value)}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) {
            onChange(null);
            return;
          }
          onChange(new Date(v).getTime());
        }}
      />
    </FormField>
  );
}
