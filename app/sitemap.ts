import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/brand";
import { articles } from "@/data/articles";
import { destinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${SITE_URL}/tours/`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "weekly",
      priority: 0.94
    },
    {
      url: `${SITE_URL}/destinations/`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "weekly",
      priority: 0.92
    },
    {
      url: `${SITE_URL}/articles/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${SITE_URL}/trending/`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "daily",
      priority: 0.88
    },
    {
      url: `${SITE_URL}/skardu-videos/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "monthly",
      priority: 0.86
    },
    {
      url: `${SITE_URL}/why-skardu/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "monthly",
      priority: 0.86
    },
    {
      url: `${SITE_URL}/testimonials/`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "monthly",
      priority: 0.76
    },
    ...tourPackages.map((tour) => ({
      url: `${SITE_URL}/tours/${tour.slug}/`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly" as const,
      priority: 0.84
    })),
    ...destinations.map((destination) => ({
      url: `${SITE_URL}/destinations/${destination.slug}/`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly" as const,
      priority: 0.82
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}/`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: article.category === "Travel Guide" || article.category === "Attractions" ? 0.82 : 0.72
    }))
  ];
}
