import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import "./globals.css";

const title = `${BRAND_NAME} | Skardu, Hunza, Deosai and K2 Tour Packages`;
const description =
  "Plan Skardu, Katapana Desert, Hunza, Deosai, Khaplu, Shigar, Astore, and K2 Base Camp travel with tour packages, destination guides, hotels, cars, and WhatsApp booking.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BRAND_NAME,
  title,
  description,
  keywords: [
    "Skardu tourism",
    "Skardu travel guide",
    "Gilgit Baltistan travel guide",
    "Katapana Desert hotels",
    "hotels near Katapana Desert",
    "Skardu hotel booking",
    "Skardu rent a car",
    "rent a car in Skardu",
    "Skardu tour packages",
    "Katapana Desert Tour",
    "Hunza Skardu tour",
    "K2 Base Camp trek",
    "places to visit in Skardu",
    "Deosai National Park from Skardu",
    "Shangrila Lake Skardu",
    "Upper Kachura Lake",
    "Shigar Fort Skardu",
    "Khaplu Palace Gilgit Baltistan",
    "Skardu itinerary",
    "Skardu family tour",
    "Skardu honeymoon trip"
  ],
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "Travel",
  formatDetection: {
    telephone: true,
    address: false,
    email: false
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title,
    description:
      "Plan a Skardu trip around Katapana Desert with hotel stays, reliable cars, local drivers, and routes to the region's best attraction points.",
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/images/katpana-skardu-hero.png",
        width: 1536,
        height: 1024,
        alt: "Katapana Desert near Skardu with sand dunes, mountains, and tour vehicle"
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
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
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
