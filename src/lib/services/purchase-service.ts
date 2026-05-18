import "server-only";

import { approvePurchase, rejectPurchase } from "@/lib/data/repository/purchase-repository";
import { createNotification } from "@/lib/data/repository/notification-repository";
import { sendPurchaseApprovedEmail } from "@/lib/email/email-service";

export async function handlePurchaseApproval(requestId: string, adminNote?: string) {
  const request = await approvePurchase(requestId, adminNote);
  if (!request) return null;

  await createNotification({
    userId: request.userId,
    type: "purchase_approved",
    title: "Mua truyện thành công",
    message: `Bạn đã sở hữu "${request.seriesTitle}" — trọn bộ + chương tương lai.`,
    href: `/purchase/approved?series=${request.seriesSlug}`,
  });

  await sendPurchaseApprovedEmail({
    to: request.email,
    username: request.username,
    seriesName: request.seriesTitle,
    purchaseDate: new Date(request.createdAt),
    approvalDate: new Date(request.reviewedAt ?? Date.now()),
  });

  return request;
}

export async function handlePurchaseRejection(requestId: string, adminNote?: string) {
  const request = await rejectPurchase(requestId, adminNote);
  if (!request) return null;

  await createNotification({
    userId: request.userId,
    type: "purchase_rejected",
    title: "Xác minh thất bại",
    message:
      adminNote ??
      `Thanh toán cho "${request.seriesTitle}" chưa được chấp nhận. Liên hệ hỗ trợ nếu cần.`,
    href: `/series/${request.seriesSlug}/purchase`,
  });

  return request;
}
