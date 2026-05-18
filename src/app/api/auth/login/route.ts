export const runtime = "nodejs";

import {
  signInWithPassword,
  buildUserCookieValue,
  USER_COOKIE,
} from "@/lib/auth/auth-service";
import { isSupabaseEnabled } from "@/lib/config/env";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const { user, error } = await signInWithPassword(
    body.email ?? "",
    body.password ?? "",
  );

  if (error || !user) return jsonError(error ?? "Email hoặc mật khẩu không đúng", 401);

  const response = jsonOk({ user });

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
}
