/**
 * Edge-safe environment checks for middleware.
 * Do NOT import @/lib/config/env here (keeps middleware bundle isolated).
 */

export function isSupabaseEnabledInMiddleware(): boolean {
  if (
    process.env.USE_JSON_DB === "true" ||
    process.env.DATA_BACKEND === "json"
  ) {
    return false;
  }
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

export function getSupabasePublicConfig(): {
  url: string;
  anonKey: string;
} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
