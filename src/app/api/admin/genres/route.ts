export const runtime = "nodejs";

import { requireAdmin, jsonError, jsonOk } from "@/lib/admin/api-helpers";
import {
  getGenres,
  loadCatalog,
  saveCatalog,
  saveGenres,
} from "@/lib/data/repository/catalog-repository";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;
  return jsonOk({ genres: getGenres() });
}

export async function PUT(request: Request) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  const body = (await request.json()) as { genres?: string[] };
  if (!Array.isArray(body.genres)) {
    return jsonError("genres phải là mảng");
  }

  const cleaned = [
    ...new Set(
      body.genres.map((g) => g.trim()).filter((g) => g.length > 0),
    ),
  ];

  saveGenres(cleaned);

  const catalog = loadCatalog();
  catalog.series = catalog.series.map((series) => ({
    ...series,
    genres: series.genres.filter((g) => cleaned.includes(g)),
  }));
  saveCatalog(catalog);

  return jsonOk({ genres: cleaned });
}
