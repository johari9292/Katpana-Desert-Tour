import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://katpanadesert.com";

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/articles/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/skardu-videos/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "monthly",
      priority: 0.86
    },
    {
      url: `${siteUrl}/why-skardu/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "monthly",
      priority: 0.86
    },
    {
      url: `${siteUrl}/testimonials/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "monthly",
      priority: 0.76
    },
    ...articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}/`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: article.category === "Travel Guide" || article.category === "Attractions" ? 0.82 : 0.72
    }))
  ];
}
