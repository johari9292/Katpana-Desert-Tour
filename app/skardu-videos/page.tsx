import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import VideoShowcase from "@/components/VideoShowcase";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { KATPANA_VIDEO_URL, SKARDU_HERO_VIDEO_URL } from "@/constants/media";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Skardu Videos | ${BRAND_NAME}`,
  description: "Skardu videos for Katpana Desert, lakes, Deosai, hotels, cars and Gilgit-Baltistan routes in 2026. Watch.",
  path: "/skardu-videos",
  imageAlt: "Skardu videos for Katpana Desert lakes and Gilgit-Baltistan travel",
  keywords: [
    "Skardu videos",
    "Katapana Desert video",
    "Skardu tourism video",
    "Gilgit Baltistan travel video",
    "Skardu travel preview",
    "Skardu tour packages"
  ]
});

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Skardu and Katapana Desert travel videos",
  description:
    "Skardu tourism videos featuring Katapana Desert, mountain valleys, lakes, cold desert scenery, and Gilgit Baltistan travel planning.",
  thumbnailUrl: `${SITE_URL}/images/katpana-skardu-hero.jpg`,
  uploadDate: "2026-05-22",
  contentUrl: `${SITE_URL}${SKARDU_HERO_VIDEO_URL}`,
  associatedMedia: {
    "@type": "VideoObject",
    name: "Katapana Desert Skardu video",
    contentUrl: KATPANA_VIDEO_URL
  }
};

export default function SkarduVideosPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(videoSchema)}
      />
      <PageHeader />
      <section className="px-5 pb-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Skardu videos</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Katapana Desert and Gilgit Baltistan travel video guide
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Watch the Skardu scenery before booking hotels, rent a car service, airport pickup, Katapana Desert sunset
            plans, Kachura lake routes, Deosai day trips, and wider Gilgit Baltistan tours.
          </p>
        </div>
      </section>
      <VideoShowcase />
      <Footer />
    </main>
  );
}
