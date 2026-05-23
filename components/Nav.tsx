"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { BRAND_NAME } from "@/constants/brand";
import { destinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";

const quickLinks = [
  ["Articles", "/articles/"],
    ["Trending", "/trending/"],


];

const guideLinks = [
  ["Skardu Travel Guide", "/skardu-travel-guide/", "Skardu travel guide"],
  ["Gilgit-Baltistan Tourism", "/gilgit-baltistan-tourism/", "Gilgit-Baltistan tourism"],
  ["Pakistan Trekking Guide", "/pakistan-trekking-guide/", "Best trekking in Pakistan"],
  ["Karakoram Highway", "/karakoram-highway-travel/", "Karakoram Highway travel"]
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-skardu-mist/50 bg-skardu-void/70 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8" aria-label="Primary navigation">
        <a href="#top" className="font-display text-xl font-bold italic tracking-wide text-skardu-gold sm:text-2xl lg:text-3xl">
          {BRAND_NAME}
        </a>

        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="hidden items-center gap-4 text-xs font-bold uppercase tracking-[0.14em] text-skardu-ash xl:gap-6 xl:tracking-[0.16em] lg:flex"
        >
          <DesktopDropdown label="Tours" href="/tours/" items={tourPackages.map((tour) => [tour.title, `/tours/${tour.slug}/`, tour.duration])} variants={item} />
          <DesktopDropdown
            label="Destinations"
            href="/destinations/"
            items={destinations.map((destination) => [destination.name, `/destinations/${destination.slug}/`, destination.type])}
            variants={item}
          />
          <DesktopDropdown label="Guides" href="/skardu-travel-guide/" items={guideLinks} variants={item} />
          {quickLinks.map(([label, href]) => (
            <motion.a key={label} variants={item} href={href} whileHover={{ color: "#C9A84C", y: -2 }}>
              {label}
            </motion.a>
          ))}
        </motion.div>

        <div className="hidden lg:block">
          <motion.a
            href="#tours"
            whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(201,168,76,0.32)" }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-skardu-gold px-5 py-3 text-sm font-black text-skardu-void"
          >
            Plan tour
          </motion.a>
        </div>

        <motion.button
          type="button"
          aria-label="Open mobile menu"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          whileTap={{ scale: 0.92 }}
          className="grid size-11 place-items-center rounded-full border border-skardu-mist text-skardu-snow lg:hidden"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </motion.button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-h-[calc(100vh-80px)] overflow-y-auto border-t border-skardu-mist/50 bg-skardu-void/95 px-5 py-5 lg:hidden"
          >
            <MobileGroup title="Tours" href="/tours/" items={tourPackages.map((tour) => [tour.title, `/tours/${tour.slug}/`])} onSelect={() => setOpen(false)} />
            <MobileGroup
              title="Destinations"
              href="/destinations/"
              items={destinations.map((destination) => [destination.name, `/destinations/${destination.slug}/`])}
              onSelect={() => setOpen(false)}
            />
            <MobileGroup title="Guides" href="/skardu-travel-guide/" items={guideLinks.map(([label, href]) => [label, href])} onSelect={() => setOpen(false)} />
            <div className="mt-5 grid gap-4 text-sm font-bold uppercase tracking-[0.18em] text-skardu-ash">
              {quickLinks.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <a className="text-skardu-gold" href="#tours" onClick={() => setOpen(false)}>
                Plan tour
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

function DesktopDropdown({
  label,
  href,
  items,
  variants
}: {
  label: string;
  href: string;
  items: string[][];
  variants: {
    hidden: { opacity: number; y: number };
    show: { opacity: number; y: number };
  };
}) {
  return (
    <motion.div variants={variants} className="group relative">
      <a href={href} className="inline-flex items-center gap-1.5 py-3 hover:text-skardu-gold">
        {label}
        <span aria-hidden="true" className="mt-[1px] text-[10px] text-skardu-gold transition-transform duration-200 group-hover:rotate-180">
          ▼
        </span>
      </a>

      <div className="invisible absolute left-1/2 top-full w-[min(78vw,620px)] -translate-x-1/2 translate-y-3 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="rounded-2xl border border-skardu-mist bg-skardu-void/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map(([title, itemHref, meta]) => (
              <a
                key={itemHref}
                href={itemHref}
                className="rounded-xl border border-transparent p-3 normal-case tracking-normal hover:border-skardu-gold hover:bg-skardu-stone"
              >
                <span className="block font-display text-xl font-bold leading-tight text-skardu-snow">{title}</span>
                <span className="mt-1 block text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">{meta}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MobileGroup({ title, href, items, onSelect }: { title: string; href: string; items: string[][]; onSelect: () => void }) {
  return (
    <div className="border-b border-skardu-mist/50 py-4">
      <a href={href} onClick={onSelect} className="text-sm font-black uppercase tracking-[0.18em] text-skardu-gold">
        {title}
      </a>
      <div className="mt-3 grid gap-2">
        {items.map(([label, itemHref]) => (
          <a key={itemHref} href={itemHref} onClick={onSelect} className="rounded-xl border border-skardu-mist bg-skardu-stone/50 px-4 py-3 text-sm font-bold text-skardu-ash">
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
