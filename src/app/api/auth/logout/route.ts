export const runtime = "nodejs";

import { signOut, clearAuthCookies, USER_COOKIE } from "@/lib/auth/auth-service";
import { isSupabaseEnabled } from "@/lib/config/env";
import { jsonOk } from "@/lib/admin/api-helpers";

export async function POST() {
  await signOut();
  const response = jsonOk({ ok: true });

  if (!isSupabaseEnabled()) {
    response.cookies.delete(USER_COOKIE);
  } else {
    await clearAuthCookies();
  }

  return response;
}
