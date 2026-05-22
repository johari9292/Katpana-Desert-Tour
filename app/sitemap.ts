import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://katpanadesert.com/",
      lastModified: new Date("2026-05-22"),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
