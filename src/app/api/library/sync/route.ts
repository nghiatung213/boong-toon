export const runtime = "nodejs";

import { getSessionUserFromRequest } from "@/lib/auth/auth-service";
import { isSupabaseEnabled } from "@/lib/config/env";
import {
  loadUserLibrary,
  saveUserLibrary,
} from "@/lib/data/repository/supabase/library-repository";
import type { MiraiLibrary } from "@/lib/types/library";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

export async function GET(request: Request) {
  if (!isSupabaseEnabled()) {
    return jsonOk({ library: null, synced: false });
  }

  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonError("Unauthorized", 401);

  const library = await loadUserLibrary(user.id);
  return jsonOk({ library, synced: true });
}

export async function POST(request: Request) {
  if (!isSupabaseEnabled()) {
    return jsonOk({ ok: true, synced: false });
  }

  const user = await getSessionUserFromRequest(request);
  if (!user) return jsonError("Unauthorized", 401);

  const body = (await request.json()) as { library: MiraiLibrary };
  if (!body.library?.version) {
    return jsonError("Invalid library payload");
  }

  await saveUserLibrary(user.id, body.library);
  return jsonOk({ ok: true, synced: true });
}
