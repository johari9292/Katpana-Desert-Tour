import HomePage from "@/components/HomePage";

const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Katpana Desert Tours",
  url: "https://katpanadesert.com/",
  telephone: "+923438160801",
  description:
    "Hotel booking, rent a car, and guided Skardu tourism services focused on Katpana Desert and nearby attraction points.",
  areaServed: ["Katpana Desert", "Skardu", "Shigar", "Deosai National Park"],
  touristType: ["Families", "Adventure travelers", "Honeymoon travelers", "International tourists"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+923438160801",
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
  name: "Katpana Desert Tours",
  alternateName: ["Katpana Desert", "katpanadesert.com"],
  url: "https://katpanadesert.com/"
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
      <HomePage />
    </>
  );
}
