"use client";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <Button variant="outline" type="button" disabled aria-hidden>
        🌙 Giao diện
      </Button>
    );
  }

  return (
    <Button variant="outline" type="button" onClick={toggleTheme}>
      {theme === "dark" ? "☀️ Sáng" : "🌙 Tối"}
    </Button>
  );
}
