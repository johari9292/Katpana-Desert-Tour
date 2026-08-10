import { reviewedArticles } from "@/data/articles";
import { destinations } from "@/data/destinations";
import { seoPages } from "@/data/seo";
import { tourPackages } from "@/data/tours";
import { staticTrendingArticles } from "@/data/trending-static";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

interface SitemapEntry {
  url: string;
  lastModified?: string;
  images?: string[];
}

function entry(path: string, options: { image?: string; lastModified?: string } = {}): SitemapEntry {
  const lastModified = options.lastModified ? validDate(options.lastModified) : undefined;

  return {
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
    ...(options.image ? { images: [absoluteUrl(options.image)] } : {})
  };
}

function sitemapEntries(): SitemapEntry[] {
  const entries = [
    entry("/", { image: "/images/katpana-skardu-hero.jpg" }),
    entry("/tours", { image: "/images/katpana-skardu-hero.jpg" }),
    entry("/destinations", { image: "/images/katpana-skardu-hero.jpg" }),
    ...(reviewedArticles.length ? [entry("/articles")] : []),
    entry("/travel-guides"),
    entry("/why-skardu", { image: "/images/katpana-skardu-hero.jpg" }),
    entry("/skardu-videos"),
    entry("/testimonials"),
    entry("/about"),
    entry("/contact"),
    entry("/booking-terms"),
    entry("/privacy"),
    entry("/travel-safety"),
    entry("/responsible-travel"),
    ...(staticTrendingArticles.length ? [entry("/trending")] : []),
    ...seoPages.map((page) => entry(page.path)),
    ...tourPackages.map((tour) =>
      entry(tour.canonicalPath ?? `/tours/${tour.slug}`, {
        image: tour.image
      })
    ),
    ...destinations.map((destination) =>
      entry(destination.canonicalPath ?? `/destinations/${destination.slug}`, {
        image: destination.image
      })
    ),
    ...reviewedArticles.map((article) =>
      entry(`/articles/${article.slug}`, {
        lastModified: article.reviewedAt
      })
    ),
    ...staticTrendingArticles.map((article) =>
      entry(`/trending/${article.slug}`, {
        lastModified: article.updated_at || article.published_at
      })
    )
  ];

  return Array.from(new Map(entries.map((item) => [item.url, item])).values());
}

function validDate(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(value: string) {
  return value.split("T")[0];
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
        item.lastModified ? `    <lastmod>${formatDate(item.lastModified)}</lastmod>` : undefined,
        images,
        "  </url>"
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
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
