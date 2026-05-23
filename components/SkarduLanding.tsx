import Nav from "./Nav";
import Marquee from "./Marquee";
import HotelBooking from "./HotelBooking";
import CarRental from "./CarRental";
import Footer from "./Footer";
import VideoShowcase from "./VideoShowcase";
import TourPackages from "./TourPackages";
import DestinationShowcase from "./DestinationShowcase";
import AboutTour from "./AboutTour";
import Testimonials from "./Testimonials";
import Hero from "./Hero";

export default function SkarduLanding() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <Nav />
      <Hero />
      <Marquee />
      <TourPackages />
      <DestinationShowcase />
      <AboutTour />
      <VideoShowcase />
      <HotelBooking />
      <CarRental />
      
      
      <Testimonials/>
      <Footer />
    </main>
  );
}
