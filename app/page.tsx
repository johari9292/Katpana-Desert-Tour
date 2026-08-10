import type { Metadata } from "next";
import SkarduLanding from "@/components/SkarduLanding";
import { SITE_URL } from "@/constants/brand";
import { homepageAttractions, SKARDU_GEO } from "@/data/seo";
import {
  absoluteUrl,
  createMetadata,
  jsonLdScript,
  ORGANIZATION_ID,
  organizationEntity,
  WEBSITE_ID,
  websiteEntity
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Katpana Desert Tour | Pakistan Tours for Global Travelers",
  description:
    "Plan private Skardu, K2, Deosai, Hunza and Gilgit-Baltistan routes with itinerary, vehicle and accommodation coordination.",
  path: "/",
  imageAlt: "Katpana Desert dunes beneath the Karakoram mountains near Skardu"
});

const touristDestinationSchema = {
  "@type": "TouristDestination",
  "@id": `${SITE_URL}/#skardu-destination`,
  name: "Skardu, Gilgit-Baltistan, Pakistan",
  description:
    "Skardu is a Karakoram travel base for international Pakistan tours to Katpana Desert, Deosai National Park, Upper Kachura Lake, Shigar Valley, Khaplu and K2 trekking routes.",
  url: SITE_URL,
  geo: SKARDU_GEO,
  image: `${SITE_URL}/images/katpana-skardu-hero.jpg`,
  touristType: ["Adventure travellers", "Cultural travellers", "Nature travellers"],
  includesAttraction: homepageAttractions.map((attraction) => ({
    "@type": "TouristAttraction",
    "@id": `${absoluteUrl(new URL(attraction.url).pathname)}#attraction`,
    name: attraction.name,
    url: absoluteUrl(new URL(attraction.url).pathname),
    image: attraction.image
  }))
};

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationEntity(),
    websiteEntity(),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Katpana Desert Tour | Pakistan Tours for Global Travelers",
      description:
        "Plan private Skardu, K2, Deosai, Hunza and Gilgit-Baltistan routes with itinerary, vehicle and accommodation coordination.",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": `${SITE_URL}/#skardu-destination` },
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: "en"
    },
    touristDestinationSchema
  ]
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(homepageSchema)} />
      <SkarduLanding />
    </>
  );
}
