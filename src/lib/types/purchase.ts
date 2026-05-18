export type PurchaseStatus = "pending" | "approved" | "rejected";

export interface PurchaseRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
  transferNote: string;
  status: PurchaseStatus;
  createdAt: number;
  reviewedAt?: number;
  adminNote?: string;
}

export interface SeriesEntitlement {
  userId: string;
  seriesId: string;
  seriesSlug: string;
  approvedAt: number;
  purchaseRequestId: string;
}
