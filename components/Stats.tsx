"use client";

import { motion } from "framer-motion";
import { useCounter } from "@/hooks/useCounter";
import AnimatedSection from "./AnimatedSection";

const stats = [
  { value: 5, suffix: "", label: "World-class peak routes nearby" },
  { value: 200, suffix: "+", label: "Hotels and guesthouses" },
  { value: 12, suffix: "+", label: "Heritage forts and valley stops" },
  { value: 4500, suffix: "m", label: "Deosai Plateau height" }
];

const features = ["Halal Food", "Local Guides", "Satellite WiFi", "Medical Support", "24/7 Booking"];

export default function Stats() {
  return (
    <AnimatedSection id="why-skardu" className="relative px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Why Skardu</p>
          <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
            Built for altitude, culture, and conversion
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {features.map((feature, index) => (
            <motion.span
              key={feature}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="rounded-full border border-skardu-mist bg-skardu-stone/75 px-5 py-3 text-sm font-bold text-skardu-ash"
            >
              {feature}
            </motion.span>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function StatCard({ value: target, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value } = useCounter(target);

  return (
    <div ref={ref} className="glass-panel rounded-2xl p-6">
      <span className="font-display text-6xl font-bold text-skardu-gold">
        {value.toLocaleString()}
        {suffix}
      </span>
      <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-skardu-ash">{label}</p>
    </div>
  );
}
