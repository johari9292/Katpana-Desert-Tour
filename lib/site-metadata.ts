import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const siteMetadata: Metadata = {
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

