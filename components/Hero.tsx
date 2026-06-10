"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SKARDU_HERO_VIDEO_URL, SKARDU_TOURIST_POINTS } from "@/constants/media";

const subheadline = "Private Skardu, Hunza, Deosai, and Karakoram journeys for travelers worldwide";

const stars = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 84}%`,
  size: index % 4 === 0 ? 2 : 1,
  duration: 2 + (index % 4) * 0.8,
  delay: (index % 9) * 0.17
}));

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const load = () => setLoadVideo(true);
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const idleCallback = win.requestIdleCallback?.(load, { timeout: 2500 });
    const timeout = window.setTimeout(load, 3500);

    return () => {
      if (idleCallback) win.cancelIdleCallback?.(idleCallback);
      window.clearTimeout(timeout);
    };
  }, [reduceMotion]);

  return (
    <section id="top" className="relative isolate min-h-[92svh] overflow-hidden bg-skardu-void sm:min-h-screen">
      <div className="absolute inset-0">
        <Image
          src="/images/katpana-skardu-hero.jpg"
          alt="Katpana Desert near Skardu with sand dunes, mountains, and a tour vehicle"
          title="Katpana Desert Tour hero image with Skardu sand dunes and Karakoram mountains"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover opacity-55 sm:opacity-45"
        />
        <video
          className="absolute inset-0 hidden h-full w-full object-cover opacity-90 brightness-110 contrast-105 saturate-110 sm:block"
          src={loadVideo ? SKARDU_HERO_VIDEO_URL : undefined}
          poster="/images/katpana-skardu-hero.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-label="Autoplaying Skardu destination video with mountains, valleys, and rivers"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(62,173,167,.24),transparent_32%),linear-gradient(90deg,rgba(8,12,16,.58),rgba(8,12,16,.28)_48%,rgba(8,12,16,.04)),linear-gradient(180deg,rgba(8,12,16,.12),#080C10_92%)]" />
      </div>

      <div aria-hidden="true" className="absolute inset-0 hidden sm:block">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white/30"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
            animate={reduceMotion ? undefined : { opacity: [0.1, 0.6, 0.1] }}
            transition={{ repeat: Infinity, duration: star.duration, delay: star.delay }}
          />
        ))}
      </div>

      {/* <motion.div aria-hidden="true" style={{ y: rearPeaks }} className="absolute inset-x-0 bottom-12 text-skardu-mist/60">
        <MountainLayer opacity="0.58" />
      </motion.div>
      <motion.div aria-hidden="true" style={{ y: midPeaks }} className="absolute inset-x-0 bottom-0 text-skardu-stone">
        <MountainLayer opacity="0.95" />
      </motion.div> */}

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-skardu-void via-skardu-void/90 to-transparent sm:h-32" />
      <div aria-hidden="true" className="absolute bottom-20 left-0 right-0 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-skardu-teal/80 to-transparent shadow-teal" />

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-center px-4 pb-24 pt-24 sm:min-h-screen sm:px-5 sm:pb-28 sm:pt-28 lg:px-8">
        <div className="max-w-5xl">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-5 sm:text-xs sm:tracking-[0.22em]"
          >
            Skardu and Gilgit-Baltistan, Pakistan
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(4rem,24vw,7rem)] font-bold leading-[0.78] text-skardu-snow sm:text-display"
          >
            Katpana
            <br />
            Desert
            <br />
            <span className="text-shimmer animate-shimmer">Tour</span>
          </motion.h1>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-4xl sm:mt-7"
          >
            <div className="flex flex-wrap gap-2" aria-label="Skardu tourist points featured on this tour">
              {SKARDU_TOURIST_POINTS.map((point) => (
                <motion.span
                  key={point}
                  animate={reduceMotion ? undefined : { y: [0, -6, 0], opacity: [0.72, 1, 0.72] }}
                  transition={{ repeat: Infinity, duration: 3.2, delay: SKARDU_TOURIST_POINTS.indexOf(point) * 0.18 }}
                  className="rounded-full border border-skardu-mist bg-skardu-stone/75 px-3 py-1.5 text-[11px] font-bold leading-4 text-skardu-snow backdrop-blur-sm sm:text-xs sm:backdrop-blur-md"
                >
                  {point}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[22rem] text-base leading-7 text-skardu-ash sm:mt-7 sm:max-w-none sm:text-xl"
          >
            {subheadline}
          </motion.p>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4"
          >
            <motion.a
              href="#tours"
              whileHover={{ scale: 1.04, boxShadow: "0 0 34px rgba(201,168,76,0.34)" }}
              whileTap={{ scale: 0.97 }}
              className="flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-8 py-3 text-center font-black text-skardu-void"
            >
              View Tours -&gt;
            </motion.a>
            <motion.a
              href="#destinations"
              whileHover={{ scale: 1.04, boxShadow: "0 0 34px rgba(62,173,167,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-8 py-3 text-center font-black text-skardu-teal"
            >
              Explore Destinations -&gt;
            </motion.a>
          </motion.div>
        </div>
      </div>

      <motion.div
        aria-label="Altitude badge"
        className="absolute bottom-5 right-4 z-20 rounded-2xl border border-skardu-mist/70 bg-skardu-stone/70 px-4 py-3 text-xs text-skardu-snow backdrop-blur-sm animate-float sm:bottom-8 sm:right-5 sm:px-5 sm:py-4 sm:text-sm sm:backdrop-blur-md lg:right-10"
      >
        <span className="block font-display text-2xl italic text-skardu-gold">2,438m</span>
        <span className="text-skardu-ash">above sea level</span>
      </motion.div>

      {/* <motion.div style={{ opacity: mouseOpacity }} className="absolute bottom-9 left-1/2 z-20 hidden -translate-x-1/2 lg:block">
        <svg width="30" height="48" viewBox="0 0 30 48" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="28" height="46" rx="14" stroke="#8C9198" strokeWidth="2" />
          <motion.circle cx="15" cy="13" r="3" fill="#C9A84C" animate={reduceMotion ? undefined : { y: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} />
        </svg>
      </motion.div> */}
    </section>
  );
}

function MountainLayer({ opacity }: { opacity: string }) {
  return (
    <svg viewBox="0 0 1440 360" className="h-72 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path
        opacity={opacity}
        fill="currentColor"
        d="M0 294 78 225l54 30 69-96 78 114 73-142 96 151 72-83 68 60 92-148 92 138 70-91 96 124 63-52 88 85 77-148 99 160 75-83 87 120v68H0z"
      />
    </svg>
  );
}
