import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { destinations, getDestinationBySlug, getRelatedDestinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";

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

  return {
    title: `${destination.name} Travel Guide | ${BRAND_NAME}`,
    description: destination.overview,
    keywords: destination.keywords,
    alternates: {
      canonical: `/destinations/${destination.slug}/`
    },
    openGraph: {
      title: `${destination.name} Travel Guide`,
      description: destination.overview,
      url: `${SITE_URL}/destinations/${destination.slug}/`,
      siteName: BRAND_NAME,
      type: "article",
      images: [
        {
          url: destination.image,
          width: 1536,
          height: 1024,
          alt: `${destination.name} destination guide with ${BRAND_NAME}`
        }
      ]
    }
  };
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
  const destinationUrl = `${SITE_URL}/destinations/${destination.slug}/`;

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.overview,
    image: `${SITE_URL}${destination.image}`,
    url: destinationUrl,
    touristType: destination.idealFor,
    includesAttraction: destination.highlights
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Destinations", item: `${SITE_URL}/destinations/` },
      { "@type": "ListItem", position: 3, name: destination.name, item: destinationUrl }
    ]
  };

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(destinationSchema)
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
            <Link href="/destinations/" className="text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
              Back to destinations
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{destination.type}</span>
              <span className="text-skardu-ash">{destination.region}</span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{destination.name}</h1>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{destination.overview}</p>

            <div className="mt-10 overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65">
              <Image
                src={destination.image}
                alt={`${destination.name} destination view`}
                width={1536}
                height={864}
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
