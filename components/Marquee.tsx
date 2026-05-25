"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

const destinations = [
  "Katpana Desert",
  "K2 Base Camp",
  "Hunza Valley",
  "Deosai Plains",
  "Khaplu Palace",
  "Shigar Fort",
  "Astore Valley",
  "Kachura Lakes"
];

export default function Marquee() {
  const items = [...destinations, ...destinations, ...destinations];
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    controls.start({
      x: ["0%", "-50%"],
      transition: { repeat: Infinity, ease: "linear", duration: 42 }
    });
  }, [controls, reduceMotion]);

  return (
    <section role="marquee" aria-label="Popular northern Pakistan destinations" className="overflow-hidden border-y border-skardu-mist/60 bg-skardu-stone/30 py-4 sm:py-6">
      <motion.div
        animate={controls}
        onHoverStart={() => controls.stop()}
        onHoverEnd={() => {
          if (!reduceMotion) {
            controls.start({
              x: ["0%", "-50%"],
              transition: { repeat: Infinity, ease: "linear", duration: 42 }
            });
          }
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.01 }}
        className="flex w-max gap-7 whitespace-nowrap px-4 font-display text-2xl italic text-skardu-snow/80 sm:gap-10 sm:px-5 sm:text-3xl"
      >
        {items.map((destination, index) => (
          <span key={`${destination}-${index}`} className="inline-flex items-center gap-4">
            <span className="text-skardu-gold">*</span>
            {destination}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
