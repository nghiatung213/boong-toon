"use client";

import { useCallback, useEffect, useState } from "react";
import { readRaw, writeRaw } from "@/lib/storage/client";
import { storageKeys } from "@/lib/storage/keys";

const MIN_FONT = 0.9;
const MAX_FONT = 2;
const DEFAULT_FONT = 1.2;

export type ReaderColorMode = "default" | "light" | "dark" | "sepia";

const VALID_MODES: ReaderColorMode[] = ["default", "light", "dark", "sepia"];

export function useReaderSettings() {
  const [fontSize, setFontSizeState] = useState(DEFAULT_FONT);
  const [fontFamily, setFontFamilyState] = useState<"sans" | "serif">("sans");
  const [colorMode, setColorModeState] = useState<ReaderColorMode>("default");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedSize = readRaw(storageKeys.fontSize);
    if (storedSize) {
      const parsed = parseFloat(storedSize);
      if (!Number.isNaN(parsed)) setFontSizeState(parsed);
    }
    const storedFont = readRaw(storageKeys.fontFamily);
    if (storedFont === "serif" || storedFont === "sans") {
      setFontFamilyState(storedFont);
    }
    const storedMode = readRaw(storageKeys.readerTheme);
    if (storedMode && VALID_MODES.includes(storedMode as ReaderColorMode)) {
      setColorModeState(storedMode as ReaderColorMode);
    }
    setLoaded(true);
  }, []);

  const changeFontSize = useCallback((direction: "up" | "down") => {
    setFontSizeState((prev) => {
      const step = direction === "up" ? 0.1 : -0.1;
      const next = Math.min(MAX_FONT, Math.max(MIN_FONT, prev + step));
      writeRaw(storageKeys.fontSize, String(next));
      return next;
    });
  }, []);

  const setFontFamily = useCallback((family: "sans" | "serif") => {
    setFontFamilyState(family);
    writeRaw(storageKeys.fontFamily, family);
  }, []);

  const setColorMode = useCallback((mode: ReaderColorMode) => {
    setColorModeState(mode);
    writeRaw(storageKeys.readerTheme, mode);
  }, []);

  return {
    fontSize,
    fontFamily,
    colorMode,
    loaded,
    changeFontSize,
    setFontFamily,
    setColorMode,
  };
}
