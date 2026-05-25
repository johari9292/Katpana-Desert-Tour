import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { destinations } from "@/data/destinations";
import { seoPages } from "@/data/seo";
import { tourPackages } from "@/data/tours";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  image?: string,
) {
  return {
    url: absoluteUrl(path),
    lastModified: new Date("2026-05-23"),
    changeFrequency,
    priority,
    images: image ? [absoluteUrl(image)] : undefined,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", 1, "daily", "/images/katpana-skardu-hero.jpg"),
    entry("/tours", 0.9, "weekly", "/images/katpana-skardu-hero.jpg"),
    entry("/destinations", 0.9, "weekly", "/images/katpana-skardu-hero.jpg"),
    entry("/articles", 0.7, "monthly", "/images/katpana-skardu-hero.jpg"),
    entry("/trending", 0.82, "daily", "/images/places/katapana-desert.jpg"),
    entry("/search", 0.55, "monthly", "/images/katpana-skardu-hero.jpg"),
    ...seoPages.map((page) =>
      entry(
        page.path,
        page.category === "blog" ? 0.7 : 0.9,
        page.category === "blog" ? "monthly" : "weekly",
        page.image,
      ),
    ),
    ...tourPackages.map((tour) =>
      entry(
        tour.canonicalPath ?? `/tours/${tour.slug}`,
        0.9,
        "weekly",
        tour.image,
      ),
    ),
    ...destinations.map((destination) =>
      entry(
        destination.canonicalPath ?? `/destinations/${destination.slug}`,
        0.9,
        "weekly",
        destination.image,
      ),
    ),
    ...articles.map((article) => ({
      ...entry(
        `/articles/${article.slug}`,
        article.category === "Travel Guide" ||
          article.category === "Attractions"
          ? 0.72
          : 0.68,
        "monthly",
        "/images/katpana-skardu-hero.jpg",
      ),
      lastModified: new Date(article.updatedAt),
    })),
  ];
}
