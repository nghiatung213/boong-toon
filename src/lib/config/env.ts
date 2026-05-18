/**
 * Centralized environment configuration.
 * JSON backend is used when Supabase is not fully configured (local dev fallback).
 */

export type DataBackend = "json" | "supabase";

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

/** Safe for client components (only uses NEXT_PUBLIC_* vars). */
export function isSupabaseConfiguredClient(): boolean {
  return isSupabaseConfigured();
}

export function getDataBackend(): DataBackend {
  const onVercel =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

  if (onVercel) {
    if (isSupabaseConfigured()) return "supabase";
    console.error(
      "[MirAi] Production requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return "json";
  }

  if (
    process.env.DATA_BACKEND === "json" ||
    process.env.USE_JSON_DB === "true"
  ) {
    return "json";
  }
  return isSupabaseConfigured() ? "supabase" : "json";
}

export function isSupabaseEnabled(): boolean {
  return getDataBackend() === "supabase";
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",
  dataBackend: getDataBackend(),
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "",
  },
  auth: {
    secret: process.env.AUTH_SECRET ?? "mirai-auth-secret-change-me",
  },
  admin: {
    password: process.env.ADMIN_PASSWORD ?? "mirai-studio",
  },
} as const;

/** Call at server startup in production to catch misconfiguration early. */
export function assertProductionEnv(): void {
  if (!env.isProduction) return;

  if (isSupabaseEnabled()) {
    required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
    required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    required(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  }

  if (env.auth.secret === "mirai-auth-secret-change-me") {
    console.warn("[MirAi] WARNING: AUTH_SECRET is still default in production.");
  }
  if (env.admin.password === "mirai-studio") {
    console.warn("[MirAi] WARNING: ADMIN_PASSWORD is still default in production.");
  }
}
