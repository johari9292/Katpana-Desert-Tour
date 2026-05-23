import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TourInquiryForm from "@/components/TourInquiryForm";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { commonTravelFaqs } from "@/data/seo";
import { getRelatedTours, getTourBySlug, tourPackages } from "@/data/tours";
import { absoluteUrl, breadcrumbSchema, createMetadata, faqSchema, jsonLdScript } from "@/lib/seo";

interface TourPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return tourPackages.map((tour) => ({
    slug: tour.slug
  }));
}

export function generateMetadata({ params }: TourPageProps): Metadata {
  const tour = getTourBySlug(params.slug);

  if (!tour) {
    return {
      title: `Tour Package | ${BRAND_NAME}`,
      description: "Northern Pakistan tour package."
    };
  }

  return createMetadata({
    title: tour.metaTitle ?? `${tour.primaryKeyword ?? tour.title} | ${BRAND_NAME}`,
    description: tour.metaDescription ?? `${tour.primaryKeyword ?? tour.title} package with itinerary, inclusions, local Skardu planning and route support. Book now.`,
    path: tour.canonicalPath ?? `/tours/${tour.slug}`,
    image: tour.image,
    imageAlt: tour.imageAlt ?? `${tour.title} tour package in Skardu and Gilgit-Baltistan Pakistan`,
    keywords: tour.keywords,
    type: "article"
  });
}

