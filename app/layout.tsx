import type { Metadata } from "next";
import type { CSSProperties } from "react";
import localFont from "next/font/local";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import { createMetadata } from "@/lib/seo";
import "./globals.css";
import "./modern.css";

const bodyFont = localFont({
  src: "../public/fonts/dm-sans-latin.woff2",
  weight: "400 700",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  adjustFontFallback: false
});

const bodyExtendedFont = localFont({
  src: "../public/fonts/dm-sans-latin-ext.woff2",
  weight: "400 700",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  adjustFontFallback: false
});

const displayFont = localFont({
  src: "../public/fonts/cormorant-garamond-latin.woff2",
  weight: "500 700",
  display: "swap",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  adjustFontFallback: false
});

const displayExtendedFont = localFont({
  src: "../public/fonts/cormorant-garamond-latin-ext.woff2",
  weight: "500 700",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  adjustFontFallback: false
});

const displayCyrillicFont = localFont({
  src: "../public/fonts/cormorant-garamond-cyrillic.woff2",
  weight: "500 700",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116" }],
  adjustFontFallback: false
});

const displayCyrillicExtendedFont = localFont({
  src: "../public/fonts/cormorant-garamond-cyrillic-ext.woff2",
  weight: "500 700",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F" }],
  adjustFontFallback: false
});

const displayVietnameseFont = localFont({
  src: "../public/fonts/cormorant-garamond-vietnamese.woff2",
  weight: "500 700",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB" }],
  adjustFontFallback: false
});

// Keep subset files small while allowing the browser to select a font containing
// each glyph. Only the two primary Latin subsets are preloaded.
const fontVariables = {
  "--font-body": `${bodyFont.style.fontFamily}, ${bodyExtendedFont.style.fontFamily}, Arial, sans-serif`,
  "--font-display": `${displayFont.style.fontFamily}, ${displayExtendedFont.style.fontFamily}, ${displayCyrillicFont.style.fontFamily}, ${displayCyrillicExtendedFont.style.fontFamily}, ${displayVietnameseFont.style.fontFamily}, Georgia, serif`
} as CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...createMetadata({
    title: "Private Skardu & Northern Pakistan Tours | Katpana Desert Tour",
    description:
      "Discover Skardu, Hunza and the Karakoram with a locally planned private Pakistan tour. Explore routes, seasons and tailor your trip with Katpana Desert Tour.",
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
    <html lang="en" dir="ltr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-skardu-void font-body text-skardu-snow" style={fontVariables}>
        <a className="skip-link" href="#main-content" lang="en">
          Skip to main content
        </a>
        {children}
        <WebVitalsReporter />
      </body>
    </html>
  );
}
