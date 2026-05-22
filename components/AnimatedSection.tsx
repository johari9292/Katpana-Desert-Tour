"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface AnimatedSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function AnimatedSection({ id, className = "", children }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
