import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TrendingArticles from "@/components/TrendingArticles";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { staticTrendingArticles } from "@/data/trending-static";
import { createMetadata, jsonLdScript } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  title: `Trending Travel Articles | ${BRAND_NAME}`,
  description: "Pakistan travel trends turned into daily Skardu and Gilgit-Baltistan articles for 2026. Read today.",
  path: "/trending",
  image: "/images/places/katapana-desert.jpg",
  imageAlt: "Pakistan travel trends for Skardu and Gilgit-Baltistan tourism",
  keywords: [
    "Pakistan travel trends",
    "Skardu trending articles",
    "Gilgit Baltistan travel news",
    "AI travel articles",
    "Katapana Desert Tour trending"
  ]
});

const trendingSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Trending Travel Articles | ${BRAND_NAME}`,
  description:
    "Daily travel articles generated from Pakistan trends and adapted for Skardu and northern Pakistan tourism.",
  url: `${SITE_URL}/trending/`,
  publisher: {
    "@type": "TravelAgency",
    name: BRAND_NAME,
    url: SITE_URL
  }
};

export default function TrendingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(trendingSchema)}
      />
      <PageHeader />
      <section className="px-4 pb-4 pt-28 sm:px-5 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">Trending articles</p>
          <h1 className="max-w-5xl font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-6xl md:text-7xl">
            Daily Pakistan trends
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-skardu-ash sm:mt-6 sm:text-lg sm:leading-8">
            Daily  travel articles connect Pakistan trend topics with Skardu, Gilgit-Baltistan, culture, seasons, road trips, and adventure planning.
          </p>
        </div>
      </section>
      <TrendingArticles />
      <section className="px-4 pb-16 sm:px-5 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-4 sm:p-6">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:text-xs sm:tracking-[0.24em]">
             Archive
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-skardu-snow sm:text-4xl">
            
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {staticTrendingArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/trending/${article.slug}/`}
                className="rounded-2xl border border-skardu-mist bg-skardu-void/45 p-4 transition hover:border-skardu-gold"
              >
                <span className="text-xs font-black uppercase tracking-[0.14em] text-skardu-gold">
                  {article.generation_date} / {article.trend_rank ? `Trend #${article.trend_rank}` : "Travel trend"}
                </span>
                <span className="mt-3 block font-display text-2xl font-bold leading-tight text-skardu-snow">{article.title}</span>
                <span className="mt-3 line-clamp-2 block text-sm leading-6 text-skardu-ash">{article.excerpt}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
