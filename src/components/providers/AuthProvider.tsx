"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { PublicUser } from "@/lib/types/user";
import type { PurchaseRequest } from "@/lib/types/purchase";

interface AuthContextValue {
  user: PublicUser | null;
  entitlements: string[];
  purchases: PurchaseRequest[];
  unreadCount: number;
  ready: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  hasEntitlement: (seriesSlug: string) => boolean;
  getPurchaseStatus: (seriesSlug: string) => PurchaseRequest["status"] | "none";
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [entitlements, setEntitlements] = useState<string[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = (await res.json()) as {
        user: PublicUser | null;
        entitlements?: string[];
        purchases?: PurchaseRequest[];
        unreadNotifications?: number;
      };
      setUser(data.user);
      setEntitlements(data.entitlements ?? []);
      setPurchases(data.purchases ?? []);
      setUnreadCount(data.unreadNotifications ?? 0);
    } catch {
      setUser(null);
      setEntitlements([]);
      setPurchases([]);
      setUnreadCount(0);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setEntitlements([]);
    setPurchases([]);
    setUnreadCount(0);
    router.replace("/");
    router.refresh();
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      entitlements,
      purchases,
      unreadCount,
      ready,
      refresh,
      logout,
      hasEntitlement: (slug) => entitlements.includes(slug),
      getPurchaseStatus: (slug) => {
        const p = purchases.find((x) => x.seriesSlug === slug);
        return p?.status ?? "none";
      },
    }),
    [user, entitlements, purchases, unreadCount, ready, refresh, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
