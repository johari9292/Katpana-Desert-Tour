import type { Metadata } from "next";
import InformationPage from "@/components/InformationPage";
import { BRAND_NAME } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Privacy and Inquiry Data | ${BRAND_NAME}`,
  description: "Learn how website inquiry details, WhatsApp messages and basic site-performance information are handled by Katpana Desert Tour.",
  path: "/privacy",
  imageAlt: "Katpana Desert Tour website privacy information",
});

export default function PrivacyPage() {
  return (
    <InformationPage
      eyebrow="Privacy"
      title="Privacy and inquiry data"
      intro="Share only the information needed to receive an initial itinerary. Do not send passport scans, medical records or payment-card details until a secure and appropriate process has been confirmed."
      sections={[
        {
          heading: "Website inquiry form",
          paragraphs: [
            "The current inquiry form prepares a message and opens WhatsApp so you can review it before sending. The form itself does not confirm a booking or payment. Once sent, WhatsApp and the receiving account process the message under their respective privacy practices.",
          ],
        },
        {
          heading: "Information used for planning",
          items: [
            "Name and reply details.",
            "Dates, traveler count and itinerary interests.",
            "Information voluntarily included in your message that is relevant to the requested service.",
          ],
        },
        {
          heading: "Performance and conversion measurement",
          paragraphs: [
            "The site contains first-party event hooks for aggregate actions such as WhatsApp clicks and inquiry submissions. If an analytics service is enabled, this policy and any consent controls must be updated to identify that provider, the data collected and the retention choices available to visitors.",
          ],
        },
        {
          heading: "Corrections and deletion requests",
          paragraphs: [
            "Use the published contact number to request correction or deletion of inquiry information held in the booking conversation, subject to records that must be retained for a confirmed transaction or legal requirement.",
          ],
        },
      ]}
    />
  );
}
