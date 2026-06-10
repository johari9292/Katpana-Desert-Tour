import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

const bodyFont = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-body"
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...createMetadata({
    title: "Katpana Desert Tour | Pakistan Tours for Global Travelers",
    description:
      "Plan Skardu, K2, Deosai, Hunza and Gilgit-Baltistan tours from anywhere in the world with local Pakistan travel experts.",
    path: "/",
    imageAlt: "Katpana Desert Tour Skardu cold desert and Karakoram travel Pakistan",
    keywords: [
      "Katpana Desert Tour",
      "Pakistan tours for international travelers",
      "Pakistan travel agency",
      "Skardu travel guide",
      "Gilgit-Baltistan tourism",
      "K2 base camp trek",
      "Pakistan mountain tourism"
    ]
  }),
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "Travel",
  formatDetection: {
    telephone: true,
    address: false,
    email: false
  },
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <style dangerouslySetInnerHTML={{ __html: ":root{color-scheme:dark}body{background:#080C10;color:#F0EDE8}" }} />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-skardu-void font-body text-skardu-snow`}>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] animate-grain"
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="grain-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain-noise)" />
          </svg>
        </div>
        {children}
      </body>
    </html>
  );
}
