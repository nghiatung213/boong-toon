"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LibraryProvider } from "@/components/providers/LibraryProvider";
import { LibrarySyncBridge } from "@/components/providers/LibrarySyncBridge";
import { SiteBackground } from "@/components/providers/SiteBackground";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <LibraryProvider>
        <LibrarySyncBridge />
        <SiteBackground />
        <SiteHeader />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <MobileBottomNav />
      </LibraryProvider>
    </AuthProvider>
  );
}
