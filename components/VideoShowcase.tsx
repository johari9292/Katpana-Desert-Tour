"use client";

import { motion, useReducedMotion } from "framer-motion";
import { KATPANA_VIDEO_URL } from "@/constants/media";
import AnimatedSection from "./AnimatedSection";

export default function VideoShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="relative px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-[2rem] border border-skardu-mist bg-skardu-stone/60 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="relative overflow-hidden rounded-[1.45rem]">
            <video
              className="aspect-video w-full object-cover"
              src={KATPANA_VIDEO_URL}
              poster="/images/katpana-skardu-hero.png"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Katpana Desert Skardu video"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-skardu-void/35 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
