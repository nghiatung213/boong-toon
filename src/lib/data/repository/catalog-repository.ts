import "server-only";

import { isSupabaseEnabled } from "@/lib/config/env";
import type { CatalogData } from "@/lib/types/catalog";
import type { Series } from "@/lib/types/series";
import * as json from "@/lib/data/repository/json/catalog-repository";
import * as supabase from "@/lib/data/repository/supabase/catalog-repository";

export async function loadCatalog(): Promise<CatalogData> {
  return isSupabaseEnabled() ? supabase.loadCatalog() : json.loadCatalog();
}

export async function saveCatalog(data: CatalogData): Promise<CatalogData> {
  return isSupabaseEnabled() ? supabase.saveCatalog(data) : json.saveCatalog(data);
}

export async function getAllSeriesFromStore(): Promise<Series[]> {
  return isSupabaseEnabled()
    ? supabase.getAllSeriesFromStore()
    : json.getAllSeriesFromStore();
}

export async function getSeriesById(id: string): Promise<Series | undefined> {
  return isSupabaseEnabled()
    ? supabase.getSeriesById(id)
    : json.getSeriesById(id);
}

export async function getSeriesBySlugFromStore(
  slug: string,
): Promise<Series | undefined> {
  return isSupabaseEnabled()
    ? supabase.getSeriesBySlugFromStore(slug)
    : json.getSeriesBySlugFromStore(slug);
}

export async function upsertSeries(series: Series): Promise<Series> {
  return isSupabaseEnabled()
    ? supabase.upsertSeries(series)
    : json.upsertSeries(series);
}

export async function deleteSeries(id: string): Promise<boolean> {
  return isSupabaseEnabled()
    ? supabase.deleteSeries(id)
    : json.deleteSeries(id);
}

export async function getGenres(): Promise<string[]> {
  return isSupabaseEnabled() ? supabase.getGenres() : json.getGenres();
}

export async function saveGenres(genres: string[]): Promise<string[]> {
  return isSupabaseEnabled()
    ? supabase.saveGenres(genres)
    : json.saveGenres(genres);
}
