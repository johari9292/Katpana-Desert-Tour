import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SiteSearch, { type SearchEntry } from "@/components/SiteSearch";
import { reviewedArticles } from "@/data/articles";
import { destinations } from "@/data/destinations";
import { seoPages } from "@/data/seo";
import { tourPackages } from "@/data/tours";
import { staticTrendingArticles } from "@/data/trending-static";
import { canonicalPath, createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Search Travel Guides | Katpana Desert Tour",
  description:
    "Search Katpana Desert Tour itineraries, destinations, treks, and practical northern Pakistan travel guides.",
  path: "/search",
  imageAlt: "Katpana Desert dunes and Karakoram mountains near Skardu",
  index: false
});

const searchEntries = deduplicateEntries([
  ...tourPackages.map((tour) => ({
    href: canonicalPath(tour.canonicalPath ?? `/tours/${tour.slug}`),
    title: tour.title,
    summary: tour.overview,
    type: "Tour package",
    searchText: [
      tour.title,
      tour.overview,
      tour.region,
      tour.category,
      tour.bestSeason,
      ...tour.activities,
      ...tour.keywords
    ].join(" ")
  })),
  ...destinations.map((destination) => ({
    href: canonicalPath(destination.canonicalPath ?? `/destinations/${destination.slug}`),
    title: destination.name,
    summary: destination.overview,
    type: "Destination",
    searchText: [
      destination.name,
      destination.overview,
      destination.region,
      destination.type,
      destination.bestSeason,
      ...destination.activities,
      ...destination.keywords
    ].join(" ")
  })),
  ...seoPages.map((page) => ({
    href: canonicalPath(page.path),
    title: page.title,
    summary: page.excerpt,
    type: page.category === "trek" ? "Trek guide" : page.category === "blog" ? "Travel guide" : "Planning guide",
    searchText: [page.title, page.excerpt, page.primaryKeyword, ...page.keywords].join(" ")
  })),
  ...reviewedArticles.map((article) => ({
    href: canonicalPath(`/articles/${article.slug}`),
    title: article.title,
    summary: article.excerpt,
    type: article.category,
    searchText: [article.title, article.excerpt, article.location, article.primaryKeyword, ...article.keywords].join(" ")
  })),
  ...staticTrendingArticles.map((article) => ({
    href: canonicalPath(`/trending/${article.slug}`),
    title: article.title,
    summary: article.excerpt,
    type: "Verified travel update",
    searchText: [article.title, article.excerpt, article.primary_query, article.content_cluster, ...article.keywords].join(" ")
  }))
]);

export default function SearchPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Site search</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Find a tour, destination, or travel guide
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Search private tour itineraries, 4x4 routes, destination guides, and trekking advice across Skardu and the
            Karakoram.
          </p>

          <SiteSearch entries={searchEntries} />
        </div>
      </section>
      <Footer />
    </main>
  );
}

function deduplicateEntries(entries: SearchEntry[]) {
  return Array.from(new Map(entries.map((entry) => [entry.href, entry])).values());
}
