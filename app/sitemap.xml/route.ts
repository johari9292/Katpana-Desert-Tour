import { articles } from "@/data/articles";
import { destinations } from "@/data/destinations";
import { seoPages } from "@/data/seo";
import { tourPackages } from "@/data/tours";
import { staticTrendingArticles } from "@/data/trending-static";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  images?: string[];
};

function entry(
  path: string,
  priority: SitemapEntry["priority"],
  changeFrequency: SitemapEntry["changeFrequency"],
  image?: string,
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    lastModified: new Date("2026-06-10"),
    changeFrequency,
    priority,
    images: image ? [absoluteUrl(image)] : undefined,
  };
}

function sitemapEntries(): SitemapEntry[] {
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
        article.category === "Travel Guide" || article.category === "Attractions"
          ? 0.72
          : 0.68,
        "monthly",
        "/images/katpana-skardu-hero.jpg",
      ),
      lastModified: new Date(article.updatedAt),
    })),
    ...staticTrendingArticles.map((article) => ({
      ...entry(
        `/trending/${article.slug}`,
        0.72,
        "weekly",
        "/images/places/katapana-desert.jpg",
      ),
      lastModified: new Date(article.published_at),
    })),
  ];
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value: Date) {
  return value.toISOString().split("T")[0];
}

function sitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((item) => {
      const images = item.images
        ?.map((image) => `    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`)
        .join("\n");

      return [
        "  <url>",
        `    <loc>${escapeXml(item.url)}</loc>`,
        `    <lastmod>${formatDate(item.lastModified)}</lastmod>`,
        `    <changefreq>${item.changeFrequency}</changefreq>`,
        `    <priority>${item.priority.toFixed(2)}</priority>`,
        images,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

export function GET() {
  return new Response(sitemapXml(sitemapEntries()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
