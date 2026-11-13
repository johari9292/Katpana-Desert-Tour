import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import MobileBookingBar from "@/components/MobileBookingBar";
import PageHeader from "@/components/PageHeader";
import QuoteTransparency from "@/components/QuoteTransparency";
import TrackedLink from "@/components/TrackedLink";
import TourInquiryForm from "@/components/TourInquiryForm";
import TrustPanel from "@/components/TrustPanel";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { getRelatedTours, getTourBySlug, tourPackages } from "@/data/tours";
import { imageAltFor } from "@/lib/image-alt";
import { absoluteUrl, breadcrumbSchema, createMetadata, jsonLdScript, organizationEntity } from "@/lib/seo";

interface TourPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return tourPackages.map((tour) => ({
    slug: tour.slug
  }));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

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
    type: "article"
  });
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const relatedTours = getRelatedTours(tour, 3);
  const canonicalTourUrl = absoluteUrl(tour.canonicalPath ?? `/tours/${tour.slug}`);
  const schemaDuration = durationToIso(tour.duration);
  const tourFaqs = tour.faqs ?? buildTourFaqs(tour);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tours", href: "/tours/" },
    { label: tour.primaryKeyword ?? tour.title, href: tour.canonicalPath ?? `/tours/${tour.slug}/` }
  ];
  const whatsappUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi! I want to plan ${tour.title} with ${BRAND_NAME}. Please send the quote basis, hotel options, inclusions, exclusions and possible dates.`
  );

  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${canonicalTourUrl}#trip`,
    name: tour.title,
    description: tour.overview,
    image: absoluteUrl(tour.image),
    url: canonicalTourUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalTourUrl
    },
    provider: organizationEntity(),
    itinerary: {
      "@type": "ItemList",
      "@id": `${canonicalTourUrl}#itinerary`,
      itemListElement: tour.itinerary.map((day, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${day.day}: ${day.title}`,
        description: day.body
      }))
    },
    ...(schemaDuration ? { duration: schemaDuration } : {}),
    touristType: tour.category
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(tourSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{tour.category}</span>
              <span className="text-skardu-ash">{tour.duration}</span>
              <span className="text-skardu-ash">{tour.difficulty}</span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{tour.title}</h1>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{tour.overview}</p>
            <TrackedLink
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              eventName="whatsapp_click"
              eventData={{ placement: "tour_hero", context: tour.slug }}
              className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
            >
              Ask via WhatsApp
            </TrackedLink>

            <div className="mt-10 overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65">
              <Image
                src={tour.image}
                alt={imageAltFor(tour.image)}
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

            <div className="mt-12">
              <QuoteTransparency />
            </div>

            <div className="mt-8">
              <TrustPanel />
            </div>

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
                <p><strong className="text-skardu-snow">Pricing:</strong> {tour.priceFrom}; itemized after dates, group, accommodation and vehicle are confirmed.</p>
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

            <TrackedLink
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              eventName="whatsapp_click"
              eventData={{ placement: "tour_sidebar", context: tour.slug }}
              className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
            >
              Request itemized quote
            </TrackedLink>
          </aside>
        </div>
      </article>
      <Footer />
      <MobileBookingBar whatsappUrl={whatsappUrl} context={tour.slug} />
    </main>
  );
}

function durationToIso(duration: string) {
  const exactDuration = duration.match(/^(\d+)\s+days?\s*\/\s*\d+\s+nights?$/i);
  return exactDuration ? `P${exactDuration[1]}D` : undefined;
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
        `Send your dates, group size, hotel preference, arrival city, and route interests through WhatsApp. The planning team can then match the itinerary with realistic drive times, route status, vehicle type, and seasonal conditions before confirming availability.`
    }
  ];
}
