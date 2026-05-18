import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "mirai-field w-full rounded-xl border border-[var(--glass-border)] bg-white/50 px-4 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:shadow-[0_0_10px_rgba(255,107,129,0.2)] [data-theme=dark]:bg-black/30";

export function AdminInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function AdminTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClass, "min-h-[120px] resize-y", className)}
      {...props}
    />
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, className)} {...props}>
      {children}
    </select>
  );
}
