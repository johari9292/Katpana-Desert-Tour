import type { MetadataRoute } from "next";
import { BRAND_NAME } from "@/constants/brand";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${BRAND_NAME} — Skardu & Karakoram Tours`,
    short_name: "Katpana Tours",
    description: "Plan private Skardu tours, Karakoram itineraries, local 4x4 routes, and trekking logistics in northern Pakistan.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f7f2",
    theme_color: "#173e35",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }]
  };
}
