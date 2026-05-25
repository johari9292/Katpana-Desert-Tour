"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    quote: "The WhatsApp booking was fast, the TZ arrived on time, and Katapana sunset felt unreal.",
    name: "Ayesha Khan",
    place: "Lahore",
  },
  {
    quote: "Upper Kachura and Deosai were handled perfectly. The driver knew every photo stop.",
    name: "Sarah Ahmed",
    place: "Lahore",
  },
  {
    quote: "Skardu felt premium without losing its raw mountain soul. We booked everything from one chat.",
    name: "Bilal Noor",
    place: "Islamabad",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <AnimatedSection id="testimonials" className="relative overflow-hidden px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">Traveler voices</p>
            <h2 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-5xl md:text-6xl">
              Stories from the roof of the world
            </h2>
          </div>
          <div className="flex gap-3 sm:gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show testimonial ${index + 1}`}
                className="relative size-4 rounded-full bg-skardu-mist sm:size-3"
              >
                {active === index ? <motion.span layoutId="testimonial-dot" className="absolute inset-0 rounded-full bg-skardu-gold" /> : null}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: -620, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 320, bounceDamping: 44 }}
          className="flex cursor-grab gap-4 active:cursor-grabbing sm:gap-5"
        >
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              onViewportEnter={() => setActive(index)}
              whileHover={{ y: -4 }}
              className="glass-panel min-w-[86vw] rounded-2xl p-5 sm:min-w-[420px] sm:p-6"
            >
              <div className="mb-5 flex gap-1 text-skardu-gold" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} />
                ))}
              </div>
              <p className="font-display text-2xl italic leading-tight text-skardu-snow sm:text-3xl">"{item.quote}"</p>
              <div className="mt-7">
                <strong className="block text-skardu-snow">{item.name}</strong>
                <span className="text-sm text-skardu-ash">{item.place}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Star() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 2 3 6.4 7 .9-5.1 4.9 1.3 6.9L12 17.7l-6.2 3.4 1.3-6.9L2 9.3l7-.9L12 2Z" />
    </svg>
  );
}
