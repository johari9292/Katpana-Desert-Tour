"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    quote: "The WhatsApp booking was fast, the TZ arrived on time, and Katpana sunset felt unreal.",
    name: "Ayesha Khan",
    place: "🇵🇰 Lahore"
  },

  {
    quote: "Upper Kachura and Deosai were handled perfectly. The driver knew every photo stop.",
    name: "Sarah Ahmed",
    place: "🇵🇰 Lahore"
  },
  {
    quote: "Skardu felt premium without losing its raw mountain soul. We booked everything from one chat.",
    name: "Bilal Noor",
    place: "🇵🇰 Islamabad"
  }
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <AnimatedSection id="testimonials" className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Traveler voices</p>
            <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
              Stories from the roof of the world
            </h2>
          </div>
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show testimonial ${index + 1}`}
                className="relative size-3 rounded-full bg-skardu-mist"
              >
                {active === index ? <motion.span layoutId="testimonial-dot" className="absolute inset-0 rounded-full bg-skardu-gold" /> : null}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: -620, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
          className="flex cursor-grab gap-5 active:cursor-grabbing"
        >
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              onViewportEnter={() => setActive(index)}
              whileHover={{ y: -8 }}
              className="glass-panel min-w-[82vw] rounded-2xl p-6 sm:min-w-[420px]"
            >
              <div className="mb-5 flex gap-1 text-skardu-gold" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} />
                ))}
              </div>
              <p className="font-display text-3xl italic leading-tight text-skardu-snow">“{item.quote}”</p>
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
