"use client";

import dynamic from "next/dynamic";

const VideoShowcase = dynamic(() => import("./VideoShowcase"), { ssr: false });
const HotelBooking = dynamic(() => import("./HotelBooking"), { ssr: false });
const CarRental = dynamic(() => import("./CarRental"), { ssr: false });
const Testimonials = dynamic(() => import("./Testimonials"), { ssr: false });

export default function DeferredLandingSections() {
  return (
    <>
      <VideoShowcase />
      <HotelBooking />
      <CarRental />
      <Testimonials />
    </>
  );
}
