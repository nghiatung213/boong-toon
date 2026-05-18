import { createAdminClient } from "@/lib/supabase/admin";
import type { CatalogData } from "@/lib/types/catalog";
import { EMPTY_CATALOG } from "@/lib/types/catalog";
import type { Series } from "@/lib/types/series";

function mapSeries(row: Record<string, unknown>): Series {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    type: row.type as Series["type"],
    synopsis: (row.synopsis as string) ?? "",
    coverUrl: row.cover_url as string,
    genres: (row.genres as string[]) ?? [],
    status: row.status as Series["status"],
    tagline: (row.tagline as string) || undefined,
    isPremium: Boolean(row.is_premium),
    price: (row.price as number) ?? 0,
  };
}

function mapSeriesRow(series: Series): Record<string, unknown> {
  return {
    id: series.id,
    slug: series.slug,
    title: series.title,
    type: series.type,
    synopsis: series.synopsis,
    cover_url: series.coverUrl,
    genres: series.genres,
    status: series.status,
    tagline: series.tagline ?? null,
    is_premium: series.isPremium ?? false,
    price: series.price ?? 0,
  };
}

async function fetchGenres(
  admin: ReturnType<typeof createAdminClient>,
): Promise<string[]> {
  const { data, error } = await admin
    .from("genres")
    .select("name")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((g) => g.name as string);
}

export async function loadCatalog(): Promise<CatalogData> {
  const admin = createAdminClient();
  const [{ data: seriesRows, error: seriesError }, genres] = await Promise.all([
    admin.from("series").select("*").order("title"),
    fetchGenres(admin),
  ]);
  if (seriesError) throw new Error(seriesError.message);

  return {
    ...EMPTY_CATALOG,
    genres,
    series: (seriesRows ?? []).map((row) => mapSeries(row)),
  };
}

export async function saveCatalog(data: CatalogData): Promise<CatalogData> {
  const admin = createAdminClient();
  await saveGenres(data.genres);

  for (const series of data.series) {
    const { error } = await admin.from("series").upsert(mapSeriesRow(series), {
      onConflict: "id",
    });
    if (error) throw new Error(error.message);
  }

  return loadCatalog();
}

export async function getAllSeriesFromStore(): Promise<Series[]> {
  return (await loadCatalog()).series;
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  const { data, error } = await createAdminClient()
    .from("series")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSeries(data) : undefined;
}

export async function getSeriesBySlugFromStore(
  slug: string,
): Promise<Series | undefined> {
  const normalized = decodeURIComponent(slug).trim();
  const { data, error } = await createAdminClient()
    .from("series")
    .select("*")
    .eq("slug", normalized)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSeries(data) : undefined;
}

export async function upsertSeries(series: Series): Promise<Series> {
  const { data, error } = await createAdminClient()
    .from("series")
    .upsert(mapSeriesRow(series), { onConflict: "id" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapSeries(data);
}

export async function deleteSeries(id: string): Promise<boolean> {
  const { data, error } = await createAdminClient()
    .from("series")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

export async function getGenres(): Promise<string[]> {
  return fetchGenres(createAdminClient());
}

export async function saveGenres(genres: string[]): Promise<string[]> {
  const admin = createAdminClient();
  const cleaned = [...new Set(genres.map((g) => g.trim()).filter(Boolean))].sort();

  const { data: existing, error: listError } = await admin
    .from("genres")
    .select("name");
  if (listError) throw new Error(listError.message);

  const existingNames = new Set((existing ?? []).map((g) => g.name as string));
  const targetNames = new Set(cleaned);

  const toRemove = [...existingNames].filter((n) => !targetNames.has(n));
  if (toRemove.length > 0) {
    const { error } = await admin.from("genres").delete().in("name", toRemove);
    if (error) throw new Error(error.message);
  }

  if (cleaned.length > 0) {
    const { error } = await admin
      .from("genres")
      .upsert(cleaned.map((name) => ({ name })), { onConflict: "name" });
    if (error) throw new Error(error.message);
  }

  return cleaned;
}
