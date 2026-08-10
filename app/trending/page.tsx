import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TrendingArticles from "@/components/TrendingArticles";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { staticTrendingArticles } from "@/data/trending-static";
import { createMetadata, jsonLdScript } from "@/lib/seo";

const hasApprovedArticles = staticTrendingArticles.length > 0;

export const metadata: Metadata = createMetadata({
  title: `Skardu Route Updates | ${BRAND_NAME}`,
  description: "Editorially reviewed Skardu, Deosai, Katpana, K2 and Karakoram travel updates with local checks, cited sources and practical trip-planning context.",
  path: "/trending",
  image: "/images/places/katapana-desert.jpg",
  imageAlt: "Katpana Cold Desert near Skardu with Karakoram mountains",
  // An empty archive is a holding page. Once reviewed articles exist, the
  // server-rendered hub becomes a substantive, indexable cluster page.
  index: hasApprovedArticles
});

const trendingSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Skardu Travel Updates | ${BRAND_NAME}`,
  description: "Editorially reviewed travel updates for Skardu, Deosai, Katpana, K2 and Karakoram routes.",
  url: `${SITE_URL}/trending/`,
  publisher: {
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL
  }
};

export default function TrendingPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      {hasApprovedArticles ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(trendingSchema)} />
      ) : null}
      <PageHeader />
      <section className="px-4 pb-4 pt-28 sm:px-5 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">
            Travel intelligence
          </p>
          <h1 className="max-w-5xl font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-6xl md:text-7xl">
            Skardu travel updates, checked before we publish
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-skardu-ash sm:mt-6 sm:text-lg sm:leading-8">
            Practical updates for high-altitude desert access, Deosai 4x4 logistics, K2 trekking, and Karakoram routes—selected for a distinct traveler question and reviewed against local evidence and cited sources.
          </p>
        </div>
      </section>
      <TrendingArticles />
      <Footer />
    </main>
  );
}
