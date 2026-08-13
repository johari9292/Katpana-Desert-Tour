import Nav from "./Nav";
import Marquee from "./Marquee";
import Footer from "./Footer";
import TourPackages from "./TourPackages";
import DestinationShowcase from "./DestinationShowcase";
import AboutTour from "./AboutTour";
import Hero from "./Hero";
import DeferredLandingSections from "./DeferredLandingSections";
import GlobalTravelSeo from "./GlobalTravelSeo";
import MobileBookingBar from "./MobileBookingBar";
import TrendingArticles from "./TrendingArticles";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";

const landingWhatsAppUrl = buildWhatsAppURL(
  WHATSAPP_MAIN,
  "Hello Katpana Desert Tour, I would like help planning a private Skardu or Karakoram itinerary."
);

export default function SkarduLanding() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative z-10 min-h-screen overflow-hidden bg-skardu-void text-skardu-snow"
    >
      <Nav />
      <Hero />
      <Marquee />
      <TourPackages />
      <DestinationShowcase />
      <AboutTour />
      <GlobalTravelSeo />
      <TrendingArticles />
      <DeferredLandingSections />
      <Footer />
      <MobileBookingBar whatsappUrl={landingWhatsAppUrl} context="homepage" customizeHref="/contact/" />
    </main>
  );
}
