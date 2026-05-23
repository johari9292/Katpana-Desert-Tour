import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TrendingArticles from "@/components/TrendingArticles";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { createMetadata, jsonLdScript } from "@/lib/seo";

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
    "Daily AI-assisted travel articles generated from Pakistan trends and adapted for Skardu and northern Pakistan tourism.",
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
      <section className="px-5 pb-4 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Trending articles</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Daily Pakistan trends
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Daily AI-assisted travel articles connect Pakistan trend topics with Skardu, Gilgit-Baltistan, culture, seasons, road trips, and adventure planning.
          </p>
        </div>
      </section>
      <TrendingArticles />
      <Footer />
    </main>
  );
}
