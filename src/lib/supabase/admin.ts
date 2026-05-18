import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/config/env";

/** Service-role client — server-only, bypasses RLS. Never expose to browser. */
export function createAdminClient() {
  if (!env.supabase.url || !env.supabase.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }
  return createClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
