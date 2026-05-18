import "server-only";

import fs from "node:fs";
import type { CatalogData } from "@/lib/types/catalog";
import { EMPTY_CATALOG } from "@/lib/types/catalog";
import type { Series } from "@/lib/types/series";
import {
  ensureDataDirs,
  getCatalogPath,
} from "@/lib/data/repository/paths";
import { seedDataIfMissing } from "@/lib/data/repository/seed";

function readCatalogFile(): CatalogData {
  seedDataIfMissing();
  ensureDataDirs();

  const raw = fs.readFileSync(getCatalogPath(), "utf-8");
  const parsed = JSON.parse(raw) as CatalogData;
  return { ...EMPTY_CATALOG, ...parsed, version: 1 };
}

function writeCatalogFile(data: CatalogData): CatalogData {
  ensureDataDirs();
  fs.writeFileSync(getCatalogPath(), JSON.stringify(data, null, 2), "utf-8");
  return data;
}

export function loadCatalog(): CatalogData {
  return readCatalogFile();
}

export function saveCatalog(data: CatalogData): CatalogData {
  return writeCatalogFile({ ...data, version: 1 });
}

export function getAllSeriesFromStore(): Series[] {
  return loadCatalog().series;
}

export function getSeriesById(id: string): Series | undefined {
  return loadCatalog().series.find((s) => s.id === id);
}

export function getSeriesBySlugFromStore(slug: string): Series | undefined {
  return loadCatalog().series.find((s) => s.slug === slug);
}

export function upsertSeries(series: Series): Series {
  const catalog = loadCatalog();
  const index = catalog.series.findIndex((s) => s.id === series.id);
  if (index >= 0) {
    catalog.series[index] = series;
  } else {
    catalog.series.push(series);
  }
  saveCatalog(catalog);
  return series;
}

export function deleteSeries(id: string): boolean {
  const catalog = loadCatalog();
  const before = catalog.series.length;
  catalog.series = catalog.series.filter((s) => s.id !== id);
  if (catalog.series.length === before) return false;
  saveCatalog(catalog);
  return true;
}

export function getGenres(): string[] {
  return loadCatalog().genres;
}

export function saveGenres(genres: string[]): string[] {
  const catalog = loadCatalog();
  catalog.genres = genres;
  saveCatalog(catalog);
  return catalog.genres;
}
