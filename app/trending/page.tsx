import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TrendingArticles from "@/components/TrendingArticles";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Trending Travel Articles | ${BRAND_NAME}`,
  description:
    "Daily AI-assisted travel articles generated from Pakistan trends and shaped into Skardu, Gilgit Baltistan, northern areas, culture, and tourism planning insights.",
  keywords: [
    "Pakistan travel trends",
    "Skardu trending articles",
    "Gilgit Baltistan travel news",
    "AI travel articles",
    "Katapana Desert Tour trending"
  ],
  alternates: {
    canonical: "/trending/"
  },
  openGraph: {
    title: `Trending Travel Articles | ${BRAND_NAME}`,
    description:
      "Daily Pakistan trend-inspired travel articles for Skardu, northern Pakistan, cultural tourism, seasons, and adventure planning.",
    url: `${SITE_URL}/trending/`,
    siteName: BRAND_NAME,
    type: "website",
    images: [
      {
        url: "/images/places/katapana-desert.jpg",
        width: 1536,
        height: 1024,
        alt: "Trending travel articles for Skardu and northern Pakistan"
      }
    ]
  }
};

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trendingSchema)
        }}
      />
      <PageHeader />
      <section className="px-5 pb-4 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Trending articles</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Daily Pakistan trends
          </h1>
         
        </div>
      </section>
      <TrendingArticles />
      <Footer />
    </main>
  );
}

