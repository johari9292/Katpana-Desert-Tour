import type { Metadata } from "next";
import InformationPage from "@/components/InformationPage";
import { BRAND_NAME } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `Responsible Travel in Gilgit-Baltistan | ${BRAND_NAME}`,
  description: "Travel responsibly in Skardu, Deosai and Gilgit-Baltistan through waste reduction, wildlife distance, cultural respect and local benefit.",
  path: "/responsible-travel",
  imageAlt: "Responsible travel landscape in Gilgit-Baltistan Pakistan",
});

export default function ResponsibleTravelPage() {
  return (
    <InformationPage
      eyebrow="Responsible travel"
      title="Protect the landscapes and communities you came to experience"
      intro="High-altitude deserts, plateaus, glaciers and villages are sensitive environments. A responsible itinerary reduces avoidable pressure and directs more travel value toward local people."
      sections={[
        {
          heading: "Leave less behind",
          items: [
            "Carry reusable water and food containers where safe and practical.",
            "Take non-biodegradable waste back to an appropriate collection point.",
            "Use established roads, camps and paths; do not drive over fragile ground for a photograph.",
          ],
        },
        {
          heading: "Respect wildlife and protected areas",
          paragraphs: [
            "Keep distance, stay quiet, never feed wildlife and follow park, guide and ranger instructions. A sighting never justifies blocking an animal, leaving a permitted route or disturbing habitat.",
          ],
        },
        {
          heading: "Respect communities",
          items: [
            "Ask before photographing people, homes, work or religious spaces.",
            "Dress and behave respectfully, particularly in villages and sacred places.",
            "Use local guides, drivers, accommodation and food providers where they fit the itinerary.",
          ],
        },
        {
          heading: "Report problems constructively",
          paragraphs: [
            "Tell the planning team about unsafe driving, littering, wildlife disturbance or disrespectful conduct. Specific feedback helps improve supplier and route decisions for future travelers.",
          ],
        },
      ]}
    />
  );
}
