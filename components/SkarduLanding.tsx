"use client";

import dynamic from "next/dynamic";
import Nav from "./Nav";
import Marquee from "./Marquee";
import HotelBooking from "./HotelBooking";
import CarRental from "./CarRental";
import Footer from "./Footer";
import VideoShowcase from "./VideoShowcase";
import TourPackages from "./TourPackages";
import DestinationShowcase from "./DestinationShowcase";
import AboutTour from "./AboutTour";

const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-skardu-void" aria-label="Loading Skardu hero" />
});

export default function SkarduLanding() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <Nav />
      <Hero />
      <Marquee />
      <TourPackages />
      <DestinationShowcase />
      <AboutTour />
      <HotelBooking />
      <CarRental />
      <VideoShowcase />
      <Footer />
    </main>
  );
}
