import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TrustPanel from "@/components/TrustPanel";
import { BRAND_NAME } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `About Our Skardu Travel Planning | ${BRAND_NAME}`,
  description: "Learn how Katpana Desert Tour plans private Skardu, Deosai, Karakoram and northern Pakistan journeys with route-aware local coordination.",
  path: "/about",
  imageAlt: "Katpana Desert and Karakoram landscape near Skardu Pakistan",
});

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-skardu-void text-skardu-snow">
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about/" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,.62fr)_minmax(280px,.38fr)]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-skardu-gold">About {BRAND_NAME}</p>
              <h1 className="mt-4 font-display text-5xl font-bold leading-none sm:text-6xl md:text-7xl">
                Route-aware travel planning from Skardu
              </h1>
              <p className="mt-6 text-lg leading-8 text-skardu-ash sm:text-xl sm:leading-9">
                {BRAND_NAME} coordinates private northern Pakistan itineraries around real driving time, vehicle suitability,
                seasonal access and traveler comfort. The focus is on Skardu, Katpana, Deosai, Shigar, Khaplu, Hunza and
                Karakoram trekking logistics.
              </p>
              <div className="mt-10 grid gap-6 text-base leading-8 text-skardu-ash">
                <section>
                  <h2 className="font-display text-3xl font-bold text-skardu-snow">How planning works</h2>
                  <p className="mt-3">
                    First we collect dates, group size, arrival point and priorities. Next we match the route with suitable
                    transport and accommodation. A booking should proceed only after the itinerary, inclusions, exclusions,
                    price basis and payment terms are confirmed in writing.
                  </p>
                </section>
                <section>
                  <h2 className="font-display text-3xl font-bold text-skardu-snow">What we publish</h2>
                  <p className="mt-3">
                    Destination and trekking material is intended to support trip decisions. Seasonal access, fees, permits
                    and safety information can change, so dated route checks and official instructions take priority over an
                    older article.
                  </p>
                </section>
              </div>
              <Link href="/contact/" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-skardu-gold px-7 py-3 font-black text-skardu-void">
                Start a custom itinerary
              </Link>
            </div>
            <aside>
              <TrustPanel />
            </aside>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
