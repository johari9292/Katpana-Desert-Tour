import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://katpanadesert.com";
const title = "Skardu Tourism | Book Hotels & Cars via WhatsApp";
const description =
  "Plan a cinematic Skardu journey with Katpana Desert hotels, Skardu rent a car, Shangrila Lake, Upper Kachura, Deosai, Shigar Fort, and WhatsApp booking.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Katpana Desert hotels",
    "Skardu hotel booking",
    "Skardu rent a car",
    "Skardu tourism",
    "Skardu tour packages",
    "Katpana Desert tour",
    "places to visit in Skardu"
  ],
  authors: [{ name: "Katpana Desert Tours" }],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title,
    description:
      "Plan a Skardu trip around Katpana Desert with hotel stays, reliable cars, local drivers, and routes to the region's best attraction points.",
    url: siteUrl,
    siteName: "Katpana Desert Tours",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/images/katpana-skardu-hero.png",
        width: 1536,
        height: 1024,
        alt: "Katpana Desert near Skardu with sand dunes, mountains, and tour vehicle"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/katpana-skardu-hero.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-skardu-void font-body text-skardu-snow">
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
