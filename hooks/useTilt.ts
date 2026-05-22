"use client";

import { MouseEvent, useCallback } from "react";
import { MotionValue, useMotionValue, useSpring } from "framer-motion";

interface TiltResult {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  handleMouseMove: (event: MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
}

export function useTilt(maxTilt = 10): TiltResult {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(rawY, { stiffness: 300, damping: 25 });

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      rawX.set((0.5 - y) * maxTilt);
      rawY.set((x - 0.5) * maxTilt);
    },
    [maxTilt, rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}
