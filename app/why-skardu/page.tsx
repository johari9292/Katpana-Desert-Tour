import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Stats from "@/components/Stats";

const siteUrl = "https://katpanadesert.com";

export const metadata: Metadata = {
  title: "Why Visit Skardu | Gilgit Baltistan Tourism, Hotels and Car Routes",
  description:
    "Learn why Skardu is one of Gilgit Baltistan's best tourism bases for Katpana Desert, Deosai, Shangrila Lake, Upper Kachura, Shigar Fort, hotels, and rent a car routes.",
  keywords: [
    "why visit Skardu",
    "Skardu tourism",
    "Gilgit Baltistan tourism",
    "places to visit in Skardu",
    "Skardu hotels",
    "Skardu rent a car",
    "Skardu tour planning"
  ],
  alternates: {
    canonical: "/why-skardu/"
  },
  openGraph: {
    title: "Why Visit Skardu",
    description:
      "Skardu travel reasons, route stats, hotel context, and tourism highlights for Katpana Desert and Gilgit Baltistan.",
    url: `${siteUrl}/why-skardu/`,
    siteName: "Katpana Desert Tours",
    type: "website",
    images: [
      {
        url: "/images/katpana-skardu-hero.png",
        width: 1536,
        height: 1024,
        alt: "Why visit Skardu in Gilgit Baltistan"
      }
    ]
  }
};

const destinationSchema = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  name: "Skardu, Gilgit-Baltistan",
  description:
    "Skardu is a high-altitude tourism base for Katpana Desert, Deosai National Park, Shangrila Lake, Upper Kachura, Shigar Fort, Khaplu, and mountain routes.",
  url: `${siteUrl}/why-skardu/`,
  touristType: ["Families", "Adventure travelers", "Honeymoon travelers", "Photographers"],
  includesAttraction: [
    "Katpana Desert",
    "Deosai National Park",
    "Shangrila Lake",
    "Upper Kachura Lake",
    "Shigar Fort",
    "Satpara Lake"
  ]
};

export default function WhySkarduPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(destinationSchema)
        }}
      />
      <PageHeader />
      <section className="px-5 pb-4 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Why Skardu</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Skardu is the strongest base for Gilgit Baltistan travel
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Skardu brings hotels, airport access, rent a car routes, cold desert landscapes, high plateaus, lakes,
            heritage forts, and mountain culture into one practical tourism hub.
          </p>
        </div>
      </section>
      <Stats />
      <Footer />
    </main>
  );
}
