"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/config/site";

export function SiteBackground() {
  useEffect(() => {
    document.body.style.backgroundImage = `url('${siteConfig.bgImage}')`;
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return null;
}
