import "server-only";

import fs from "node:fs";
import type {
  PurchaseRequest,
  PurchaseStatus,
  SeriesEntitlement,
} from "@/lib/types/purchase";
import {
  ensureDataDirs,
  getEntitlementsPath,
  getPurchasesPath,
} from "@/lib/data/repository/paths";
import { generateId } from "@/lib/utils/slug";

function readPurchases(): PurchaseRequest[] {
  ensureDataDirs();
  const file = getPurchasesPath();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as PurchaseRequest[];
}

function writePurchases(items: PurchaseRequest[]): void {
  ensureDataDirs();
  fs.writeFileSync(getPurchasesPath(), JSON.stringify(items, null, 2), "utf-8");
}

function readEntitlements(): SeriesEntitlement[] {
  ensureDataDirs();
  const file = getEntitlementsPath();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as SeriesEntitlement[];
}

function writeEntitlements(items: SeriesEntitlement[]): void {
  ensureDataDirs();
  fs.writeFileSync(
    getEntitlementsPath(),
    JSON.stringify(items, null, 2),
    "utf-8",
  );
}

export function buildTransferNote(username: string, seriesTitle: string): string {
  return `${username} + ${seriesTitle}`;
}

export function createPurchaseRequest(input: {
  userId: string;
  username: string;
  email: string;
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
}): PurchaseRequest {
  const items = readPurchases();
  const existing = items.find(
    (p) =>
      p.userId === input.userId &&
      p.seriesSlug === input.seriesSlug &&
      p.status === "pending",
  );
  if (existing) return existing;

  const request: PurchaseRequest = {
    id: generateId("pur"),
    userId: input.userId,
    username: input.username,
    email: input.email,
    seriesId: input.seriesId,
    seriesSlug: input.seriesSlug,
    seriesTitle: input.seriesTitle,
    transferNote: buildTransferNote(input.username, input.seriesTitle),
    status: "pending",
    createdAt: Date.now(),
  };
  items.push(request);
  writePurchases(items);
  return request;
}

export function getPurchaseById(id: string): PurchaseRequest | undefined {
  return readPurchases().find((p) => p.id === id);
}

export function listPurchaseRequests(filter?: {
  status?: PurchaseStatus;
  seriesSlug?: string;
  userId?: string;
  username?: string;
}): PurchaseRequest[] {
  let items = readPurchases();
  if (filter?.status) items = items.filter((p) => p.status === filter.status);
  if (filter?.seriesSlug) {
    items = items.filter((p) => p.seriesSlug === filter.seriesSlug);
  }
  if (filter?.userId) items = items.filter((p) => p.userId === filter.userId);
  if (filter?.username) {
    const q = filter.username.trim().toLowerCase();
    items = items.filter((p) => p.username.toLowerCase().includes(q));
  }
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export function getUserPurchases(userId: string): PurchaseRequest[] {
  return listPurchaseRequests({ userId });
}

export function getUserEntitlements(userId: string): SeriesEntitlement[] {
  return readEntitlements().filter((e) => e.userId === userId);
}

export function hasEntitlement(userId: string, seriesSlug: string): boolean {
  return readEntitlements().some(
    (e) => e.userId === userId && e.seriesSlug === seriesSlug,
  );
}

export function getEntitlementStatus(
  userId: string,
  seriesSlug: string,
): "none" | "pending" | "approved" | "rejected" {
  if (hasEntitlement(userId, seriesSlug)) return "approved";
  const pending = readPurchases().find(
    (p) =>
      p.userId === userId && p.seriesSlug === seriesSlug && p.status === "pending",
  );
  if (pending) return "pending";
  const rejected = readPurchases().find(
    (p) =>
      p.userId === userId &&
      p.seriesSlug === seriesSlug &&
      p.status === "rejected",
  );
  if (rejected) return "rejected";
  return "none";
}

export function approvePurchase(
  requestId: string,
  adminNote?: string,
): PurchaseRequest | null {
  const items = readPurchases();
  const index = items.findIndex((p) => p.id === requestId);
  if (index === -1) return null;

  const request = items[index];
  request.status = "approved";
  request.reviewedAt = Date.now();
  request.adminNote = adminNote;
  items[index] = request;
  writePurchases(items);

  const entitlements = readEntitlements();
  if (
    !entitlements.some(
      (e) => e.userId === request.userId && e.seriesSlug === request.seriesSlug,
    )
  ) {
    entitlements.push({
      userId: request.userId,
      seriesId: request.seriesId,
      seriesSlug: request.seriesSlug,
      approvedAt: Date.now(),
      purchaseRequestId: request.id,
    });
    writeEntitlements(entitlements);
  }

  return request;
}

export function rejectPurchase(
  requestId: string,
  adminNote?: string,
): PurchaseRequest | null {
  const items = readPurchases();
  const index = items.findIndex((p) => p.id === requestId);
  if (index === -1) return null;
  items[index].status = "rejected";
  items[index].reviewedAt = Date.now();
  items[index].adminNote = adminNote;
  writePurchases(items);
  return items[index];
}
