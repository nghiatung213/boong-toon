"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig } from "@/lib/config/site";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Đăng ký thất bại");
      router.push("/auth/signup/success");
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
          Tạo tài khoản
        </h1>
        <form onSubmit={submit}>
          <AuthFormField
            label="Username"
            id="username"
            value={username}
            onChange={setUsername}
            autoComplete="username"
            required
          />
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
            autoComplete="new-password"
            required
          />
          <AuthFormField
            label="Xác nhận mật khẩu"
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
          />
          {error && <p className="text-sm text-[#e74c3c]">{error}</p>}
          <Button type="submit" variant="primary" className="mt-4 w-full" disabled={loading}>
            {loading ? "..." : "Đăng ký"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm opacity-70">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-bold text-[var(--primary)]">
            Đăng nhập
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
