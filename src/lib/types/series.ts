export type SeriesType = "novel" | "manga";

export type SeriesStatus = "ongoing" | "completed" | "hiatus";

export interface Series {
  id: string;
  slug: string;
  title: string;
  type: SeriesType;
  synopsis: string;
  coverUrl: string;
  genres: string[];
  status: SeriesStatus;
  tagline?: string;
  isPremium?: boolean;
  /** Price in VND. 0 = free (auto-unlock). */
  price?: number;
}

export interface Chapter {
  id: string;
  seriesId: string;
  title: string;
  order: number;
  file: string;
  isLocked?: boolean;
  timestamp?: number;
}
