"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const navLinks = [
  ["Hotels", "#hotels"],
  ["Cars", "#cars"],
  ["Why Skardu", "/why-skardu/"],
  ["Articles", "/articles/"],
  ["Reviews", "/testimonials/"]
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
        <a href="#top" className="font-display text-3xl font-bold italic tracking-wide text-skardu-gold">
          SKARDU
        </a>
        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="hidden items-center gap-8 text-sm font-bold uppercase tracking-[0.18em] text-skardu-ash lg:flex"
        >
          {navLinks.map(([label, href]) => (
            <motion.a key={label} variants={item} href={href} whileHover={{ color: "#C9A84C", y: -2 }}>
              {label}
            </motion.a>
          ))}
        </motion.div>
        <div className="hidden lg:block">
          <motion.a
            href="#hotels"
            whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(201,168,76,0.32)" }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-skardu-gold px-5 py-3 text-sm font-black text-skardu-void"
          >
            Book now
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
            className="border-t border-skardu-mist/50 bg-skardu-void/95 px-5 py-5 lg:hidden"
          >
            <div className="grid gap-4 text-sm font-bold uppercase tracking-[0.18em] text-skardu-ash">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <a className="text-skardu-gold" href="#hotels" onClick={() => setOpen(false)}>
                Book now
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
