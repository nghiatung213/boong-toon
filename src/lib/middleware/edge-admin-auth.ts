import { ADMIN_COOKIE } from "@/lib/constants/cookies";
import { sha256Hex, timingSafeEqualString } from "@/lib/middleware/edge-crypto";

export { ADMIN_COOKIE };

export async function isValidAdminSessionEdge(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const password = process.env.ADMIN_PASSWORD ?? "mirai-studio";
  const expected = await sha256Hex(`mirai-admin:${password}`);
  return timingSafeEqualString(expected, token);
}
