"use client";

import { MotionValue, useScroll, useTransform } from "framer-motion";

export function useParallax(input: [number, number], output: [number, number]): MotionValue<number> {
  const { scrollY } = useScroll();
  return useTransform(scrollY, input, output);
}
