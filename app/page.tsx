import SkarduLanding from "@/components/SkarduLanding";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { KATPANA_VIDEO_URL, SKARDU_HERO_VIDEO_URL } from "@/constants/media";
import { destinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";

const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: BRAND_NAME,
  url: `${SITE_URL}/`,
  telephone: "+923430249240",
  description:
    "Guided Skardu, Katapana Desert, Hunza, Deosai, Shigar, Khaplu, Astore, and K2-side tour planning with hotels, private cars, 4x4 routes, and WhatsApp booking.",
  areaServed: destinations.map((destination) => destination.name),
  touristType: ["Families", "Adventure travelers", "Honeymoon travelers", "International tourists"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+923430249240",
    contactType: "booking",
    availableLanguage: ["English", "Urdu"]
  },
  makesOffer: tourPackages.map((tour) => ({ "@type": "Offer", name: tour.title }))
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND_NAME,
  alternateName: ["Katapana Desert Tour", "Katapana Desert", "Skardu tour packages"],
  url: `${SITE_URL}/`
};

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Skardu destination travel video",
  description: "A Skardu tourism video featuring valleys, mountains, rivers, Katapana Desert, Kachura, Deosai, Shigar, and Satpara routes.",
  thumbnailUrl: `${SITE_URL}/images/katpana-skardu-hero.png`,
  uploadDate: "2023-12-08",
  contentUrl: `${SITE_URL}${SKARDU_HERO_VIDEO_URL}`,
  embedUrl: "https://www.pexels.com/video/pakistan-beautiful-view-lake-and-mountain-19150354/",
  associatedMedia: {
    "@type": "VideoObject",
    name: "Katapana Desert Skardu travel video",
    contentUrl: KATPANA_VIDEO_URL,
    embedUrl: "https://www.pexels.com/video/pakistan-katpana-desert-19150358/"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I book a hotel near Katapana Desert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can request hotels, guest houses, or desert-view stays near Katapana Desert and central Skardu through the WhatsApp booking form."
      }
    },
    {
      "@type": "Question",
      name: "Do you provide rent a car in Skardu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can request airport pickup, daily car rental, 4x4 Prado, SUV, Hiace, or Coaster depending on your Skardu route."
      }
    },
    {
      "@type": "Question",
      name: "Which Skardu attraction points are best from Katapana Desert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Popular routes include Katapana Desert, Kachura Lakes, Deosai National Park, Shigar Fort, Khaplu Palace, Hunza Valley, and K2 Base Camp trekking support."
      }
    },
    {
      "@type": "Question",
      name: "Is Katapana Desert good for families and first-time tourists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Katapana Desert is close to Skardu city and airport, so it works well for families, honeymoon trips, groups, and first-time visitors."
      }
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(travelAgencySchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoSchema)
        }}
      />
      <SkarduLanding />
    </>
  );
}
