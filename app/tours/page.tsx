import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { tourPackages } from "@/data/tours";

export const metadata: Metadata = {
  title: `Tour Packages | ${BRAND_NAME}`,
  description:
    "Browse Skardu, Katapana Desert, Deosai, Hunza, Khaplu, Shigar, Astore, and K2 Base Camp tour packages with itineraries, highlights, inclusions, and exclusions.",
  keywords: [
    "Katapana Desert Tour packages",
    "Skardu tour packages",
    "Hunza Skardu tour",
    "Deosai 4x4 tour",
    "K2 Base Camp trek",
    "Gilgit Baltistan tours"
  ],
  alternates: {
    canonical: "/tours/"
  },
  openGraph: {
    title: `Tour Packages | ${BRAND_NAME}`,
    description:
      "Production-ready northern Pakistan tour packages for Skardu, Katapana Desert, Deosai, Hunza, Khaplu, Shigar, and K2-side trekking.",
    url: `${SITE_URL}/tours/`,
    siteName: BRAND_NAME,
    type: "website",
    images: [
      {
        url: "/images/katpana-skardu-hero.png",
        width: 1536,
        height: 1024,
        alt: "Katapana Desert Tour packages in Skardu and Gilgit Baltistan"
      }
    ]
  }
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${BRAND_NAME} tour packages`,
  numberOfItems: tourPackages.length,
  itemListElement: tourPackages.map((tour, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/tours/${tour.slug}/`,
    name: tour.title,
    description: tour.overview
  }))
};

export default function ToursPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema)
        }}
      />
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Tour packages</p>
            <h1 className="font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
              Skardu, Hunza, Deosai, and Karakoram tour packages
            </h1>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              Compare realistic northern Pakistan itineraries with durations, route notes, destination overviews,
              highlights, inclusions, exclusions, and direct planning support from {BRAND_NAME}.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tourPackages.map((tour) => (
              <Link
                key={tour.slug}
                href={`/tours/${tour.slug}/`}
                className="overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65 transition hover:border-skardu-gold hover:bg-skardu-stone"
              >
                <div className="relative">
                  <Image
                    src={tour.image}
                    alt={`${tour.title} package view`}
                    width={720}
                    height={420}
                    className="aspect-video w-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-skardu-void/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-skardu-gold px-3 py-1 text-xs font-black uppercase tracking-widest text-skardu-void">
                    {tour.badge}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">
                    <span>{tour.duration}</span>
                    <span>{tour.difficulty}</span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-skardu-snow">{tour.title}</h2>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-skardu-ash">{tour.overview}</p>
                  <span className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
                    View itinerary
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
