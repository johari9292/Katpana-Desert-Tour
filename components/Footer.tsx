import Link from "next/link";
import { BRAND_NAME } from "@/constants/brand";
import {
  buildWhatsAppURL,
  displayPhone2International,
  displayPhoneInternational,
  PHONE_SECONDARY,
  WHATSAPP_MAIN,
} from "@/constants/contact";
import TrackedLink from "./TrackedLink";

export default function Footer() {
  const currentYear = new Date().getUTCFullYear();
  const planningUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi! I want to plan a private northern Pakistan itinerary with ${BRAND_NAME}. Please ask me for my dates, group size and priorities.`,
  );

  return (
    <footer className="relative border-t border-skardu-mist/60 bg-gradient-to-r from-skardu-void via-skardu-stone to-skardu-void px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">Start the journey</p>
        <h2 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-5xl md:text-6xl">Ready to Plan Northern Pakistan from Anywhere?</h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedLink
            href={planningUrl}
            target="_blank"
            rel="noreferrer"
            eventName="whatsapp_click"
            eventData={{ placement: "footer", context: "custom_itinerary" }}
            className="flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-8 py-4 font-black text-skardu-void"
          >
            Book via WhatsApp
          </TrackedLink>
          <Link
            href="/contact/"
            className="flex min-h-12 items-center justify-center rounded-full border-2 border-skardu-teal px-8 py-4 font-black text-skardu-snow"
          >
            Customize itinerary
          </Link>
        </div>
        <p className="mt-6 flex flex-wrap justify-center gap-x-2 text-sm leading-6 text-skardu-ash sm:text-base">
          <span>Telephone:</span>
          <TrackedLink
            href={`tel:${WHATSAPP_MAIN}`}
            eventName="phone_click"
            eventData={{ placement: "footer", context: "primary_phone" }}
            className="font-bold text-skardu-teal underline underline-offset-4"
          >
            {displayPhoneInternational}
          </TrackedLink>
          <span aria-hidden="true">·</span>
          <TrackedLink
            href={`tel:${PHONE_SECONDARY}`}
            eventName="phone_click"
            eventData={{ placement: "footer", context: "secondary_phone" }}
            className="font-bold text-skardu-teal underline underline-offset-4"
          >
            {displayPhone2International}
          </TrackedLink>
        </p>

        <nav aria-label="Footer" className="mt-10 grid gap-8 border-t border-skardu-control pt-8 text-left sm:grid-cols-3">
          <FooterGroup
            title="Plan"
            links={[
              ["Tour packages", "/tours/"],
              ["Destinations", "/destinations/"],
              ["Travel guides", "/travel-guides/"],
              ["Contact", "/contact/"],
            ]}
          />
          <FooterGroup
            title="Trust"
            links={[
              ["About", "/about/"],
              ["Booking terms", "/booking-terms/"],
              ["Travel safety", "/travel-safety/"],
              ["Responsible travel", "/responsible-travel/"],
            ]}
          />
          <FooterGroup
            title="Legal"
            links={[
              ["Privacy", "/privacy/"],
              ["Testimonials", "/testimonials/"],
              ["Image credits", "/image-credits/"],
            ]}
          />
        </nav>

        <p className="mt-10 text-sm leading-6 text-skardu-ash">© {currentYear} {BRAND_NAME} · Skardu and northern Pakistan travel planning</p>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="inline-flex min-h-8 items-center text-sm font-bold text-skardu-ash underline-offset-4 hover:text-skardu-snow hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
