import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://katpanadesert.com";
const title = "Katpana Desert Hotels, Car Rentals & Skardu Tours | Skardu Tourism";
const description =
  "Book Katpana Desert hotels, Skardu rent a car services, and guided tours to Shangrila, Deosai, Upper Kachura, Shigar Fort, Manthokha Waterfall, and top Skardu attractions.";

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
      <body>{children}</body>
    </html>
  );
}
