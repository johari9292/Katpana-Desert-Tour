"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { tourPackages } from "@/data/tours";
import AnimatedSection from "./AnimatedSection";

export default function TourPackages() {
  const [activeSlug, setActiveSlug] = useState(tourPackages[0].slug);
  const reduceMotion = useReducedMotion();
  const activeTour = useMemo(() => tourPackages.find((tour) => tour.slug === activeSlug) ?? tourPackages[0], [activeSlug]);
  const requestUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi! I want details for ${activeTour.title} with ${BRAND_NAME}. Please send itinerary, hotel options, and pricing.`
  );

  return (
    <AnimatedSection id="tours" className="relative px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Tour packages</p>
            <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
              Northern Pakistan tours built from Skardu
            </h2>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              Choose cold-desert weekends, Deosai 4x4 days, Hunza and Skardu road trips, cultural valleys, or serious
              K2-side trekking logistics with original itineraries shaped for real mountain travel.
            </p>
          </div>
          <Link
            href="/tours/"
            className="inline-flex self-start rounded-full border border-skardu-teal px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-teal lg:self-auto"
          >
            View all tours
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            {tourPackages.slice(0, 6).map((tour, index) => {
              const active = activeTour.slug === tour.slug;

              return (
                <motion.button
                  key={tour.slug}
                  type="button"
                  onClick={() => setActiveSlug(tour.slug)}
                  whileHover={{ y: -4, borderColor: "#C9A84C" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active ? "border-skardu-gold bg-skardu-stone" : "border-skardu-mist bg-skardu-stone/55"
                  }`}
                >
                  <span className="mb-3 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">
                    <span className={active ? "text-skardu-gold" : "text-skardu-ash"}>{String(index + 1).padStart(2, "0")}</span>
                    <span>{tour.duration}</span>
                    <span>{tour.difficulty}</span>
                  </span>
                  <span className="block font-display text-2xl font-bold leading-tight text-skardu-snow">{tour.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-skardu-ash">{tour.region}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.article
            key={activeTour.slug}
            initial={reduceMotion ? false : { opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-2xl p-5 md:p-7"
          >
            <div className="relative overflow-hidden rounded-xl border border-skardu-mist bg-skardu-void/60">
              <Image
                src={activeTour.image}
                alt={activeTour.imageAlt ?? `${activeTour.title} package view in Skardu Gilgit-Baltistan Pakistan`}
                title={activeTour.imageTitle ?? `${activeTour.title} Skardu tour package route`}
                width={960}
                height={540}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-video w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-skardu-void/80 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-skardu-gold px-3 py-1 text-xs font-black uppercase tracking-widest text-skardu-void">
                {activeTour.badge}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em]">
              {[activeTour.category, activeTour.duration, activeTour.bestSeason].map((item) => (
                <span key={item} className="rounded-full border border-skardu-mist px-3 py-1 text-skardu-ash">
                  {item}
                </span>
              ))}
            </div>

            <h3 className="mt-5 font-display text-4xl font-bold leading-tight text-skardu-snow md:text-5xl">{activeTour.title}</h3>
            <p className="mt-5 text-lg leading-8 text-skardu-ash">{activeTour.overview}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {activeTour.highlights.slice(0, 4).map((highlight) => (
                <p key={highlight} className="rounded-2xl border border-skardu-mist bg-skardu-void/45 p-4 text-sm leading-6 text-skardu-ash">
                  {highlight}
                </p>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/tours/${activeTour.slug}/`}
                className="rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
              >
                View itinerary
              </Link>
              <a
                href={requestUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-skardu-teal px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-teal"
              >
                Ask on WhatsApp
              </a>
            </div>
          </motion.article>
        </div>
      </div>
    </AnimatedSection>
  );
}
