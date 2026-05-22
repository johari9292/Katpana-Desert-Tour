import SkarduLanding from "@/components/SkarduLanding";
import { KATPANA_VIDEO_URL, SKARDU_HERO_VIDEO_URL } from "@/constants/media";

const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Skardu Tourism",
  url: "https://katpanadesert.com/",
  telephone: "+923430249240",
  description:
    "Premium hotel booking, rent a car, and guided Skardu tourism services focused on Katpana Desert, Shangrila, Upper Kachura, Deosai, and Shigar.",
  areaServed: ["Katpana Desert", "Skardu", "Shigar", "Deosai National Park"],
  touristType: ["Families", "Adventure travelers", "Honeymoon travelers", "International tourists"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+923430249240",
    contactType: "booking",
    availableLanguage: ["English", "Urdu"]
  },
  makesOffer: [
    { "@type": "Offer", name: "Katpana Desert hotel booking" },
    { "@type": "Offer", name: "Skardu rent a car with local driver" },
    { "@type": "Offer", name: "Skardu attraction point tours" }
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Skardu Tourism",
  alternateName: ["Katpana Desert Tours", "Katpana Desert", "katpanadesert.com"],
  url: "https://katpanadesert.com/"
};

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Skardu destination travel video",
  description: "A Skardu tourism video featuring valleys, mountains, rivers, Katpana Desert, Kachura, Deosai, Shigar, and Satpara routes.",
  thumbnailUrl: "https://katpanadesert.com/images/katpana-skardu-hero.png",
  uploadDate: "2023-12-08",
  contentUrl: `https://katpanadesert.com${SKARDU_HERO_VIDEO_URL}`,
  embedUrl: "https://www.pexels.com/video/pakistan-beautiful-view-lake-and-mountain-19150354/",
  associatedMedia: {
    "@type": "VideoObject",
    name: "Katpana Desert Skardu travel video",
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
      name: "Can I book a hotel near Katpana Desert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can request hotels, guest houses, or desert-view stays near Katpana Desert and central Skardu through the WhatsApp booking form."
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
      name: "Which Skardu attraction points are best from Katpana Desert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Popular routes include Katpana Desert, Shangrila Resort, Upper Kachura Lake, Deosai National Park, Shigar Fort, and Manthokha Waterfall."
      }
    },
    {
      "@type": "Question",
      name: "Is Katpana Desert good for families and first-time tourists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Katpana Desert is close to Skardu city and airport, so it works well for families, honeymoon trips, groups, and first-time visitors."
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
