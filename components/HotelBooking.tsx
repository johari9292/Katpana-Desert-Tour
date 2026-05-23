"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { buildWhatsAppURL, WHATSAPP_HOTEL } from "@/constants/contact";
import { useTilt } from "@/hooks/useTilt";
import AnimatedSection from "./AnimatedSection";
import DateField from "./DateField";

const hotelTypes = ["Budget", "Standard", "Luxury"] as const;
type HotelType = (typeof hotelTypes)[number];

export default function HotelBooking() {
  const [hotelType, setHotelType] = useState<HotelType>("Luxury");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const tilt = useTilt(12);
  const reduceMotion = useReducedMotion();

  function requestHotel() {
    const msg = `Hi! I'd like to book a *${hotelType}* hotel in Skardu.\nCheck-in: ${checkIn || "Flexible"}\nCheck-out: ${checkOut || "Flexible"}\nGuests: ${guests}\n\nPlease send availability and rates.`;
    window.open(buildWhatsAppURL(WHATSAPP_HOTEL, msg), "_blank", "noopener,noreferrer");
  }

  return (
    <AnimatedSection id="hotels" className="relative px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Stay in Skardu</p>
          <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
            Find Your Perfect Mountain Retreat
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-skardu-ash">
            From Serena-style comfort and Shangrila lake stays to boutique guesthouses near Katapana Desert, we shape
            accommodation around your route, season, and group style.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-skardu-ash sm:grid-cols-3">
            {["Heated rooms", "Lake access", "Airport pickup"].map((item) => (
              <span key={item} className="rounded-full border border-skardu-mist bg-skardu-stone/70 px-4 py-3 text-center">
                {item}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 60, rotateY: 15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1000 }}
          onMouseMove={tilt.handleMouseMove}
          onMouseLeave={tilt.handleMouseLeave}
          className="glass-panel rounded-2xl p-6 md:p-8"
        >
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl font-bold text-skardu-snow">Hotel booking</h3>
              <p className="text-sm text-skardu-ash">Send one clear request to WhatsApp.</p>
            </div>
            <span className="rounded-full bg-skardu-gold/15 px-3 py-1 text-xs font-black uppercase tracking-widest text-skardu-gold">
              Live lead
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DateField label="Check-in date" value={checkIn} onChange={setCheckIn} />
            <DateField label="Check-out date" value={checkOut} onChange={setCheckOut} />
            <label className="grid gap-2 text-sm font-bold text-skardu-snow sm:col-span-2">
              Guests
              <input
                value={guests}
                onChange={(event) => setGuests(Number(event.target.value))}
                min={1}
                type="number"
                className="rounded-xl border border-skardu-mist bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/20"
              />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-skardu-mist bg-skardu-void/50 p-2">
            <div className="grid grid-cols-3 gap-2">
              {hotelTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setHotelType(type)}
                  className="relative rounded-xl px-3 py-3 text-sm font-black text-skardu-snow"
                >
                  {hotelType === type ? (
                    <motion.span layoutId="hotel-pill" className="absolute inset-0 rounded-xl bg-skardu-gold" />
                  ) : null}
                  <span className={`relative ${hotelType === type ? "text-skardu-void" : "text-skardu-ash"}`}>{type}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.button
            type="button"
            onClick={requestHotel}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(37,211,102,0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-5 py-4 font-black text-white"
          >
            <WhatsAppIcon />
            Book via WhatsApp
          </motion.button>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .4 5.2.4 11.6c0 2 .5 3.9 1.5 5.6L0 24l7-1.8c1.6.9 3.4 1.3 5.2 1.3 6.4 0 11.6-5.2 11.6-11.6 0-3.1-1.2-6-3.3-8.4ZM12.2 21.6c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-4.1 1.1 1.1-4-.2-.4a9.4 9.4 0 0 1-1.4-5c0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.6 2.8a9.3 9.3 0 0 1 2.8 6.6c0 5.2-4.2 9.7-9.4 9.7Zm5.2-7c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8 0 1.7 1.2 3.2 1.4 3.5.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.3-.6-.5Z"
      />
    </svg>
  );
}
