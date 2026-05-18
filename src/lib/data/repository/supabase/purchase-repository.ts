import { createAdminClient } from "@/lib/supabase/admin";
import type {
  PurchaseRequest,
  PurchaseStatus,
  SeriesEntitlement,
} from "@/lib/types/purchase";
import { generateId } from "@/lib/utils/slug";

function mapPurchase(row: Record<string, unknown>): PurchaseRequest {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    username: row.username as string,
    email: row.email as string,
    seriesId: row.series_id as string,
    seriesSlug: row.series_slug as string,
    seriesTitle: row.series_title as string,
    transferNote: row.transfer_note as string,
    status: row.status as PurchaseStatus,
    createdAt: new Date(row.created_at as string).getTime(),
    reviewedAt: row.reviewed_at
      ? new Date(row.reviewed_at as string).getTime()
      : undefined,
    adminNote: row.admin_note as string | undefined,
  };
}

export function buildTransferNote(username: string, seriesTitle: string): string {
  return `${username} + ${seriesTitle}`;
}

export async function createPurchaseRequest(input: {
  userId: string;
  username: string;
  email: string;
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
}): Promise<PurchaseRequest> {
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("purchase_requests")
    .select("*")
    .eq("user_id", input.userId)
    .eq("series_slug", input.seriesSlug)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) return mapPurchase(existing);

  const row = {
    id: generateId("pur"),
    user_id: input.userId,
    username: input.username,
    email: input.email,
    series_id: input.seriesId,
    series_slug: input.seriesSlug,
    series_title: input.seriesTitle,
    transfer_note: buildTransferNote(input.username, input.seriesTitle),
    status: "pending",
  };

  const { data, error } = await admin
    .from("purchase_requests")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapPurchase(data);
}

export async function getPurchaseById(
  id: string,
): Promise<PurchaseRequest | undefined> {
  const { data } = await createAdminClient()
    .from("purchase_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ? mapPurchase(data) : undefined;
}

export async function listPurchaseRequests(filter?: {
  status?: PurchaseStatus;
  seriesSlug?: string;
  userId?: string;
  username?: string;
}): Promise<PurchaseRequest[]> {
  let query = createAdminClient().from("purchase_requests").select("*");

  if (filter?.status) query = query.eq("status", filter.status);
  if (filter?.seriesSlug) query = query.eq("series_slug", filter.seriesSlug);
  if (filter?.userId) query = query.eq("user_id", filter.userId);
  if (filter?.username) query = query.ilike("username", `%${filter.username}%`);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPurchase);
}

export async function getUserPurchases(userId: string): Promise<PurchaseRequest[]> {
  return listPurchaseRequests({ userId });
}

export async function getUserEntitlements(
  userId: string,
): Promise<SeriesEntitlement[]> {
  const { data } = await createAdminClient()
    .from("entitlements")
    .select("*")
    .eq("user_id", userId);

  return (data ?? []).map((row) => ({
    userId: row.user_id as string,
    seriesId: row.series_id as string,
    seriesSlug: row.series_slug as string,
    approvedAt: new Date(row.approved_at as string).getTime(),
    purchaseRequestId: row.purchase_request_id as string,
  }));
}

export async function hasEntitlement(
  userId: string,
  seriesSlug: string,
): Promise<boolean> {
  const { count } = await createAdminClient()
    .from("entitlements")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("series_slug", seriesSlug);
  return (count ?? 0) > 0;
}

export async function getEntitlementStatus(
  userId: string,
  seriesSlug: string,
): Promise<"none" | "pending" | "approved" | "rejected"> {
  if (await hasEntitlement(userId, seriesSlug)) return "approved";
  const purchases = await listPurchaseRequests({ userId, seriesSlug });
  if (purchases.some((p) => p.status === "pending")) return "pending";
  if (purchases.some((p) => p.status === "rejected")) return "rejected";
  return "none";
}

export async function approvePurchase(
  requestId: string,
  adminNote?: string,
): Promise<PurchaseRequest | null> {
  const admin = createAdminClient();
  const existing = await getPurchaseById(requestId);
  if (!existing) return null;

  const reviewedAt = new Date().toISOString();
  await admin
    .from("purchase_requests")
    .update({
      status: "approved",
      reviewed_at: reviewedAt,
      admin_note: adminNote ?? null,
    })
    .eq("id", requestId);

  await admin.from("entitlements").upsert(
    {
      user_id: existing.userId,
      series_id: existing.seriesId,
      series_slug: existing.seriesSlug,
      purchase_request_id: requestId,
      approved_at: reviewedAt,
    },
    { onConflict: "user_id,series_slug" },
  );

  return {
    ...existing,
    status: "approved",
    reviewedAt: Date.now(),
    adminNote,
  };
}

export async function rejectPurchase(
  requestId: string,
  adminNote?: string,
): Promise<PurchaseRequest | null> {
  const existing = await getPurchaseById(requestId);
  if (!existing) return null;

  await createAdminClient()
    .from("purchase_requests")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      admin_note: adminNote ?? null,
    })
    .eq("id", requestId);

  return {
    ...existing,
    status: "rejected",
    reviewedAt: Date.now(),
    adminNote,
  };
}
