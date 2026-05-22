"use client";

import dynamic from "next/dynamic";
import Nav from "./Nav";
import Marquee from "./Marquee";
import HotelBooking from "./HotelBooking";
import CarRental from "./CarRental";
import Stats from "./Stats";
import Footer from "./Footer";

const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-skardu-void" aria-label="Loading Skardu hero" />
});

const Testimonials = dynamic(() => import("./Testimonials"), {
  ssr: false,
  loading: () => <div className="h-96 bg-skardu-void" aria-label="Loading traveler testimonials" />
});

export default function SkarduLanding() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <Nav />
      <Hero />
      <Marquee />
      <HotelBooking />
      <CarRental />
      <Stats />
      <Testimonials />
      <Footer />
    </main>
  );
}
