import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Testimonials from "@/components/Testimonials";

const siteUrl = "https://katpanadesert.com";

export const metadata: Metadata = {
  title: "Skardu Travel Reviews | Katpana Desert Tours Testimonials",
  description:
    "Read traveler reviews for Skardu hotel booking, Katpana Desert tours, Skardu rent a car, Upper Kachura, Deosai, Shigar, and Gilgit Baltistan trips.",
  keywords: [
    "Skardu travel reviews",
    "Katpana Desert tours reviews",
    "Skardu tourism testimonials",
    "Skardu rent a car reviews",
    "Skardu hotel booking reviews",
    "Gilgit Baltistan travel reviews"
  ],
  alternates: {
    canonical: "/testimonials/"
  },
  openGraph: {
    title: "Skardu Travel Reviews",
    description:
      "Traveler testimonials for Skardu tourism, Katpana Desert stays, rent a car routes, and Gilgit Baltistan tours.",
    url: `${siteUrl}/testimonials/`,
    siteName: "Katpana Desert Tours",
    type: "website",
    images: [
      {
        url: "/images/katpana-skardu-hero.png",
        width: 1536,
        height: 1024,
        alt: "Skardu travel reviews and testimonials"
      }
    ]
  }
};

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Katpana Desert Tours",
  url: `${siteUrl}/testimonials/`,
  telephone: "+923430249240",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Skardu",
    addressRegion: "Gilgit-Baltistan",
    addressCountry: "PK"
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Ayesha Khan" },
      reviewBody: "The WhatsApp booking was fast, the car arrived on time, and Katpana sunset felt unreal.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Bilal Noor" },
      reviewBody: "Skardu felt premium without losing its raw mountain soul. We booked everything from one chat.",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" }
    }
  ]
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema)
        }}
      />
      <PageHeader />
      <section className="px-5 pb-4 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Traveler reviews</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Skardu travel reviews from real routes
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Read feedback from travelers booking Skardu hotels, Katpana Desert visits, car rentals, Kachura lake days,
            Deosai routes, Shigar tours, and wider Gilgit Baltistan travel plans.
          </p>
        </div>
      </section>
      <Testimonials />
      <Footer />
    </main>
  );
}
