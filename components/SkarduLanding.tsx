"use client";

import dynamic from "next/dynamic";
import Nav from "./Nav";
import Marquee from "./Marquee";
import HotelBooking from "./HotelBooking";
import CarRental from "./CarRental";
import Footer from "./Footer";
import VideoShowcase from "./VideoShowcase";

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
            <VideoShowcase/>
      <HotelBooking />
      <CarRental />
      <Footer />
    </main>
  );
}
