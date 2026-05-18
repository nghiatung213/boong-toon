import { readChapterContentByFile } from "@/lib/data/repository/chapter-repository";

export async function readChapterMarkdown(
  relativeFile: string,
): Promise<string | null> {
  return readChapterContentByFile(relativeFile);
}
