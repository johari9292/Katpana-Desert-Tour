import Image from "next/image";
import { SKARDU_TOURIST_POINTS } from "@/constants/media";

const subheadline =
  "Private Skardu, Hunza, Deosai, and Karakoram journeys planned by local travel coordinators.";

export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[92svh] overflow-hidden bg-skardu-void sm:min-h-screen"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/katpana-skardu-hero.jpg"
          alt="Tour vehicle beside the cold-desert dunes and mountains at Katpana near Skardu"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(62,173,167,.16),transparent_34%),linear-gradient(90deg,rgba(8,12,16,.94),rgba(8,12,16,.66)_55%,rgba(8,12,16,.3)),linear-gradient(180deg,rgba(8,12,16,.24),#080C10_96%)]" />
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-skardu-void via-skardu-void/90 to-transparent" />
      <div aria-hidden="true" className="absolute bottom-20 left-0 right-0 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-skardu-teal/80 to-transparent shadow-teal" />

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-center px-4 pb-28 pt-24 sm:min-h-screen sm:px-5 sm:pb-32 sm:pt-28 lg:px-8">
        <div className="hero-copy-panel max-w-5xl rounded-[2rem] p-5 sm:p-8 lg:p-10">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-5 sm:text-xs sm:tracking-[0.22em]">
            Skardu and Gilgit-Baltistan, Pakistan
          </p>

          <h1
            id="hero-heading"
            className="max-w-5xl text-balance font-display text-[clamp(3.5rem,17vw,6.75rem)] font-bold leading-[0.82] text-skardu-snow"
          >
            Private Skardu &amp;
            <br />
            <span className="text-shimmer">Karakoram Tours</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-skardu-snow sm:mt-7 sm:text-xl sm:leading-8">
            {subheadline}
          </p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Featured northern Pakistan destinations">
            {SKARDU_TOURIST_POINTS.map((point) => (
              <span
                key={point}
                className="glass-control rounded-full px-3 py-1.5 text-[11px] font-bold leading-4 text-skardu-snow sm:text-xs"
              >
                {point}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <a
              href="#tours"
              className="flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-8 py-3 text-center font-black text-skardu-void transition-colors hover:bg-[#e3c76f]"
            >
              View tour itineraries
            </a>
            <a
              href="#destinations"
              className="flex min-h-12 items-center justify-center rounded-full border border-skardu-teal bg-skardu-void/60 px-8 py-3 text-center font-black text-skardu-teal transition-colors hover:bg-skardu-teal hover:text-skardu-void"
            >
              Explore destinations
            </a>
          </div>
        </div>
      </div>

      <p className="glass-panel absolute bottom-5 right-4 z-20 rounded-2xl px-4 py-3 text-xs text-skardu-snow sm:bottom-8 sm:right-5 sm:px-5 sm:py-4 sm:text-sm lg:right-10">
        <span className="block font-display text-2xl italic text-skardu-gold">Cold desert</span>
        <span className="text-skardu-snow">High-altitude route planning</span>
      </p>
    </section>
  );
}
