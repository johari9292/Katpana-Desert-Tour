import type { Metadata } from "next";
import InformationPage from "@/components/InformationPage";
import { BRAND_NAME } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Traveler Feedback Standards | ${BRAND_NAME}`,
  description: "See how Katpana Desert Tour verifies, contextualizes and publishes traveler feedback without invented ratings or anonymous marketing claims.",
  path: "/testimonials",
  imageAlt: "Traveler feedback standards for northern Pakistan tours",
});

export default function TestimonialsPage() {
  return (
    <InformationPage
      eyebrow="Traveler feedback"
      title="How traveler feedback is published"
      intro="Feedback can help travelers evaluate a route only when its source and context are clear. This page explains the publication standard used instead of presenting anonymous quotations as verified reviews."
      sections={[
        {
          heading: "Required context",
          items: [
            "Permission from the traveler to publish the supplied wording and attribution.",
            "The route or service used and an approximate travel date.",
            "Editing limited to clarity or privacy, without changing the meaning.",
            "Disclosure when an incentive was offered for feedback.",
          ],
        },
        {
          heading: "What is not presented as verified proof",
          items: [
            "Anonymous quotations without supporting booking context.",
            "Ratings copied from another website without an appropriate, visible source link.",
            "Review totals or star ratings that cannot be reconciled with their source.",
          ],
        },
        {
          heading: "Structured-data policy",
          paragraphs: [
            "Business-controlled testimonial pages are not marked up to seek self-serving LocalBusiness review stars. When genuine feedback about a specific trip is published, its visible wording and context must match any structured data exactly.",
          ],
        },
      ]}
    />
  );
}
