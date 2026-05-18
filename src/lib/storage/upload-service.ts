import "server-only";

import fs from "node:fs";
import path from "node:path";
import { isSupabaseEnabled } from "@/lib/config/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureDataDirs, getUploadsDir } from "@/lib/data/repository/paths";

export type UploadBucket = "covers" | "chapter-images" | "chapter-content";

const BUCKET_MAP: Record<UploadBucket, string> = {
  covers: "covers",
  "chapter-images": "chapter-images",
  "chapter-content": "chapter-content",
};

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadImage(
  file: File,
  bucket: UploadBucket,
  objectPath: string,
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Chỉ chấp nhận file ảnh");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ảnh tối đa 5MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const filename = objectPath.includes(".") ? objectPath : `${objectPath}${ext}`;

  if (isSupabaseEnabled()) {
    const admin = createAdminClient();
    const storageBucket = BUCKET_MAP[bucket];

    const { error } = await admin.storage
      .from(storageBucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw new Error(error.message);

    const { data } = admin.storage.from(storageBucket).getPublicUrl(filename);
    return { url: data.publicUrl, path: filename };
  }

  ensureDataDirs();
  const localDir =
    bucket === "covers"
      ? getUploadsDir()
      : path.join(process.cwd(), "public", "uploads", bucket);

  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }

  const dest = path.join(localDir, path.basename(filename));
  fs.writeFileSync(dest, buffer);

  const publicPath =
    bucket === "covers"
      ? `/uploads/covers/${path.basename(filename)}`
      : `/uploads/${bucket}/${path.basename(filename)}`;

  return { url: publicPath, path: publicPath };
}

export function getPublicUrl(
  bucket: UploadBucket,
  objectPath: string,
): string {
  if (isSupabaseEnabled()) {
    const { data } = createAdminClient()
      .storage.from(BUCKET_MAP[bucket])
      .getPublicUrl(objectPath);
    return data.publicUrl;
  }
  return objectPath.startsWith("/") ? objectPath : `/${objectPath}`;
}
