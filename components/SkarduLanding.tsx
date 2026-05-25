import Nav from "./Nav";
import Marquee from "./Marquee";
import Footer from "./Footer";
import TourPackages from "./TourPackages";
import DestinationShowcase from "./DestinationShowcase";
import AboutTour from "./AboutTour";
import Hero from "./Hero";
import DeferredLandingSections from "./DeferredLandingSections";

export default function SkarduLanding() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <Nav />
      <Hero />
      <Marquee />
      <TourPackages />
      <DestinationShowcase />
      <AboutTour />
      <DeferredLandingSections />
      <Footer />
    </main>
  );
}
