import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://katpanadesert.com";
const title = "Skardu Tourism, Katpana Desert Hotels & Rent a Car | Gilgit Baltistan Guide";
const description =
  "Plan Skardu tourism with Katpana Desert hotels, Skardu rent a car, WhatsApp booking, travel articles, Deosai, Shangrila Lake, Upper Kachura, Shigar, Khaplu, and Gilgit Baltistan guides.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Katpana Desert Tours",
  title,
  description,
  keywords: [
    "Skardu tourism",
    "Skardu travel guide",
    "Gilgit Baltistan travel guide",
    "Katpana Desert hotels",
    "hotels near Katpana Desert",
    "Skardu hotel booking",
    "Skardu rent a car",
    "rent a car in Skardu",
    "Skardu tour packages",
    "Katpana Desert tour",
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
  authors: [{ name: "Katpana Desert Tours" }],
  creator: "Katpana Desert Tours",
  publisher: "Katpana Desert Tours",
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
