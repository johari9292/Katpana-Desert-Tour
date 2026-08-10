import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import WebVitalsReporter from "@/components/WebVitalsReporter";
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
      "Plan private Skardu, K2, Deosai, Hunza and Gilgit-Baltistan routes with itinerary, vehicle and accommodation coordination.",
    path: "/",
    imageAlt: "Katpana Desert Tour Skardu cold desert and Karakoram travel Pakistan"
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-skardu-void font-body text-skardu-snow`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <WebVitalsReporter />
      </body>
    </html>
  );
}
