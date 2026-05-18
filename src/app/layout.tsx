import type { Metadata, Viewport } from "next";
import { Merriweather, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.webName,
    template: `%s | ${siteConfig.webName}`,
  },
  description: siteConfig.subTitle,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-boongtoon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon-boongtoon.svg", sizes: "192x192", type: "image/svg+xml" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.webName,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: siteConfig.webName,
    title: siteConfig.webName,
    description: siteConfig.subTitle,
    images: [{ url: siteConfig.defaultCover, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.webName,
    description: siteConfig.subTitle,
    images: [siteConfig.defaultCover],
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("mirai_theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${merriweather.variable} antialiased`}
      >
        <ThemeProvider>
          <ServiceWorkerRegister />
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
