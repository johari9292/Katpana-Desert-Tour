"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { animate, useMotionValue } from "framer-motion";

interface CounterResult {
  ref: (node?: Element | null) => void;
  value: number;
}

export function useCounter(target: number, duration = 1.6): CounterResult {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.35 });
  const motionValue = useMotionValue(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const unsubscribe = motionValue.on("change", (latest) => setValue(Math.round(latest)));
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1]
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [duration, inView, motionValue, target]);

  return { ref, value };
}
