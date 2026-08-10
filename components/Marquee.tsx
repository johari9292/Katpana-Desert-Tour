"use client";

import { useState } from "react";

const destinations = [
  "Katpana Desert",
  "K2 Base Camp",
  "Hunza Valley",
  "Deosai Plains",
  "Khaplu Palace",
  "Shigar Fort",
  "Astore Valley",
  "Kachura Lakes"
];

function DestinationList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={`flex shrink-0 items-center gap-7 whitespace-nowrap px-4 font-display text-2xl italic text-skardu-snow sm:gap-10 sm:px-5 sm:text-3xl ${
        duplicate ? "destination-marquee-duplicate" : ""
      }`}
    >
      {destinations.map((destination) => (
        <li key={destination} className="inline-flex items-center gap-4">
          <span aria-hidden="true" className="text-skardu-gold">
            •
          </span>
          {destination}
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-labelledby="popular-destinations-heading"
      className="border-y border-white/20 bg-skardu-stone/40 py-4 sm:py-5"
    >
      <h2 id="popular-destinations-heading" className="sr-only">
        Popular northern Pakistan destinations
      </h2>

      <div className="mb-2 flex justify-end px-4 sm:px-5">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
          className="destination-marquee-control min-h-11 rounded-full border border-skardu-mist bg-skardu-void px-4 py-2 text-xs font-bold text-skardu-snow transition-colors hover:border-skardu-gold hover:text-skardu-gold"
        >
          {paused ? "Resume destinations" : "Pause destinations"}
        </button>
      </div>

      <div className="destination-marquee-viewport overflow-hidden">
        <div className="destination-marquee-track" data-paused={paused}>
          <DestinationList />
          <DestinationList duplicate />
        </div>
      </div>
    </section>
  );
}
