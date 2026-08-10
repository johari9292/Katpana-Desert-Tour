import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TourInquiryForm from "@/components/TourInquiryForm";
import TrackedLink from "@/components/TrackedLink";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, displayPhoneInternational, WHATSAPP_MAIN } from "@/constants/contact";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Contact a Skardu Tour Planner | ${BRAND_NAME}`,
  description: "Request a private Skardu, Deosai, Hunza or Karakoram itinerary by WhatsApp and share your dates, group size and travel priorities.",
  path: "/contact",
  imageAlt: "Private northern Pakistan itinerary planning from Skardu",
});

const whatsappUrl = buildWhatsAppURL(
  WHATSAPP_MAIN,
  `Hi! I want to plan a custom northern Pakistan itinerary with ${BRAND_NAME}.`,
);

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-skardu-void text-skardu-snow">
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact/" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,.58fr)_minmax(320px,.42fr)]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-skardu-gold">Plan your journey</p>
              <h1 className="mt-4 font-display text-5xl font-bold leading-none sm:text-6xl md:text-7xl">
                Request a custom Skardu itinerary
              </h1>
              <p className="mt-6 text-lg leading-8 text-skardu-ash sm:text-xl sm:leading-9">
                Send your dates, group size and priorities. Ask for the route, accommodation level, transport, inclusions,
                exclusions, quote validity and cancellation terms in writing before confirming.
              </p>
              <div className="mt-8 rounded-2xl border border-skardu-control bg-skardu-stone/65 p-5">
                <h2 className="font-display text-3xl font-bold">Direct contact</h2>
                <p className="mt-3 text-skardu-ash">
                  WhatsApp and telephone:{" "}
                  <TrackedLink
                    href={`tel:${WHATSAPP_MAIN}`}
                    eventName="phone_click"
                    eventData={{ placement: "contact_page", context: "primary_phone" }}
                    className="font-bold text-skardu-teal underline underline-offset-4"
                  >
                    {displayPhoneInternational}
                  </TrackedLink>
                </p>
                <TrackedLink
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  eventName="whatsapp_click"
                  eventData={{ placement: "contact_page", context: "custom_itinerary" }}
                  className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#25D366] px-6 py-3 font-black text-skardu-void"
                >
                  Open WhatsApp
                </TrackedLink>
              </div>
              <p className="mt-6 text-sm leading-6 text-skardu-ash">
                An inquiry is not a confirmed reservation. Never send passport scans, medical records or payment-card details through this initial form.
              </p>
            </div>
            <TourInquiryForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
