"use client";

import TrackedLink from "./TrackedLink";

export default function MobileBookingBar({
  whatsappUrl,
  context,
  customizeHref = "#tour-inquiry",
}: {
  whatsappUrl: string;
  context: string;
  customizeHref?: string;
}) {
  return (
    <>
      <div aria-hidden="true" className="h-24 lg:hidden" />
      <aside
        aria-label="Booking actions"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-skardu-gold/40 bg-skardu-void/95 px-3 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,.45)] backdrop-blur-lg lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <TrackedLink
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            eventName="whatsapp_click"
            eventData={{ placement: "mobile_booking_bar", context }}
            className="flex min-h-12 items-center justify-center rounded-xl bg-[#25D366] px-3 text-center text-sm font-black text-skardu-void"
          >
            Book via WhatsApp
          </TrackedLink>
          <TrackedLink
            href={customizeHref}
            eventName="customize_itinerary_click"
            eventData={{ placement: "mobile_booking_bar", context }}
            className="flex min-h-12 items-center justify-center rounded-xl border-2 border-skardu-teal px-3 text-center text-sm font-black text-skardu-snow"
          >
            Customize itinerary
          </TrackedLink>
        </div>
      </aside>
    </>
  );
}
