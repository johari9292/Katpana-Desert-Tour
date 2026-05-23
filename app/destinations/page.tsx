import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: `Destinations | ${BRAND_NAME}`,
  description:
    "Explore Skardu, Katapana Desert, Deosai, Kachura lakes, Shigar, Khaplu, Hunza, Astore, and K2 Base Camp destination guides for northern Pakistan travel.",
  keywords: [
    "Skardu destinations",
    "Katapana Desert",
    "Deosai National Park",
    "Hunza Valley",
    "K2 Base Camp",
    "Gilgit Baltistan destinations"
  ],
  alternates: {
    canonical: "/destinations/"
  },
  openGraph: {
    title: `Destinations | ${BRAND_NAME}`,
    description:
      "Destination guides for cold deserts, lakes, forts, valleys, trekking routes, and cultural tourism across northern Pakistan.",
    url: `${SITE_URL}/destinations/`,
    siteName: BRAND_NAME,
    type: "website",
    images: [
      {
        url: "/images/katpana-skardu-hero.png",
        width: 1536,
        height: 1024,
        alt: "Northern Pakistan destinations for Katapana Desert Tour"
      }
    ]
  }
};

const destinationListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${BRAND_NAME} destinations`,
  numberOfItems: destinations.length,
  itemListElement: destinations.map((destination, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/destinations/${destination.slug}/`,
    name: destination.name,
    description: destination.overview
  }))
};

export default function DestinationsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(destinationListSchema)
        }}
      />
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Destinations</p>
            <h1 className="font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
              Northern areas, deserts, mountains, lakes, and cultural valleys
            </h1>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              Read production-ready destination overviews for Skardu tourism, trekking, family trips, cultural travel,
              high plateaus, and adventure routes across Gilgit Baltistan.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {destinations.map((destination) => (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}/`}
                className="overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65 transition hover:border-skardu-gold hover:bg-skardu-stone"
              >
                <div className="relative">
                  <Image
                    src={destination.image}
                    alt={`${destination.name} destination view`}
                    width={640}
                    height={420}
                    className="aspect-[4/3] w-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-skardu-void/85 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">{destination.type}</span>
                  <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-skardu-snow">{destination.name}</h2>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-skardu-ash">{destination.overview}</p>
                  <span className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
                    Explore destination
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
