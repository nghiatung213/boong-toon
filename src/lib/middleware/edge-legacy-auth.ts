import { USER_COOKIE } from "@/lib/constants/cookies";
import { sha256Hex, timingSafeEqualString } from "@/lib/middleware/edge-crypto";

export { USER_COOKIE };

/**
 * Validates legacy mirai_user cookie without DB lookup.
 * Full user profile is loaded in API routes (Node runtime).
 */
export async function hasValidLegacyUserSession(
  cookieValue: string | undefined,
): Promise<boolean> {
  if (!cookieValue) return false;
  const [userId, token] = cookieValue.split(".");
  if (!userId || !token) return false;

  const secret = process.env.AUTH_SECRET ?? "mirai-auth-secret-change-me";
  const expected = await sha256Hex(
    `mirai-user-session:${userId}:${secret}`,
  );
  return timingSafeEqualString(expected, token);
}
