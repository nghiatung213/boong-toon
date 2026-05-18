import "server-only";

import fs from "node:fs";
import type { User } from "@/lib/types/user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { ensureDataDirs, getUsersPath } from "@/lib/data/repository/paths";
import { generateId } from "@/lib/utils/slug";

function readUsers(): User[] {
  ensureDataDirs();
  const file = getUsersPath();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as User[];
}

function writeUsers(users: User[]): void {
  ensureDataDirs();
  fs.writeFileSync(getUsersPath(), JSON.stringify(users, null, 2), "utf-8");
}

export function findUserById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id);
}

export function findUserByEmail(email: string): User | undefined {
  return readUsers().find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
}

export function findUserByUsername(username: string): User | undefined {
  return readUsers().find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
  );
}

export function createUser(input: {
  username: string;
  email: string;
  password: string;
}): User {
  const users = readUsers();
  const user: User = {
    id: generateId("user"),
    username: input.username.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: hashPassword(input.password),
    createdAt: Date.now(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function verifyUserLogin(
  email: string,
  password: string,
): User | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  return verifyPassword(password, user.passwordHash) ? user : null;
}
