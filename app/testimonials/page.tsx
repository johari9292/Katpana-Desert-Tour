import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Testimonials from "@/components/Testimonials";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { createMetadata, jsonLdScript, organizationSchema } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Skardu Travel Reviews | ${BRAND_NAME}`,
  description: "Skardu travel reviews for hotels, cars, Katpana Desert, Deosai and Kachura routes in 2026. Read now.",
  path: "/testimonials",
  imageAlt: "Skardu travel reviews for Katpana Desert Tour and Gilgit-Baltistan routes",
  keywords: [
    "Skardu travel reviews",
    "Katapana Desert tours reviews",
    "Skardu tourism testimonials",
    "Skardu rent a car reviews",
    "Skardu hotel booking reviews",
    "Gilgit Baltistan travel reviews"
  ]
});

const reviewSchema = {
  ...organizationSchema(),
  "@type": "TravelAgency",
  url: `${SITE_URL}/testimonials`
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(reviewSchema)}
      />
      <PageHeader />
      <section className="px-5 pb-4 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Traveler reviews</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Skardu travel reviews from real routes
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Read feedback from travelers booking Skardu hotels, Katapana Desert visits, car rentals, Kachura lake days,
            Deosai routes, Shigar tours, and wider Gilgit Baltistan travel plans.
          </p>
        </div>
      </section>
      <Testimonials />
      <Footer />
    </main>
  );
}
