"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { adminApi } from "@/lib/admin/api-client";
import { AdminInput } from "@/components/admin/forms/AdminInput";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig } from "@/lib/config/site";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminApi.login(password);
      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("Mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md text-center">
        <p className="mb-2 text-4xl">⛔</p>
        <h1 className="gradient-title mb-1 text-2xl font-bold">Studio Lock</h1>
        <p className="mb-6 text-sm opacity-70">{siteConfig.webName} — Solo Admin</p>
        <form onSubmit={submit} className="text-left">
          <label className="mb-1.5 block text-sm font-bold" htmlFor="password">
            Mật khẩu
          </label>
          <AdminInput
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mirai-studio"
            required
          />
          {error && (
            <p className="mt-2 text-sm text-[#e74c3c]">{error}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            className="mt-4 w-full"
            disabled={loading}
          >
            {loading ? "..." : "Mở khóa"}
          </Button>
        </form>
        <p className="mt-4 text-xs opacity-50">
          Mặc định: <code>mirai-studio</code> — đổi qua ADMIN_PASSWORD trong .env.local
        </p>
      </GlassCard>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
