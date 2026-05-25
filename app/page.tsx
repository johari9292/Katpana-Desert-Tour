import type { Metadata } from "next";
import SkarduLanding from "@/components/SkarduLanding";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { KATPANA_VIDEO_URL, SKARDU_HERO_VIDEO_URL } from "@/constants/media";
import { commonTravelFaqs, homepageAttractions, SKARDU_GEO } from "@/data/seo";
import { createMetadata, faqSchema, jsonLdScript, organizationSchema, websiteSearchSchema } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Katpana Desert Tour | Skardu Travel Experts",
  description:
    "Katpana Desert Tour plans Skardu, K2, Deosai and Gilgit-Baltistan trips in 2026. Talk to local experts.",
  path: "/",
  imageAlt: "Katpana Desert Tour Skardu cold desert and Karakoram travel Pakistan",
  keywords: ["Katpana Desert Tour", "Skardu travel guide", "Gilgit-Baltistan tourism", "K2 base camp trek"]
});

const touristDestinationSchema = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  name: "Skardu, Gilgit-Baltistan, Pakistan",
  description:
    "Skardu is a Karakoram travel base for Katpana Desert, Deosai National Park, Upper Kachura Lake, Shigar Valley, Khaplu and K2 trekking routes.",
  url: SITE_URL,
  geo: SKARDU_GEO,
  image: `${SITE_URL}/images/katpana-skardu-hero.jpg`,
  touristType: ["Adventure", "Cultural", "Eco"],
  includesAttraction: homepageAttractions.map((attraction) => ({
    "@type": "TouristAttraction",
    name: attraction.name,
    url: attraction.url,
    image: attraction.image
  }))
};

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Skardu destination travel video",
  description:
    "Skardu tourism video featuring valleys, mountains, rivers, Katpana Desert, Kachura, Deosai, Shigar, and Satpara routes.",
  thumbnailUrl: `${SITE_URL}/images/katpana-skardu-hero.jpg`,
  uploadDate: "2026-05-22",
  contentUrl: `${SITE_URL}${SKARDU_HERO_VIDEO_URL}`,
  embedUrl: "https://www.pexels.com/video/pakistan-beautiful-view-lake-and-mountain-19150354/",
  associatedMedia: {
    "@type": "VideoObject",
    name: "Katpana Desert Skardu travel video",
    description:
      "Katpana Desert travel video showing the cold desert landscape, dunes, and mountain views near Skardu.",
    thumbnailUrl: `${SITE_URL}/images/places/katapana-desert.jpg`,
    uploadDate: "2026-05-22",
    contentUrl: KATPANA_VIDEO_URL,
    embedUrl: "https://www.pexels.com/video/pakistan-katpana-desert-19150358/"
  }
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(touristDestinationSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(websiteSearchSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organizationSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(commonTravelFaqs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(videoSchema)} />
      <SkarduLanding />
    </>
  );
}
