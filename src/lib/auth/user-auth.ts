import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { USER_COOKIE } from "@/lib/constants/cookies";
import { toPublicUser, type PublicUser, type User } from "@/lib/types/user";
import {
  findUserByEmail,
  findUserById,
  findUserByUsername,
} from "@/lib/data/repository/user-repository";

export { USER_COOKIE };
function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "mirai-auth-secret-change-me";
}

export function createUserSessionToken(userId: string): string {
  return createHash("sha256")
    .update(`mirai-user-session:${userId}:${getAuthSecret()}`)
    .digest("hex");
}

export function isValidUserSession(
  userId: string,
  token: string | undefined,
): boolean {
  if (!userId || !token) return false;
  const expected = Buffer.from(createUserSessionToken(userId));
  const received = Buffer.from(token);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export function parseUserCookie(
  value: string | undefined,
): { userId: string; token: string } | null {
  if (!value) return null;
  const [userId, token] = value.split(".");
  if (!userId || !token) return null;
  if (!isValidUserSession(userId, token)) return null;
  return { userId, token };
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(USER_COOKIE)?.value;
  const parsed = parseUserCookie(raw);
  if (!parsed) return null;
  const user = findUserById(parsed.userId);
  return user ? toPublicUser(user) : null;
}

export function getSessionUserFromRequest(
  request: Request,
): PublicUser | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${USER_COOKIE}=([^;]+)`));
  const parsed = parseUserCookie(match?.[1]);
  if (!parsed) return null;
  const user = findUserById(parsed.userId);
  return user ? toPublicUser(user) : null;
}

export function buildUserCookieValue(userId: string): string {
  return `${userId}.${createUserSessionToken(userId)}`;
}

export function validateSignup(input: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): string | null {
  if (!input.username.trim() || input.username.length < 3) {
    return "Username tối thiểu 3 ký tự";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return "Email không hợp lệ";
  }
  if (input.password.length < 6) {
    return "Mật khẩu tối thiểu 6 ký tự";
  }
  if (input.password !== input.confirmPassword) {
    return "Mật khẩu xác nhận không khớp";
  }
  if (findUserByUsername(input.username.trim())) {
    return "Username đã tồn tại";
  }
  if (findUserByEmail(input.email.trim().toLowerCase())) {
    return "Email đã được đăng ký";
  }
  return null;
}

export type { User };
