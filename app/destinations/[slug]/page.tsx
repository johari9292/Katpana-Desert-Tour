import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { commonTravelFaqs, SKARDU_GEO } from "@/data/seo";
import { destinations, getDestinationBySlug, getRelatedDestinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";
import { absoluteUrl, breadcrumbSchema, createMetadata, faqSchema, jsonLdScript } from "@/lib/seo";

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return destinations.map((destination) => ({
    slug: destination.slug
  }));
}

export function generateMetadata({ params }: DestinationPageProps): Metadata {
  const destination = getDestinationBySlug(params.slug);

  if (!destination) {
    return {
      title: `Destination | ${BRAND_NAME}`,
      description: "Northern Pakistan travel destination."
    };
  }

  return createMetadata({
    title: destination.metaTitle ?? `${destination.primaryKeyword ?? destination.name} Guide | ${BRAND_NAME}`,
    description: destination.metaDescription ?? `${destination.primaryKeyword ?? destination.name} guide with route tips, best season, activities and Skardu travel advice. Explore.`,
    path: destination.canonicalPath ?? `/destinations/${destination.slug}`,
    image: destination.image,
    imageAlt: destination.imageAlt ?? `${destination.name} destination guide in Skardu Gilgit-Baltistan Pakistan`,
    keywords: destination.keywords,
    type: "article"
  });
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const destination = getDestinationBySlug(params.slug);

  if (!destination) {
    notFound();
  }

  const relatedDestinations = getRelatedDestinations(destination, 3);
  const relatedTours = tourPackages
    .filter((tour) => tour.region.toLowerCase().includes(destination.region.toLowerCase().split(" ")[0]))
    .slice(0, 3);
  const destinationUrl = absoluteUrl(destination.canonicalPath ?? `/destinations/${destination.slug}`);
  const destinationFaqs = destination.faqs ?? buildDestinationFaqs(destination);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations/" },
    { label: destination.primaryKeyword ?? destination.name, href: destination.canonicalPath ?? `/destinations/${destination.slug}/` }
  ];

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    description: destination.overview,
    image: `${SITE_URL}${destination.image}`,
    url: destinationUrl,
    geo: SKARDU_GEO,
    address: {
      "@type": "PostalAddress",
      addressLocality: destination.region,
      addressRegion: "Gilgit-Baltistan",
      addressCountry: "PK"
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "06:00",
      closes: "18:00"
    },
    amenityFeature: destination.activities.map((activity) => ({
      "@type": "LocationFeatureSpecification",
      name: activity,
      value: true
    })),
    touristType: destination.idealFor,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destination.name}, ${destination.region}, Gilgit-Baltistan, Pakistan`)}`
  };

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(destinationSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(destinationFaqs))} />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{destination.type}</span>
              <span className="text-skardu-ash">{destination.region}</span>
              <span className="text-skardu-ash">Last updated: {destination.lastUpdated ?? "May 2026"}</span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{destination.name}</h1>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-skardu-ash">
              Written by {destination.author ?? "Katpana Desert Tour Local Planning Team"}
            </p>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{destination.overview}</p>
            <Link href="/#tours" className="mt-8 inline-flex rounded-full bg-skardu-gold px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-void">
              Book Your Skardu Adventure
            </Link>

            <div className="mt-10 overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65">
              <Image
                src={destination.image}
                alt={destination.imageAlt ?? `${destination.name} destination view in Gilgit-Baltistan Pakistan`}
                title={destination.imageTitle ?? `${destination.name} Skardu destination guide`}
                width={1536}
                height={864}
                sizes="(max-width: 768px) 100vw, 70vw"
                className="aspect-video w-full object-cover opacity-80"
              />
            </div>

            <section className="mt-12">
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Why visit {destination.name}</h2>
              <p className="mt-4 text-lg leading-9 text-skardu-ash">{destination.travelNote}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {destination.highlights.map((highlight) => (
                  <p key={highlight} className="rounded-2xl border border-skardu-mist bg-skardu-stone/70 p-5 text-sm leading-6 text-skardu-ash">
                    {highlight}
                  </p>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Activities and best season</h2>
              <p className="mt-4 text-lg leading-9 text-skardu-ash">Best season: {destination.bestSeason}.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {destination.activities.map((activity) => (
                  <span key={activity} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                    {activity}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">Ideal for</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {destination.idealFor.map((item) => (
                  <p key={item} className="rounded-2xl border border-skardu-mist bg-skardu-stone/70 p-5 text-sm font-bold uppercase tracking-[0.14em] text-skardu-ash">
                    {item}
                  </p>
                ))}
              </div>
            </section>

            <section className="mt-12 border-t border-skardu-mist pt-10">
              <h2 className="font-display text-4xl font-bold text-skardu-snow">Frequently asked questions</h2>
              <div className="mt-6 grid gap-4">
                {destinationFaqs.map((faq) => (
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
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Destination keywords</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {destination.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Related destinations</h2>
              <div className="mt-5 grid gap-4">
                {(destination.relatedLinks ?? []).map((related) => (
                  <Link key={related.href} href={related.href} className="block border-t border-skardu-mist pt-4 first:border-t-0 first:pt-0">
                    <span className="mt-2 block font-bold leading-snug text-skardu-snow">{related.label}</span>
                  </Link>
                ))}
                {relatedDestinations.map((related) => (
                  <Link key={related.slug} href={`/destinations/${related.slug}/`} className="block border-t border-skardu-mist pt-4 first:border-t-0 first:pt-0">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-skardu-gold">{related.type}</span>
                    <span className="mt-2 block font-bold leading-snug text-skardu-snow">{related.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {relatedTours.length ? (
              <div className="mt-5 rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                <h2 className="font-display text-3xl font-bold text-skardu-snow">Matching tours</h2>
                <div className="mt-5 grid gap-4">
                  {relatedTours.map((tour) => (
                    <Link key={tour.slug} href={`/tours/${tour.slug}/`} className="block border-t border-skardu-mist pt-4 first:border-t-0 first:pt-0">
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-skardu-gold">{tour.duration}</span>
                      <span className="mt-2 block font-bold leading-snug text-skardu-snow">{tour.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <Link
              href="/tours/"
              className="mt-5 block rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
            >
              See tour packages
            </Link>
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}

function buildDestinationFaqs(destination: NonNullable<ReturnType<typeof getDestinationBySlug>>) {
  return [
    {
      question: `What is ${destination.name} known for?`,
      answer:
        `${destination.name} is known for ${destination.highlights.slice(0, 3).join(", ").toLowerCase()}. It works well for ${destination.idealFor.slice(0, 3).join(", ").toLowerCase()} who want a practical Skardu or Gilgit-Baltistan route with local timing advice.`
    },
    {
      question: `What is the best time to visit ${destination.name}?`,
      answer:
        `The best time to visit ${destination.name} is ${destination.bestSeason}. Weather can still change in mountain areas, so confirm road access before departure and keep warm layers, water, and a flexible schedule in the vehicle.`
    },
    {
      question: `Can families visit ${destination.name}?`,
      answer:
        `Families can visit ${destination.name} when the route, vehicle, food stops, and daily timing match the group. Keep children close near water, cliffs, or roads, and choose private transport if you need flexible stops and shorter travel pressure.`
    },
    {
      question: `How should I plan transport for ${destination.name}?`,
      answer:
        `Use a regular car for easier city, lake, and heritage routes, but choose a jeep or strong 4x4 for rough tracks, high plateaus, and remote valley roads. A local driver helps with road updates, safe stops, and realistic return timing.`
    },
    {
      question: `Can ${destination.name} be added to a Skardu tour package?`,
      answer:
        `Yes, ${destination.name} can be added to a Skardu tour package with hotels, airport pickup, private car planning, and nearby attractions. Share your travel dates, group size, and comfort level so the route can be matched to the season.`
    }
  ];
}
