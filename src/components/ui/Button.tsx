import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "success" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(255,107,129,0.4)]",
  outline:
    "border-2 border-[var(--primary)] bg-transparent text-[var(--primary)] hover:-translate-y-0.5",
  ghost:
    "border border-[var(--glass-border)] bg-transparent text-[var(--text)] hover:border-[var(--primary)]",
  success:
    "border-0 bg-[#27ae60] text-white hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(39,174,96,0.35)]",
  danger:
    "border-0 bg-[#e74c3c] text-white hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(231,76,60,0.35)]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  variant = "primary",
  href,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
