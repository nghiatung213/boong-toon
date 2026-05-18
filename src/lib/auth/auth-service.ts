import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { env, isSupabaseEnabled } from "@/lib/config/env";
import {
  findProfileByEmail,
  findProfileByUsername,
} from "@/lib/data/repository/supabase/profile-repository";
import {
  buildUserCookieValue,
  parseUserCookie,
  USER_COOKIE,
} from "@/lib/auth/user-auth";
import * as jsonUserRepo from "@/lib/data/repository/json/user-repository";
import { toPublicUser, type PublicUser } from "@/lib/types/user";

export { USER_COOKIE, buildUserCookieValue };

export async function getSessionUser(): Promise<PublicUser | null> {
  if (!isSupabaseEnabled()) {
    const { getSessionUser: legacy } = await import("@/lib/auth/user-auth");
    return legacy();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await findProfileByEmail(user.email ?? "");
  if (profile) return profile;

  return {
    id: user.id,
    username:
      (user.user_metadata?.username as string) ??
      user.email?.split("@")[0] ??
      "reader",
    email: user.email ?? "",
    createdAt: new Date(user.created_at).getTime(),
  };
}

export async function getSessionUserFromRequest(
  request: Request,
): Promise<PublicUser | null> {
  if (!isSupabaseEnabled()) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const match = cookieHeader.match(new RegExp(`${USER_COOKIE}=([^;]+)`));
    const parsed = parseUserCookie(match?.[1]);
    if (!parsed) return null;
    const user = jsonUserRepo.findUserById(parsed.userId);
    return user ? toPublicUser(user) : null;
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  if (!cookieHeader) return null;

  const supabase = createServerClient(
    env.supabase.url,
    env.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieHeader.split(";").map((part) => {
            const [name, ...rest] = part.trim().split("=");
            return { name, value: rest.join("=") };
          });
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    (await findProfileByEmail(user.email ?? "")) ?? {
      id: user.id,
      username: (user.user_metadata?.username as string) ?? "reader",
      email: user.email ?? "",
      createdAt: Date.now(),
    }
  );
}

export async function validateSignup(input: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<string | null> {
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

  if (isSupabaseEnabled()) {
    if (await findProfileByUsername(input.username.trim())) {
      return "Username đã tồn tại";
    }
    if (await findProfileByEmail(input.email.trim().toLowerCase())) {
      return "Email đã được đăng ký";
    }
    return null;
  }

  const { validateSignup: legacy } = await import("@/lib/auth/user-auth");
  return legacy(input);
}

export async function signUpWithPassword(input: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user: PublicUser | null; error: string | null }> {
  if (!isSupabaseEnabled()) {
    const user = jsonUserRepo.createUser(input);
    return { user: toPublicUser(user), error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: { data: { username: input.username.trim() } },
  });

  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: "Đăng ký thất bại" };

  await createAdminClient().from("profiles").upsert({
    id: data.user.id,
    username: input.username.trim(),
    email: input.email.trim().toLowerCase(),
  });

  return {
    user: {
      id: data.user.id,
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      createdAt: Date.now(),
    },
    error: null,
  };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ user: PublicUser | null; error: string | null }> {
  if (!isSupabaseEnabled()) {
    const user = jsonUserRepo.verifyUserLogin(email, password);
    return {
      user: user ? toPublicUser(user) : null,
      error: user ? null : "Email hoặc mật khẩu không đúng",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.user) {
    return { user: null, error: "Email hoặc mật khẩu không đúng" };
  }

  const profile = await findProfileByEmail(data.user.email ?? email);
  return { user: profile ?? null, error: null };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseEnabled()) return;
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
}
