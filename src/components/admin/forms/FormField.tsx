import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("mb-4", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-bold text-[var(--text)]"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs opacity-60">{hint}</p>}
    </div>
  );
}
