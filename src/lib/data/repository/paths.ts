import "server-only";

import fs from "node:fs";
import path from "node:path";

/**
 * Filesystem paths for JSON fallback mode.
 * Node.js runtime only — never import from middleware or Edge code.
 *
 * Paths are pinned to subfolders under process.cwd() (the `web/` directory)
 * so Turbopack NFT tracing stays scoped to ./data and ./public/uploads.
 */
function webPath(...segments: string[]): string {
  return path.join(/* turbopackIgnore: true */ process.cwd(), ...segments);
}

export function getWebRoot(): string {
  return webPath();
}

export function getDataDir(): string {
  return webPath("data");
}

export function getCatalogPath(): string {
  return webPath("data", "catalog.json");
}

export function getChaptersPath(seriesId: string): string {
  return webPath("data", "chapters", `${seriesId}.json`);
}

export function getContentDir(): string {
  return webPath("data", "content");
}

export function getChapterContentPath(
  seriesId: string,
  chapterId: string,
): string {
  return webPath("data", "content", seriesId, `${chapterId}.md`);
}

export function getUploadsDir(): string {
  return webPath("public", "uploads", "covers");
}

export function getChapterImagesDir(seriesId: string): string {
  return webPath("public", "uploads", "chapters", seriesId);
}

export function getUsersPath(): string {
  return webPath("data", "users.json");
}

export function getPurchasesPath(): string {
  return webPath("data", "purchase-requests.json");
}

export function getEntitlementsPath(): string {
  return webPath("data", "entitlements.json");
}

export function getNotificationsPath(): string {
  return webPath("data", "notifications.json");
}

export function getEmailOutboxPath(): string {
  return webPath("data", "email-outbox.json");
}

export function getRepoRoot(): string {
  return webPath("..");
}

export function ensureDataDirs(): void {
  const dirs = [
    getDataDir(),
    webPath("data", "chapters"),
    getContentDir(),
    getUploadsDir(),
  ];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
