"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function AnimatedSection({ id, className = "", children }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 18 : 40 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: isMobile ? 0.36 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
