import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/constants/cookies";

export { ADMIN_COOKIE };
function getAdminToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "mirai-studio";
  return createHash("sha256")
    .update(`mirai-admin:${password}`)
    .digest("hex");
}

export function createAdminSessionValue(): string {
  return getAdminToken();
}

export function isValidAdminSession(token: string | undefined): boolean {
  if (!token) return false;
  const expected = Buffer.from(getAdminToken());
  const received = Buffer.from(token);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}
