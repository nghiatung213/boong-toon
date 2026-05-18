"use client";

import { useCallback, useEffect, useState } from "react";
import type { PurchaseStatus } from "@/lib/types/purchase";

export function useSeriesAccess(seriesSlug: string) {
  const [status, setStatus] = useState<PurchaseStatus | "none" | "approved">(
    "none",
  );
  const [entitled, setEntitled] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/purchases/access?seriesSlug=${encodeURIComponent(seriesSlug)}`,
      );
      const data = (await res.json()) as {
        status: PurchaseStatus | "none";
        entitled: boolean;
      };
      setStatus(data.status);
      setEntitled(data.entitled);
    } catch {
      setStatus("none");
      setEntitled(false);
    } finally {
      setLoading(false);
    }
  }, [seriesSlug]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, entitled, loading, refresh };
}
