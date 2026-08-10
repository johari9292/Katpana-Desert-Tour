import type { Metadata } from "next";
import InformationPage from "@/components/InformationPage";
import { BRAND_NAME } from "@/constants/brand";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `High-Altitude Travel Safety in Skardu | ${BRAND_NAME}`,
  description: "Plan altitude, weather, transport, insurance and route checks for Skardu, Deosai and Karakoram travel with safety before schedule.",
  path: "/travel-safety",
  imageAlt: "High-altitude route in Skardu and the Karakoram mountains",
});

export default function TravelSafetyPage() {
  return (
    <InformationPage
      eyebrow="Travel safety"
      title="Safety before schedule in the high mountains"
      intro="This page provides general planning principles, not medical or rescue advice. Travelers should obtain appropriate professional medical guidance, insurance and current official route information for their circumstances."
      sections={[
        {
          heading: "Altitude and pacing",
          items: [
            "Build gradual ascent and lighter arrival days into high-altitude itineraries.",
            "Tell the guide or driver promptly about symptoms or concerns; do not hide illness to protect the schedule.",
            "Follow qualified medical and local emergency instructions, including descent when advised.",
          ],
        },
        {
          heading: "Vehicles, roads and weather",
          paragraphs: [
            "Match the vehicle and driver to the actual road. Confirm conditions close to departure and avoid pressuring a driver to continue when weather, visibility, road damage or official restrictions make the route unsafe.",
          ],
        },
        {
          heading: "Insurance and emergency planning",
          items: [
            "Use insurance appropriate to the activity, altitude, destination and evacuation limitations.",
            "Keep emergency contacts, medication information and policy details accessible offline.",
            "For trekking, confirm communications, guide roles, evacuation planning, permits and contingency days in writing.",
          ],
        },
        {
          heading: "Traveler responsibility",
          paragraphs: [
            "Provide accurate information relevant to safe planning, carry suitable clothing and personal medication, comply with local laws and site instructions, and understand that remote services may be limited.",
          ],
        },
        {
          heading: "Official information to check",
          paragraphs: [
            "Consult your own government's current Pakistan travel advice as well as Pakistani and Gilgit-Baltistan authorities. An operator summary is not a substitute for official restrictions, permit rules or insurer requirements.",
          ],
          links: [
            { label: "Government of Gilgit-Baltistan Tourism Department", href: "https://visitgilgitbaltistan.gov.pk/" },
            { label: "Pakistan Tourism Development Corporation", href: "https://tourism.gov.pk/" },
            { label: "Pakistan Meteorological Department", href: "https://www.pmd.gov.pk/" },
            { label: "UK FCDO Pakistan travel advice", href: "https://www.gov.uk/foreign-travel-advice/pakistan" },
          ],
        },
      ]}
    />
  );
}
