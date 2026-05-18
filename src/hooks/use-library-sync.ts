"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getLibrary, subscribeLibrary } from "@/lib/storage/library-store";
import type { MiraiLibrary } from "@/lib/types/library";

const SYNC_DEBOUNCE_MS = 3000;

export function useLibrarySync(enabled: boolean) {
  const { user, ready } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulledRef = useRef(false);

  const pullFromCloud = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/library/sync");
      if (!res.ok) return;
      const data = (await res.json()) as {
        library: MiraiLibrary | null;
        synced: boolean;
      };
      if (data.synced && data.library) {
        localStorage.setItem("mirai_library", JSON.stringify(data.library));
        window.dispatchEvent(new CustomEvent("mirai-library-updated"));
        pulledRef.current = true;
      }
    } catch {
      /* offline — keep local */
    }
  }, [user]);

  const pushToCloud = useCallback(async () => {
    if (!user) return;
    try {
      const library = getLibrary();
      await fetch("/api/library/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ library }),
      });
    } catch {
      /* retry on next change */
    }
  }, [user]);

  useEffect(() => {
    if (!enabled || !ready || !user) return;
    void pullFromCloud();
  }, [enabled, ready, user, pullFromCloud]);

  useEffect(() => {
    if (!enabled || !ready || !user) return;

    const schedulePush = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void pushToCloud();
      }, SYNC_DEBOUNCE_MS);
    };

    const unsub = subscribeLibrary(schedulePush);
    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, ready, user, pushToCloud]);
}
