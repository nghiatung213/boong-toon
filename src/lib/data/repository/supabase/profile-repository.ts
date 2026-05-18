import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { PublicUser } from "@/lib/types/user";

interface ProfileRow {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

function toPublicUser(row: ProfileRow): PublicUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function findProfileById(
  id: string,
): Promise<PublicUser | undefined> {
  const { data, error } = await createAdminClient()
    .from("profiles")
    .select("id, username, email, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return undefined;
  return toPublicUser(data as ProfileRow);
}

export async function findProfileByEmail(
  email: string,
): Promise<PublicUser | undefined> {
  const { data, error } = await createAdminClient()
    .from("profiles")
    .select("id, username, email, created_at")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) return undefined;
  return toPublicUser(data as ProfileRow);
}

export async function findProfileByUsername(
  username: string,
): Promise<PublicUser | undefined> {
  const { data, error } = await createAdminClient()
    .from("profiles")
    .select("id, username, email, created_at")
    .ilike("username", username.trim())
    .maybeSingle();

  if (error || !data) return undefined;
  return toPublicUser(data as ProfileRow);
}

export async function updateProfileUsername(
  id: string,
  username: string,
): Promise<void> {
  await createAdminClient()
    .from("profiles")
    .update({ username: username.trim() })
    .eq("id", id);
}
