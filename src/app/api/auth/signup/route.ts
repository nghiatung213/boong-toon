export const runtime = "nodejs";

import {
  signUpWithPassword,
  validateSignup,
} from "@/lib/auth/auth-service";
import { buildUserCookieValue, USER_COOKIE } from "@/lib/auth/auth-service";
import { isSupabaseEnabled } from "@/lib/config/env";
import { createNotification } from "@/lib/data/repository/notification-repository";
import { sendWelcomeEmail } from "@/lib/email/email-service";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    const error = await validateSignup({
      username: body.username ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
      confirmPassword: body.confirmPassword ?? "",
    });
    if (error) return jsonError(error);

    const { user, error: signUpError } = await signUpWithPassword({
      username: body.username!,
      email: body.email!,
      password: body.password!,
    });

    if (signUpError || !user) return jsonError(signUpError ?? "Đăng ký thất bại");

    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (e) {
      console.error("[MirAi] welcome email failed:", e);
    }

    await createNotification({
      userId: user.id,
      type: "welcome",
      title: "Chào mừng đến MirAi",
      message:
        "Đăng ký thành công. Thông báo xác minh mua truyện sẽ được gửi qua email.",
      href: "/profile",
    });

    const response = jsonOk({ user }, 201);

    if (!isSupabaseEnabled()) {
      response.cookies.set(USER_COOKIE, buildUserCookieValue(user.id), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Đăng ký thất bại");
  }
}
