import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { tourPackages } from "@/data/tours";
import { createMetadata, faqSchema, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Pakistan and Skardu Tour Packages | ${BRAND_NAME}`,
  description: "Pakistan and Skardu tour packages 2026 for international travelers visiting K2, Deosai, Hunza, Shigar and Khaplu.",
  path: "/tours",
  imageAlt: "Pakistan and Skardu tour packages for international travelers to K2 Deosai Hunza and Karakoram",
  keywords: [
    "Katpana Desert Tour packages",
    "Pakistan tour packages",
    "Pakistan tours for international travelers",
    "Skardu tour packages",
    "Hunza Skardu tour",
    "Deosai 4x4 tour",
    "K2 Base Camp trek",
    "Gilgit Baltistan tours"
  ]
});

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

const toursFaqs = [
  {
    question: "Which Skardu tour package is best for first-time visitors?",
    answer:
      "First-time visitors usually do best with a 4 to 6 day Skardu package that includes Katpana Desert, Kachura Lakes, Shigar Valley, Satpara Lake, airport pickup, and flexible hotel timing. This keeps the route scenic without making the first trip too rushed."
  },
  {
    question: "How many days are enough for Skardu, Deosai, and Kachura?",
    answer:
      "A practical Skardu plan needs at least 5 days when Deosai National Park is included. Deosai is seasonal and road conditions can change quickly, so a buffer day helps protect flights, family comfort, and hotel plans."
  },
  {
    question: "Can K2 base camp trekking be booked from Skardu?",
    answer:
      "Yes. K2 base camp trekking starts with Skardu logistics, Askole jeep planning, guide coordination, porter systems, permits, food, camping equipment, and weather buffers. Most K2 base camp trek packages need 18 to 21 days."
  },
  {
    question: "Do Skardu tour packages include hotels and transport?",
    answer:
      "Packages can include hotel booking support, airport pickup, private cars, 4x4 jeeps for Deosai or Basho, route planning, and local driver coordination. Exact inclusions depend on group size, hotel level, season, and route difficulty."
  }
];

export default function ToursPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(itemListSchema)}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(toursFaqs))} />
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Tour packages</p>
            <h1 className="font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
              Pakistan, Skardu, Hunza, Deosai, and Karakoram tour packages
            </h1>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              Compare realistic northern Pakistan itineraries for local and international travelers with durations,
              route notes, destination overviews, highlights, inclusions, exclusions, and direct planning support from {BRAND_NAME}.
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
                    alt={tour.imageAlt ?? `${tour.title} package view in Skardu Gilgit-Baltistan Pakistan`}
                    title={tour.imageTitle ?? `${tour.title} Skardu tour package route`}
                    width={720}
                    height={420}
                    sizes="(max-width: 768px) 100vw, 33vw"
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

          <section className="mt-16 grid gap-8 border-t border-skardu-mist pt-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(280px,0.38fr)]">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">
                How to choose a Skardu tour package
              </h2>
              <div className="mt-5 grid gap-5 text-base leading-8 text-skardu-ash">
                <p>
                  A strong Skardu tour package is built around altitude, road timing, and the season instead of only a
                  list of famous places. Katpana Desert, Kachura Lakes, Shigar, and Satpara are easier routes for short
                  stays, while Deosai, Basho, Astore, and K2-side treks need more buffer time and better vehicle
                  planning.
                </p>
                <p>
                  Families usually need shorter driving days, warm hotel rooms, airport transfer support, and flexible
                  sightseeing. Adventure travelers need route checks, 4x4 availability, permit guidance, porter systems,
                  food planning, and weather days. The right package should make those tradeoffs clear before booking.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Route planning notes</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-skardu-ash">
                <li>April to October works best for most Skardu family and sightseeing routes.</li>
                <li>June to September is the safer window for Deosai National Park road access.</li>
                <li>K2 base camp and Baltoro Glacier treks need serious acclimatization and weather buffers.</li>
                <li>Private cars work for city, lake, and heritage routes; 4x4 jeeps are better for rough high tracks.</li>
              </ul>
            </div>
          </section>

          <section className="mt-14 border-t border-skardu-mist pt-12">
            <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Skardu tour package FAQs</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {toursFaqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                  <summary className="cursor-pointer font-bold text-skardu-snow">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-skardu-ash">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
