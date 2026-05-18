export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import { uploadImage } from "@/lib/storage/upload-service";

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const seriesId = formData.get("seriesId");

    if (!file || !(file instanceof File)) return jsonError("Không có file");
    if (typeof seriesId !== "string" || !seriesId) {
      return jsonError("seriesId required");
    }
    if (file.size > 8 * 1024 * 1024) {
      return jsonError("Ảnh tối đa 8MB");
    }

    const result = await uploadImage(
      file,
      "chapter-images",
      `${seriesId}/img_${Date.now()}`,
    );

    const alt = file.name.replace(/\.[^.]+$/, "");
    const markdown = `![${alt}](${result.url})`;

    return jsonOk({ url: result.url, markdown });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Upload failed");
  }
}
