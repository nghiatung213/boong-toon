import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidAdminSessionEdge } from "@/lib/middleware/edge-admin-auth";
import { hasValidLegacyUserSession } from "@/lib/middleware/edge-legacy-auth";
import { isSupabaseEnabledInMiddleware } from "@/lib/middleware/edge-env";
import { refreshSupabaseSession } from "@/lib/middleware/edge-supabase";

const USER_PROTECTED = ["/library", "/profile"];
const USER_AUTH_PAGES = ["/auth/login", "/auth/signup"];

function isUserProtected(pathname: string): boolean {
  return USER_PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get("mirai_admin")?.value;
    const valid = await isValidAdminSessionEdge(token);
    if (!valid) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isSupabaseEnabledInMiddleware()) {
    const { response, user } = await refreshSupabaseSession(request);

    if (isUserProtected(pathname) && !user) {
      return redirectToLogin(request, pathname);
    }

    if (user && USER_AUTH_PAGES.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.match(/^\/series\/[^/]+\/purchase$/) && !user) {
      return redirectToLogin(request, pathname);
    }

    return response;
  }

  const legacyCookie = request.cookies.get("mirai_user")?.value;
  const hasLegacySession = await hasValidLegacyUserSession(legacyCookie);

  if (isUserProtected(pathname) && !hasLegacySession) {
    return redirectToLogin(request, pathname);
  }

  if (hasLegacySession && USER_AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    pathname.match(/^\/series\/[^/]+\/purchase$/) &&
    !hasLegacySession
  ) {
    return redirectToLogin(request, pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/library/:path*",
    "/library",
    "/profile",
    "/auth/login",
    "/auth/signup",
    "/series/:slug/purchase",
  ],
};
