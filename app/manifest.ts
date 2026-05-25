import type { MetadataRoute } from "next";
import { BRAND_NAME } from "@/constants/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND_NAME} - Skardu and K2 Travel`,
    short_name: "Katpana Tour",
    description: "Skardu, Gilgit-Baltistan, K2 trekking, hotel, car and tour planning by Katpana Desert Tour.",
    start_url: "/",
    display: "standalone",
    background_color: "#080C10",
    theme_color: "#C9A84C",
    icons: [
      {
        src: "/images/katpana-skardu-hero.jpg",
        sizes: "192x192",
        type: "image/jpeg"
      },
      {
        src: "/images/katpana-skardu-hero.jpg",
        sizes: "512x512",
        type: "image/jpeg"
      }
    ]
  };
}
