import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import VideoShowcase from "@/components/VideoShowcase";
import { BRAND_NAME } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Skardu Videos | ${BRAND_NAME}`,
  description: "Skardu videos for Katpana Desert, lakes, Deosai and Gilgit-Baltistan route planning. Watch the landscape preview.",
  path: "/skardu-videos",
  imageAlt: "Skardu videos for Katpana Desert lakes and Gilgit-Baltistan travel"
});

export default function SkarduVideosPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <PageHeader />
      <section className="px-5 pb-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Skardu videos</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Katpana Desert and Gilgit Baltistan travel video guide
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Watch the Skardu scenery before booking hotels, rent a car service, airport pickup, Katpana Desert sunset
            plans, Kachura lake routes, Deosai day trips, and wider Gilgit Baltistan tours.
          </p>
        </div>
      </section>
      <VideoShowcase />
      <Footer />
    </main>
  );
}
