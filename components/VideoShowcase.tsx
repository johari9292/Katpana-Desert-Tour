"use client";

import { motion, useReducedMotion } from "framer-motion";
import { KATPANA_VIDEO_URL } from "@/constants/media";
import AnimatedSection from "./AnimatedSection";

export default function VideoShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="relative px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="relative overflow-hidden rounded-xl">
            <video
              className="aspect-video w-full object-cover brightness-105 saturate-110"
              src={KATPANA_VIDEO_URL}
              poster="/images/katpana-skardu-hero.png"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Katapana Desert Skardu video"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-skardu-void/35 via-transparent to-transparent" />
          </div>
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Katapana Desert video guide</p>
          <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
            Watch the cold desert before you book Skardu
          </h2>
          <p className="mt-6 text-lg leading-8 text-skardu-ash">
            See the sand, mountain light, and open Skardu landscape that make Katapana Desert one of the most searched
            places to visit in Gilgit Baltistan. Use the video as a quick preview for hotel booking, rent a car planning,
            sunrise photography, and family-friendly Skardu tour packages.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Katapana Desert Skardu", "Skardu rent a car", "Gilgit Baltistan tours", "Hotels near Katapana"].map((item) => (
              <span key={item} className="rounded-full border border-skardu-mist bg-skardu-stone/75 px-4 py-3 text-sm font-bold text-skardu-ash">
                {item}
              </span>
            ))}
          </div>
          <a
            href="/articles/"
            className="mt-8 inline-flex rounded-full border border-skardu-teal px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-teal"
          >
            Read Skardu guides
          </a>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
