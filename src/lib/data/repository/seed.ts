import "server-only";

import fs from "node:fs";
import type { CatalogData } from "@/lib/types/catalog";
import type { ChapterRecord } from "@/lib/types/catalog";
import rawChapters from "@/lib/data/mirai-chapters.json";
import { siteConfig } from "@/lib/config/site";
import {
  ensureDataDirs,
  getCatalogPath,
  getChaptersPath,
} from "@/lib/data/repository/paths";

const MIRAI_ID = "mirai";

export function seedDataIfMissing(): void {
  ensureDataDirs();
  const catalogPath = getCatalogPath();

  if (fs.existsSync(catalogPath)) {
    return;
  }

  const catalog: CatalogData = {
    version: 1,
    genres: ["Sci-fi", "Lãng mạn", "Tâm lý"],
    series: [
      {
        id: MIRAI_ID,
        slug: "mirai",
        title: siteConfig.webName,
        type: "novel",
        tagline: siteConfig.tagline,
        synopsis:
          "MirAi là câu chuyện lãng mạn, tâm lý trong bối cảnh khoa học viễn tưởng, xoay quanh Minh — một sinh viên tự ti và hành trình bước ra khỏi vỏ bọc vì tình yêu với Vy.",
        coverUrl: siteConfig.defaultCover,
        genres: ["Sci-fi", "Lãng mạn", "Tâm lý"],
        status: "ongoing",
        isPremium: true,
        price: 49_000,
      },
    ],
  };

  const chapters: ChapterRecord[] = (
    rawChapters as Array<{
      id: string;
      title: string;
      file: string;
      timestamp?: number;
      isLocked?: boolean;
    }>
  ).map((item, index) => ({
    id: item.id,
    title: item.title,
    file: item.file,
    order: index,
    isLocked: item.isLocked ?? false,
    timestamp: item.timestamp,
  }));

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf-8");
  fs.writeFileSync(
    getChaptersPath(MIRAI_ID),
    JSON.stringify(chapters, null, 2),
    "utf-8",
  );
}
