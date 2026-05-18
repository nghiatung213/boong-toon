export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionValue,
  isValidAdminSession,
} from "@/lib/admin/auth";
import { jsonError, jsonOk } from "@/lib/admin/api-helpers";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const password = body.password ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "mirai-studio";

  if (password !== expected) {
    return jsonError("Mật khẩu không đúng", 401);
  }

  const response = jsonOk({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = jsonOk({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  return jsonOk({ authenticated: isValidAdminSession(match?.[1]) });
}
