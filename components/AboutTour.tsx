"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import AnimatedSection from "./AnimatedSection";

const servicePoints = [
  "Custom Skardu, Hunza, Deosai, Khaplu, Shigar, and K2-side plans",
  "Hotels, private vehicles, 4x4 routes, airport transfers, and local drivers",
  "Family, honeymoon, cultural, adventure, and trekking support from one WhatsApp thread"
];

const promoItems = ["Private tour plans", "Local route checks", "Hotel and car support", "Trekking logistics"];

export default function AboutTour() {
  const reduceMotion = useReducedMotion();
  const bookingUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi! I want to plan a northern Pakistan trip with ${BRAND_NAME}. Please guide me about tours, destinations, hotels, and cars.`
  );

  return (
    <>
      <AnimatedSection id="about" className="relative px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">About {BRAND_NAME}</p>
            <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
              Local travel planning for the Karakoram and cold desert routes
            </h2>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              {BRAND_NAME} focuses on practical northern Pakistan travel: clear day plans, realistic drive times,
              route-aware vehicles, responsive hotel coordination, and original itineraries for travelers who want Skardu
              to feel smooth on the ground.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 48, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-2xl p-6 md:p-8"
          >
            <div className="grid gap-4">
              {servicePoints.map((point, index) => (
                <div key={point} className="rounded-2xl border border-skardu-mist bg-skardu-void/45 p-5">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-base leading-7 text-skardu-ash">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="relative px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-skardu-mist bg-gradient-to-r from-skardu-stone via-skardu-void to-skardu-stone p-6 md:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Plan your season</p>
              <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow md:text-5xl">
                Build a custom package for Skardu, Hunza, Deosai, or K2 trekking
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {promoItems.map((item) => (
                  <span key={item} className="rounded-full border border-skardu-mist bg-skardu-void/45 px-4 py-2 text-sm font-bold text-skardu-ash">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#25D366] px-8 py-4 text-center font-black text-white"
            >
              Start on WhatsApp
            </a>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}

