import type { Series } from "@/lib/types/series";

export interface CatalogData {
  version: 1;
  genres: string[];
  series: Series[];
}

export interface ChapterRecord {
  id: string;
  title: string;
  file: string;
  order: number;
  isLocked?: boolean;
  timestamp?: number;
}

export const EMPTY_CATALOG: CatalogData = {
  version: 1,
  genres: [],
  series: [],
};