export default function TourPage({ params }: TourPageProps) {
  const tour = getTourBySlug(params.slug);

  if (!tour) {
    notFound();
  }

  const relatedTours = getRelatedTours(tour, 3);
  const tourUrl = `${SITE_URL}/tours/${tour.slug}/`;
  const canonicalTourUrl = absoluteUrl(tour.canonicalPath ?? `/tours/${tour.slug}`);
  const tourFaqs = tour.faqs ?? buildTourFaqs(tour);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours/" },
    { label: tour.primaryKeyword ?? tour.title, href: tour.canonicalPath ?? `/tours/${tour.slug}/` }
  ];
  const whatsappUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi! I want to book ${tour.title} with ${BRAND_NAME}. Please send pricing, hotel options, and available dates.`
  );

  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.overview,
    image: `${SITE_URL}${tour.image}`,
    url: canonicalTourUrl,
    provider: {
      "@type": "TravelAgency",
      name: BRAND_NAME,
      url: SITE_URL
    },
    offers: {
      "@type": "Offer",
      url: canonicalTourUrl,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      description: tour.priceFrom
    },
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.itinerary.map((day, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${day.day}: ${day.title}`,
        description: day.body
      }))
    },
    duration: durationToIso(tour.duration),
    availableLanguage: ["English", "Urdu"],
    touristType: [tour.category, "Adventure", "Cultural"]
  };

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(tourSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(tourFaqs))} />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{tour.category}</span>
              <span className="text-skardu-ash">{tour.duration}</span>
              <span className="text-skardu-ash">{tour.difficulty}</span>
              <span className="text-skardu-ash">Last updated: {tour.lastUpdated ?? "May 2026"}</span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{tour.title}</h1>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-skardu-ash">
              Written by {tour.author ?? "Katpana Desert Tour Local Planning Team"}
            </p>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{tour.overview}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full bg-skardu-gold px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
            >
              Check Availability
            </a>

            <div className="mt-10 overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65">
              <Image
                src={tour.image}
                alt={tour.imageAlt ?? `${tour.title} tour package in Skardu Karakoram Pakistan`}
                title={tour.imageTitle ?? `${tour.title} travel route and package view`}
                width={1536}
                height={864}
                sizes="(max-width: 768px) 100vw, 70vw"
                className="aspect-video w-full object-cover opacity-80"
              />
            </div>

            <section className="mt-12">
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Destination overview</h2>
              <p className="mt-4 text-lg leading-9 text-skardu-ash">{tour.destinationOverview}</p>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Highlights and activities</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tour.highlights.map((highlight) => (
                  <p key={highlight} className="rounded-2xl border border-skardu-mist bg-skardu-stone/70 p-5 text-sm leading-6 text-skardu-ash">
                    {highlight}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {tour.activities.map((activity) => (
                  <span key={activity} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                    {activity}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Itinerary</h2>
              <div className="mt-6 grid gap-4">
                {tour.itinerary.map((day) => (
                  <div key={`${day.day}-${day.title}`} className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">{day.day}</span>
                    <h3 className="mt-2 font-display text-3xl font-bold leading-tight text-skardu-snow">{day.title}</h3>
                    <p className="mt-3 leading-7 text-skardu-ash">{day.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                <h2 className="font-display text-3xl font-bold text-skardu-snow">Included</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-skardu-ash">
                  {tour.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                <h2 className="font-display text-3xl font-bold text-skardu-snow">Excluded</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-skardu-ash">
                  {tour.excluded.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mt-12 border-t border-skardu-mist pt-10">
              <h2 className="font-display text-4xl font-bold text-skardu-snow">Frequently asked questions</h2>
              <div className="mt-6 grid gap-4">
                {tourFaqs.map((faq) => (
                  <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                    <summary className="cursor-pointer font-bold text-skardu-snow">{faq.question}</summary>
                    <p className="mt-3 leading-7 text-skardu-ash">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Package facts</h2>
              <div className="mt-5 grid gap-3 text-sm leading-6 text-skardu-ash">
                <p><strong className="text-skardu-snow">Duration:</strong> {tour.duration}</p>
                <p><strong className="text-skardu-snow">Region:</strong> {tour.region}</p>
                <p><strong className="text-skardu-snow">Best season:</strong> {tour.bestSeason}</p>
                <p><strong className="text-skardu-snow">Pricing:</strong> {tour.priceFrom}</p>
              </div>
            </div>

            <div className="mt-5">
              <TourInquiryForm tour={tour} />
            </div>

            <div className="mt-5 rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Related tours</h2>
              <div className="mt-5 grid gap-4">
                {(tour.relatedLinks ?? []).map((related) => (
                  <Link key={related.href} href={related.href} className="block border-t border-skardu-mist pt-4 first:border-t-0 first:pt-0">
                    <span className="mt-2 block font-bold leading-snug text-skardu-snow">{related.label}</span>
                  </Link>
                ))}
                {relatedTours.map((related) => (
                  <Link key={related.slug} href={`/tours/${related.slug}/`} className="block border-t border-skardu-mist pt-4 first:border-t-0 first:pt-0">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-skardu-gold">{related.duration}</span>
                    <span className="mt-2 block font-bold leading-snug text-skardu-snow">{related.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-full bg-[#25D366] px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-white"
            >
              Request quote
            </a>
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}

function durationToIso(duration: string) {
  const matches = [...duration.matchAll(/(\d+)/g)].map((match) => Number(match[1]));
  const days = matches.length ? Math.max(...matches) : 1;
  return `P${days}D`;
}

function buildTourFaqs(tour: NonNullable<ReturnType<typeof getTourBySlug>>) {
  return [
    {
      question: `What is included in ${tour.title}?`,
      answer:
        `${tour.title} can include private driver coordination, route planning, hotel support, airport pickup guidance, and sightseeing timing based on the selected package. Exact inclusions depend on season, group size, hotel level, and vehicle type, so confirm the written list before booking.`
    },
    {
      question: `What is the best time for ${tour.title}?`,
      answer:
        `The best time for ${tour.title} is ${tour.bestSeason}. Mountain weather can still change quickly, so keep flexible timing and confirm road conditions close to departure. High routes need more caution than city, lake, and heritage routes.`
    },
    {
      question: `Is ${tour.title} suitable for families?`,
      answer:
        `${tour.title} can work for families when the daily driving hours, hotel comfort, meal stops, and altitude are planned carefully. Families should keep warm layers, snacks, water, and flexible timing in the vehicle, especially on longer Skardu and Gilgit-Baltistan routes.`
    },
    {
      question: `Do I need a 4x4 for ${tour.title}?`,
      answer:
        `A 4x4 is needed when the route includes Deosai, Basho, rough valley tracks, or expedition roadheads. Regular cars can work for Skardu city, airport transfers, Kachura, Shigar, and many lower routes. Vehicle choice should follow the road, not only the price.`
    },
    {
      question: `How do I book ${tour.title}?`,
      answer:
        `Send your dates, group size, hotel preference, arrival city, and route interests through WhatsApp. A local Skardu planning team can then match the itinerary with realistic drive times, route status, vehicle type, and seasonal conditions before confirming availability.`
    }
  ];
}
