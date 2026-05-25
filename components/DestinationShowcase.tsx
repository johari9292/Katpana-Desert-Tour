"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { destinations } from "@/data/destinations";
import AnimatedSection from "./AnimatedSection";

export default function DestinationShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection id="destinations" className="relative px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 max-w-4xl sm:mb-10">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">Destinations</p>
          <h2 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-5xl md:text-6xl">
            Deserts, mountains, lakes, valleys, and culture
          </h2>
          <p className="mt-4 text-base leading-7 text-skardu-ash sm:mt-6 sm:text-lg sm:leading-8">
            Explore the northern areas through destination pages for Katapana Desert, Deosai, Kachura, Shigar, Khaplu,
            Hunza, Astore, and the K2 Base Camp trekking corridor.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {destinations.slice(0, 8).map((destination, index) => (
            <motion.article
              key={destination.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8, borderColor: "#C9A84C" }}
              className="overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/65"
            >
              <div className="relative">
                <Image
                  src={destination.image}
                  alt={destination.imageAlt ?? `${destination.name} destination view in Gilgit-Baltistan Pakistan`}
                  title={destination.imageTitle ?? `${destination.name} Skardu destination guide`}
                  width={640}
                  height={420}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="aspect-[16/11] w-full object-cover opacity-75 sm:aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-skardu-void/85 via-skardu-void/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-skardu-void/70 px-3 py-1 text-xs font-black uppercase tracking-widest text-skardu-gold backdrop-blur-md">
                  {destination.type}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-ash">{destination.region}</span>
                <h3 className="mt-3 font-display text-[1.65rem] font-bold leading-tight text-skardu-snow sm:text-3xl">{destination.name}</h3>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-skardu-ash">{destination.overview}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {destination.activities.slice(0, 2).map((activity) => (
                    <span key={activity} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                      {activity}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/destinations/${destination.slug}/`}
                  className="mt-5 inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.14em] text-skardu-teal sm:mt-6 sm:tracking-[0.16em]"
                >
                  Explore destination
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/destinations/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-skardu-teal sm:tracking-[0.16em]"
          >
            View all destinations
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
