export const storageKeys = {
  theme: "mirai_theme",
  fontSize: "mirai_user_fontSize",
  fontFamily: "mirai_user_font",
  /** Reader-only color theme (default | light | dark | sepia) */
  readerTheme: "mirai_reader_theme",
  library: "mirai_library",
  /** Per-chapter scroll (legacy + sync) */
  scroll: (seriesSlug: string, chapterId: string) =>
    `mirai_pos_${seriesSlug}_${chapterId}`,
  /** @deprecated use library.continue */
  continue: (seriesSlug: string) => `mirai_continue_${seriesSlug}`,
  /** @deprecated legacy static site bookmark index */
  legacyBookmark: "mirai_bookmark",
} as const;

export function progressKey(seriesSlug: string, chapterId: string): string {
  return `${seriesSlug}:${chapterId}`;
}
