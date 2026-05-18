"use client";

import { useLibrarySync } from "@/hooks/use-library-sync";
import { isSupabaseConfiguredClient } from "@/lib/config/env";

export function LibrarySyncBridge() {
  useLibrarySync(isSupabaseConfiguredClient());
  return null;
}
