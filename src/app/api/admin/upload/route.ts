export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import { uploadImage } from "@/lib/storage/upload-service";

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return jsonError("Không có file");
    }

    const result = await uploadImage(
      file,
      "covers",
      `cover_${Date.now()}`,
    );

    return jsonOk({ url: result.url });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Upload thất bại");
  }
}
