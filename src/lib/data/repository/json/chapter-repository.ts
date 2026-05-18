import "server-only";

import fs from "node:fs";
import type { ChapterRecord } from "@/lib/types/catalog";
import type { Chapter } from "@/lib/types/series";
import {
  ensureDataDirs,
  getChapterContentPath,
  getChaptersPath,
  getContentDir,
  getDataDir,
  getRepoRoot,
} from "@/lib/data/repository/paths";
import { seedDataIfMissing } from "@/lib/data/repository/seed";

function readChaptersFile(seriesId: string): ChapterRecord[] {
  seedDataIfMissing();
  const filePath = getChaptersPath(seriesId);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ChapterRecord[];
}

function writeChaptersFile(
  seriesId: string,
  chapters: ChapterRecord[],
): ChapterRecord[] {
  ensureDataDirs();
  const sorted = [...chapters].sort((a, b) => a.order - b.order);
  fs.writeFileSync(
    getChaptersPath(seriesId),
    JSON.stringify(sorted, null, 2),
    "utf-8",
  );
  return sorted;
}

function toChapter(seriesId: string, record: ChapterRecord): Chapter {
  return {
    id: record.id,
    seriesId,
    title: record.title,
    order: record.order,
    file: record.file,
    isLocked: record.isLocked ?? false,
    timestamp: record.timestamp,
  };
}

export function getChaptersForSeriesId(seriesId: string): Chapter[] {
  return readChaptersFile(seriesId).map((r) => toChapter(seriesId, r));
}

export function getChapterRecord(
  seriesId: string,
  chapterId: string,
): ChapterRecord | undefined {
  return readChaptersFile(seriesId).find((c) => c.id === chapterId);
}

export function upsertChapter(
  seriesId: string,
  record: ChapterRecord,
): ChapterRecord {
  const chapters = readChaptersFile(seriesId);
  const index = chapters.findIndex((c) => c.id === record.id);
  if (index >= 0) {
    chapters[index] = record;
  } else {
    chapters.push(record);
  }
  writeChaptersFile(seriesId, chapters);
  return record;
}

export function deleteChapter(seriesId: string, chapterId: string): boolean {
  const chapters = readChaptersFile(seriesId);
  const next = chapters.filter((c) => c.id !== chapterId);
  if (next.length === chapters.length) return false;
  writeChaptersFile(seriesId, next);

  const contentPath = getChapterContentPath(seriesId, chapterId);
  if (fs.existsSync(contentPath)) {
    fs.unlinkSync(contentPath);
  }
  return true;
}

export function writeChapterContent(
  seriesId: string,
  chapterId: string,
  markdown: string,
): string {
  ensureDataDirs();
  const dir = `${getContentDir()}/${seriesId}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = getChapterContentPath(seriesId, chapterId);
  fs.writeFileSync(filePath, markdown, "utf-8");
  return `content/${seriesId}/${chapterId}.md`;
}

export function readChapterContentByFile(relativeFile: string): string | null {
  const candidates = [
    `${getDataDir()}/${relativeFile}`,
    `${getRepoRoot()}/${relativeFile}`,
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  }
  return null;
}

export function deleteSeriesChapters(seriesId: string): void {
  const filePath = getChaptersPath(seriesId);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  const contentSeriesDir = `${getContentDir()}/${seriesId}`;
  if (fs.existsSync(contentSeriesDir)) {
    fs.rmSync(contentSeriesDir, { recursive: true, force: true });
  }
}
