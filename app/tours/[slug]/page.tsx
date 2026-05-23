import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TourInquiryForm from "@/components/TourInquiryForm";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { getRelatedTours, getTourBySlug, tourPackages } from "@/data/tours";

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

  return {
    title: `${tour.title} | ${BRAND_NAME}`,
    description: tour.overview,
    keywords: tour.keywords,
    alternates: {
      canonical: `/tours/${tour.slug}/`
    },
    openGraph: {
      title: tour.title,
      description: tour.overview,
      url: `${SITE_URL}/tours/${tour.slug}/`,
      siteName: BRAND_NAME,
      type: "article",
      images: [
        {
          url: tour.image,
          width: 1536,
          height: 1024,
          alt: `${tour.title} with ${BRAND_NAME}`
        }
      ]
    }
  };
}

export default function TourPage({ params }: TourPageProps) {
  const tour = getTourBySlug(params.slug);

  if (!tour) {
    notFound();
  }

  const relatedTours = getRelatedTours(tour, 3);
  const tourUrl = `${SITE_URL}/tours/${tour.slug}/`;
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
    provider: {
      "@type": "TravelAgency",
      name: BRAND_NAME,
      url: SITE_URL
    },
    itinerary: tour.itinerary.map((day) => ({
      "@type": "ItemList",
      name: `${day.day}: ${day.title}`,
      description: day.body
    })),
    touristType: tour.category,
    url: tourUrl
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Tours", item: `${SITE_URL}/tours/` },
      { "@type": "ListItem", position: 3, name: tour.title, item: tourUrl }
    ]
  };

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tourSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <Link href="/tours/" className="text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
              Back to tours
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{tour.category}</span>
              <span className="text-skardu-ash">{tour.duration}</span>
              <span className="text-skardu-ash">{tour.difficulty}</span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{tour.title}</h1>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{tour.overview}</p>

            <div className="mt-10 overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65">
              <Image
                src={tour.image}
                alt={`${tour.title} package view`}
                width={1536}
                height={864}
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
