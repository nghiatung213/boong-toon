"use client";

import { useCallback, useEffect, useState } from "react";
import type { PurchaseRequest } from "@/lib/types/purchase";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminInput, AdminSelect } from "@/components/admin/forms/AdminInput";
import { FormField } from "@/components/admin/forms/FormField";

export function PurchaseVerification() {
  const [items, setItems] = useState<PurchaseRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterSeries, setFilterSeries] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterSeries) params.set("seriesSlug", filterSeries);
    if (filterUser) params.set("username", filterUser);
    const res = await fetch(`/api/admin/purchases?${params}`);
    const data = (await res.json()) as { purchases: PurchaseRequest[] };
    setItems(data.purchases);
    setLoading(false);
  }, [filterStatus, filterSeries, filterUser]);

  useEffect(() => {
    void load();
  }, [load]);

  const review = async (id: string, action: "approve" | "reject") => {
    const note =
      action === "reject"
        ? prompt("Lý do từ chối (tuỳ chọn):") ?? undefined
        : undefined;
    await fetch(`/api/admin/purchases/${id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNote: note }),
    });
    void load();
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <h1 className="gradient-title mb-4 text-2xl font-bold">
          💳 Xác minh mua truyện
        </h1>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Trạng thái">
            <AdminSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </AdminSelect>
          </FormField>
          <FormField label="Series slug">
            <AdminInput
              value={filterSeries}
              onChange={(e) => setFilterSeries(e.target.value)}
              placeholder="mirai"
            />
          </FormField>
          <FormField label="Username">
            <AdminInput
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              placeholder="namutachi"
            />
          </FormField>
        </div>
        <Button type="button" variant="outline" onClick={() => void load()}>
          Lọc lại
        </Button>
      </GlassCard>

      {loading ? (
        <p className="opacity-60">Đang tải...</p>
      ) : items.length === 0 ? (
        <GlassCard>
          <p className="text-center opacity-70">Không có yêu cầu nào.</p>
        </GlassCard>
      ) : (
        items.map((p) => (
          <GlassCard key={p.id} padding="md">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-bold">{p.seriesTitle}</p>
                <p className="text-sm">
                  @{p.username} · {p.email}
                </p>
                <p className="mt-2 font-mono text-sm text-[var(--primary)]">
                  {p.transferNote}
                </p>
                <p className="mt-1 text-xs opacity-60">
                  {new Date(p.createdAt).toLocaleString("vi-VN")} · {p.status}
                </p>
              </div>
              {p.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => void review(p.id, "approve")}
                  >
                    Duyệt
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => void review(p.id, "reject")}
                  >
                    Từ chối
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>
        ))
      )}
    </div>
  );
}
