export const paymentConfig = {
  /** QR image URL — replace with your bank QR in production */
  qrImageUrl: "/uploads/payment/QR_code_1.jpg",
  receiverName: "NGUYEN NGOC QUYNH TRANG / LABOONGDAY",
  bankName: "Vietinbank",
  accountNumber: "108800201002",
  noteTemplate: "{username} + {seriesName}",
  supportEmail: "tiemphimtruyencuaboong@gmail.com",
} as const;
