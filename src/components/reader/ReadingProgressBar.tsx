"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setWidth(percent);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      id="progress-bar"
      aria-hidden
      className="fixed left-0 top-0 z-[10000] h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-[width] duration-100 linear"
      style={{ width: `${width}%` }}
    />
  );
}
