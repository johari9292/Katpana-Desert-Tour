import type { Metadata } from "next";
import InformationPage from "@/components/InformationPage";
import { BRAND_NAME } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Booking Terms and Quote Transparency | ${BRAND_NAME}`,
  description: "Understand inquiries, written quotes, inclusions, payment, cancellation and route-change terms before confirming a northern Pakistan tour.",
  path: "/booking-terms",
  imageAlt: "Northern Pakistan private tour planning and written itinerary",
});

export default function BookingTermsPage() {
  return (
    <InformationPage
      eyebrow="Traveler information"
      title="Booking terms and quote transparency"
      intro="These principles explain the information that should be confirmed in your written quote. The final itinerary and payment document supplied for a specific trip forms the booking agreement and should be reviewed before payment."
      sections={[
        {
          heading: "Inquiry versus confirmed booking",
          paragraphs: [
            "Submitting a website or WhatsApp inquiry does not reserve a vehicle, room, guide, permit or departure. A booking is confirmed only when the written itinerary, availability, price, payment schedule and applicable terms have been accepted through the stated confirmation process.",
          ],
        },
        {
          heading: "What the quote should state",
          items: [
            "Traveler count, dates, route and accommodation standard.",
            "Vehicles, drivers, guides, meals, permits and transfers that are included.",
            "Flights, insurance, entry fees, personal expenses and other exclusions.",
            "Currency, payment schedule, quote-validity period and any variable local charges.",
          ],
        },
        {
          heading: "Changes, cancellations and refunds",
          paragraphs: [
            "Cancellation charges and refund conditions can depend on the hotels, transport, permits and suppliers reserved for an itinerary. Obtain the trip-specific schedule in writing before paying. If a supplier or route changes, the planning team should explain the proposed alternative and any price effect.",
          ],
        },
        {
          heading: "Weather and mountain access",
          paragraphs: [
            "Flights, roads, passes and high-altitude routes can change because of weather, maintenance, official restrictions or safety conditions. A safe alternative, delay or cancellation may be necessary. Travel insurance and realistic buffer days are strongly recommended for mountain itineraries.",
          ],
        },
      ]}
    />
  );
}
