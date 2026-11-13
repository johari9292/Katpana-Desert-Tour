import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import MobileBookingBar from "@/components/MobileBookingBar";
import PageHeader from "@/components/PageHeader";
import TrustPanel from "@/components/TrustPanel";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { absoluteUrl, breadcrumbSchema, createMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Skardu & Karakoram Travel Guides | ${BRAND_NAME}`,
  description:
    "Plan Katpana Desert, Deosai 4x4 and K2-side travel with route-focused Skardu and Karakoram guides, tour options and safety resources.",
  path: "/travel-guides",
  imageAlt: "Cold desert and Karakoram mountain routes near Skardu, Pakistan"
});

const clusters = [
  {
    title: "Skardu and high-altitude cold deserts",
    description:
      "Start with seasonal context, realistic sightseeing routes and dedicated Katpana Desert planning.",
    links: [
      ["Skardu travel guide", "/skardu-travel-guide/"],
      ["Katpana Desert destination guide", "/destinations/katpana-desert-skardu/"],
      ["Katpana Desert highlights tour", "/tours/katpana-desert-skardu-highlights-tour/"],
      ["Best time to visit Skardu", "/blog/best-time-to-visit-skardu/"]
    ]
  },
  {
    title: "Deosai logistics and 4x4 routes",
    description:
      "Compare seasonal access, route scope and the difference between standard-road and high-track transport.",
    links: [
      ["Deosai National Park guide", "/destinations/deosai-national-park/"],
      ["Deosai and Sheosar 4x4 tour", "/tours/deosai-sheosar-lake-4x4-adventure/"],
      ["Skardu jeep safari planning", "/tours/jeep-safari-skardu/"],
      ["Skardu weather by month", "/blog/skardu-weather-month-by-month/"]
    ]
  },
  {
    title: "K2, Baltoro and expedition planning",
    description:
      "Use these resources to understand trek scope, acclimatization, permits, support systems and weather buffers.",
    links: [
      ["K2 Base Camp trek guide", "/treks/k2-base-camp/"],
      ["Baltoro Glacier guide", "/treks/baltoro-glacier/"],
      ["K2 trek package planning", "/tours/k2-trek-packages/"],
      ["Pakistan trekking guide", "/pakistan-trekking-guide/"]
    ]
  },
  {
    title: "International arrival and trip logistics",
    description:
      "Prepare the route into Skardu, pack for mountain conditions and review safety and booking scope before enquiring.",
    links: [
      ["International Pakistan tour planning", "/international-pakistan-tours/"],
      ["How to reach Skardu", "/blog/how-to-reach-skardu-from-islamabad/"],
      ["Travel safety", "/travel-safety/"],
      ["Booking and quote terms", "/booking-terms/"]
    ]
  }
] as const;

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Travel guides", href: "/travel-guides/" }
];

const collectionLinks = clusters.reduce<Array<{ name: string; href: string }>>(
  (links, cluster) => [
    ...links,
    ...cluster.links.map(([name, href]) => ({ name, href }))
  ],
  []
);

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${absoluteUrl("/travel-guides")}#webpage`,
  name: "Skardu and Karakoram travel guide library",
  url: absoluteUrl("/travel-guides"),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: collectionLinks.map(({ name, href }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      url: absoluteUrl(href)
    }))
  }
};

export default function TravelGuidesPage() {
  const whatsappUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi ${BRAND_NAME}, I need help matching a Skardu or Karakoram route to my dates and group.`
  );

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(collectionSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-8 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Travel guide library</p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">
              Plan Skardu, Deosai and K2 routes by travel intent
            </h1>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              Follow a focused planning path instead of browsing disconnected posts. Each cluster connects destination
              context, route options, seasonal guidance and the next useful booking decision.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {clusters.map((cluster) => (
              <section key={cluster.title} className="rounded-2xl border border-skardu-control bg-skardu-stone/65 p-6">
                <h2 className="font-display text-3xl font-bold leading-tight text-skardu-snow">{cluster.title}</h2>
                <p className="mt-3 leading-7 text-skardu-ash">{cluster.description}</p>
                <ul className="mt-6 grid gap-3">
                  {cluster.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-skardu-control bg-skardu-void/45 px-4 py-3 font-bold text-skardu-snow transition hover:border-skardu-gold hover:text-skardu-gold"
                      >
                        <span>{label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-12">
            <TrustPanel />
          </div>
        </div>
      </section>
      <Footer />
      <MobileBookingBar whatsappUrl={whatsappUrl} context="travel_guides_hub" customizeHref="/contact/" />
    </main>
  );
}
