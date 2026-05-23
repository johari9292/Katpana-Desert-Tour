import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import VideoShowcase from "@/components/VideoShowcase";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { KATPANA_VIDEO_URL, SKARDU_HERO_VIDEO_URL } from "@/constants/media";

export const metadata: Metadata = {
  title: `Skardu Videos | ${BRAND_NAME} Travel Preview`,
  description:
    "Watch Skardu travel videos for Katapana Desert, mountains, lakes, cold desert routes, hotels, car booking, and Gilgit Baltistan tour planning.",
  keywords: [
    "Skardu videos",
    "Katapana Desert video",
    "Skardu tourism video",
    "Gilgit Baltistan travel video",
    "Skardu travel preview",
    "Skardu tour packages"
  ],
  alternates: {
    canonical: "/skardu-videos/"
  },
  openGraph: {
    title: "Skardu Videos and Katapana Desert Travel Preview",
    description:
      "Watch Skardu and Katapana Desert travel videos before planning hotels, rent a car, and Gilgit Baltistan tours.",
    url: `${SITE_URL}/skardu-videos/`,
    siteName: BRAND_NAME,
    type: "website",
    images: [
      {
        url: "/images/katpana-skardu-hero.png",
        width: 1536,
        height: 1024,
        alt: "Skardu and Katapana Desert travel video preview"
      }
    ]
  }
};

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Skardu and Katapana Desert travel videos",
  description:
    "Skardu tourism videos featuring Katapana Desert, mountain valleys, lakes, cold desert scenery, and Gilgit Baltistan travel planning.",
  thumbnailUrl: `${SITE_URL}/images/katpana-skardu-hero.png`,
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoSchema)
        }}
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
