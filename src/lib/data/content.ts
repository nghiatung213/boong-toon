import { readChapterContentByFile } from "@/lib/data/repository/chapter-repository";

export function readChapterMarkdown(relativeFile: string): string | null {
  return readChapterContentByFile(relativeFile);
}
