import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import MobileBookingBar from "@/components/MobileBookingBar";
import PageHeader from "@/components/PageHeader";
import TrackedLink from "@/components/TrackedLink";
import TrustPanel from "@/components/TrustPanel";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { destinations } from "@/data/destinations";
import { imageAltFor } from "@/lib/image-alt";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Gilgit-Baltistan Destinations | ${BRAND_NAME}`,
  description: "Gilgit-Baltistan destination guides for international travelers visiting Skardu, Deosai, Hunza, Khaplu and K2.",
  path: "/destinations",
  imageAlt: "Gilgit-Baltistan destinations for international Skardu Deosai Hunza and K2 travel"
});

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

const destinationFaqs = [
  {
    question: "What are the best destinations to visit in Skardu?",
    answer:
      "The strongest first-time Skardu destinations are Katpana Desert, Kachura Lakes, Shigar Valley, Satpara Lake, and Deosai National Park when the summer road is open. Longer trips can add Khaplu, Astore, Hunza, and K2 Base Camp routes."
  },
  {
    question: "Which Gilgit-Baltistan destinations are suitable for families?",
    answer:
      "Families usually prefer Skardu city, Katpana Desert, Upper Kachura Lake, Shangrila, Satpara Lake, Shigar Fort, and Khaplu Palace because they combine scenery with easier access, hotel options, and shorter sightseeing days."
  },
  {
    question: "When is Deosai National Park open from Skardu?",
    answer:
      "Deosai National Park is usually planned from June to September, but exact access depends on snow, rain, road repairs, and local conditions. Travelers should confirm the route close to departure and keep a flexible day in the itinerary."
  },
  {
    question: "Can K2 Base Camp be visited as a normal day trip?",
    answer:
      "No. K2 Base Camp is a serious multi-day trek from the Skardu and Askole side, not a normal sightseeing day trip. It requires trekking permits, guides, porters, camping systems, food planning, and acclimatization."
  }
];

export default function DestinationsPage() {
  const whatsappUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi ${BRAND_NAME}, help me choose destinations for a private Skardu and northern Pakistan itinerary.`
  );

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(destinationListSchema)}
      />
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Destinations</p>
            <h1 className="font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
              Northern Pakistan destinations for global travelers
            </h1>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              Read destination overviews for international Skardu tourism, trekking, family trips, cultural travel,
              high plateaus, and adventure routes across Gilgit-Baltistan.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                eventName="whatsapp_click"
                eventData={{ placement: "destinations_hero", context: "destination_selection" }}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-black text-skardu-void"
              >
                Ask a route planner
              </TrackedLink>
              <Link
                href="/tours/"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-skardu-teal px-6 py-3 text-sm font-black text-skardu-snow"
              >
                Compare matching tours
              </Link>
            </div>
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
                    alt={imageAltFor(destination.image)}
                    width={640}
                    height={420}
                    sizes="(max-width: 768px) 100vw, 25vw"
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

          <section className="mt-16 grid gap-8 border-t border-skardu-mist pt-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(280px,0.38fr)]">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">
                Planning Gilgit-Baltistan destinations from Skardu
              </h2>
              <div className="mt-5 grid gap-5 text-base leading-8 text-skardu-ash">
                <p>
                  Skardu works as a practical base for cold desert sunsets, lake routes, high plateaus, cultural valleys,
                  and Karakoram trekking logistics. The easiest destination days stay close to the city, while Deosai,
                  Astore, Hunza, and K2-side routes need more careful road timing and weather buffers.
                </p>
                <p>
                  Good destination planning should match the route to the traveler. Families need reliable hotels, shorter
                  drives, warm layers, and flexible meal stops. Photographers need sunrise and sunset timing. Trekkers need
                  permit guidance, acclimatization, porter systems, and realistic recovery days after long trails.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Best route groups</h2>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-skardu-ash">
                <li>Short scenic stays: Katpana Desert, Kachura Lakes, Satpara Lake, and Shigar.</li>
                <li>Cultural travel: Shigar Fort, Khaplu Palace, Ghanche Valley, and local bazaars.</li>
                <li>Adventure routes: Deosai, Basho, Astore, Rama Meadows, and jeep safari tracks.</li>
                <li>Trekking logistics: Askole, Baltoro Glacier, Concordia, and K2 Base Camp.</li>
              </ul>
            </div>
          </section>

          <section className="mt-14 border-t border-skardu-mist pt-12">
            <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Destination FAQs</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {destinationFaqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                  <summary className="cursor-pointer font-bold text-skardu-snow">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-skardu-ash">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-14">
            <TrustPanel />
          </div>
        </div>
      </section>
      <Footer />
      <MobileBookingBar whatsappUrl={whatsappUrl} context="destinations_hub" customizeHref="/contact/" />
    </main>
  );
}
