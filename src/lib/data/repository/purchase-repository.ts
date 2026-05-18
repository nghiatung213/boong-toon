import "server-only";

import { isSupabaseEnabled } from "@/lib/config/env";
import type {
  PurchaseRequest,
  PurchaseStatus,
  SeriesEntitlement,
} from "@/lib/types/purchase";
import * as json from "@/lib/data/repository/json/purchase-repository";
import * as supabase from "@/lib/data/repository/supabase/purchase-repository";

export const buildTransferNote = json.buildTransferNote;

export async function createPurchaseRequest(input: {
  userId: string;
  username: string;
  email: string;
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
}): Promise<PurchaseRequest> {
  return isSupabaseEnabled()
    ? supabase.createPurchaseRequest(input)
    : json.createPurchaseRequest(input);
}

export async function getPurchaseById(
  id: string,
): Promise<PurchaseRequest | undefined> {
  return isSupabaseEnabled()
    ? supabase.getPurchaseById(id)
    : json.getPurchaseById(id);
}

export async function listPurchaseRequests(filter?: {
  status?: PurchaseStatus;
  seriesSlug?: string;
  userId?: string;
  username?: string;
}): Promise<PurchaseRequest[]> {
  return isSupabaseEnabled()
    ? supabase.listPurchaseRequests(filter)
    : json.listPurchaseRequests(filter);
}

export async function getUserPurchases(
  userId: string,
): Promise<PurchaseRequest[]> {
  return isSupabaseEnabled()
    ? supabase.getUserPurchases(userId)
    : json.getUserPurchases(userId);
}

export async function getUserEntitlements(
  userId: string,
): Promise<SeriesEntitlement[]> {
  return isSupabaseEnabled()
    ? supabase.getUserEntitlements(userId)
    : json.getUserEntitlements(userId);
}

export async function hasEntitlement(
  userId: string,
  seriesSlug: string,
): Promise<boolean> {
  return isSupabaseEnabled()
    ? supabase.hasEntitlement(userId, seriesSlug)
    : json.hasEntitlement(userId, seriesSlug);
}

export async function getEntitlementStatus(
  userId: string,
  seriesSlug: string,
): Promise<"none" | "pending" | "approved" | "rejected"> {
  return isSupabaseEnabled()
    ? supabase.getEntitlementStatus(userId, seriesSlug)
    : json.getEntitlementStatus(userId, seriesSlug);
}

export async function approvePurchase(
  requestId: string,
  adminNote?: string,
): Promise<PurchaseRequest | null> {
  return isSupabaseEnabled()
    ? supabase.approvePurchase(requestId, adminNote)
    : json.approvePurchase(requestId, adminNote);
}

export async function rejectPurchase(
  requestId: string,
  adminNote?: string,
): Promise<PurchaseRequest | null> {
  return isSupabaseEnabled()
    ? supabase.rejectPurchase(requestId, adminNote)
    : json.rejectPurchase(requestId, adminNote);
}
