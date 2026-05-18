"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig } from "@/lib/config/site";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Đăng nhập thất bại");
      await refresh();
      router.push(searchParams.get("from") || "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md animate-fade-in">
        <p className="mb-1 text-center text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
          {siteConfig.webName}
        </p>
        <h1 className="gradient-title mb-6 text-center text-3xl font-bold">
          Đăng nhập
        </h1>
        <form onSubmit={submit} className="space-y-1">
          <AuthFormField
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <AuthFormField
            label="Mật khẩu"
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />
          {error && <p className="text-sm text-[#e74c3c]">{error}</p>}
          <Button type="submit" variant="primary" className="mt-4 w-full" disabled={loading}>
            {loading ? "..." : "Đăng nhập"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm opacity-70">
          Chưa có tài khoản?{" "}
          <Link href="/auth/signup" className="font-bold text-[var(--primary)]">
            Đăng ký
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center opacity-60">...</div>}>
      <LoginForm />
    </Suspense>
  );
}
