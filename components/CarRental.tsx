"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { buildWhatsAppURL, WHATSAPP_CAR } from "@/constants/contact";
import AnimatedSection from "./AnimatedSection";
import DateField from "./DateField";

const cars = [
  { name: "4x4 Jeep", detail: "Karakoram routes", seats: "4 seats", price: "PKR 18k-28k/day" },
  { name: "Corolla/Civic", detail: "City and lake drives", seats: "4 seats", price: "PKR 10k-16k/day" },
  { name: "Hiace Van", detail: "Groups and families", seats: "12 seats", price: "PKR 22k-35k/day" },
  { name: "Land Cruiser", detail: "Expeditions", seats: "5 seats", price: "PKR 35k-55k/day" }
];

export default function CarRental() {
  const [selected, setSelected] = useState(cars[0]);
  const [pickup, setPickup] = useState("Skardu Airport");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(2);

  function requestCar() {
    const msg = `Hi! I need a *${selected.name}* for ${duration} day(s) in Skardu.\nPickup: ${pickup || "Not selected"}\nDate: ${date || "Flexible"}\n\nPlease confirm availability and pricing.`;
    window.open(buildWhatsAppURL(WHATSAPP_CAR, msg), "_blank", "noopener,noreferrer");
  }

  return (
    <AnimatedSection id="cars" className="relative px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <div className="glass-panel rounded-2xl p-5 md:p-7">
            <div className="grid gap-4">
              {cars.map((car) => {
                const active = selected.name === car.name;
                return (
                  <motion.button
                    key={car.name}
                    type="button"
                    onClick={() => setSelected(car)}
                    whileHover={{ y: -4, borderColor: "#C9A84C" }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className={`relative flex items-center gap-4 rounded-2xl border p-4 text-left ${
                      active ? "border-skardu-gold bg-skardu-stone" : "border-skardu-mist bg-skardu-void/40"
                    }`}
                  >
                    <CarIcon active={active} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-black text-skardu-snow">{car.name}</span>
                      <span className="block text-sm text-skardu-ash">{car.detail} / {car.seats}</span>
                    </span>
                    <span className="text-right text-xs font-bold text-skardu-gold">{car.price}</span>
                    <AnimatePresence>
                      {active ? (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-skardu-gold text-[10px] font-black text-skardu-void"
                        >
                          OK
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-skardu-snow">
                Pickup location
                <input
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                  className="rounded-xl border border-skardu-mist bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/20"
                />
              </label>
              <DateField label="Travel date" value={date} onChange={setDate} />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-skardu-mist bg-skardu-void/50 p-4">
              <span className="font-bold text-skardu-snow">Duration</span>
              <div className="flex items-center gap-4">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDuration((value) => Math.max(1, value - 1))}
                  className="grid size-9 place-items-center rounded-full border border-skardu-mist text-skardu-snow"
                  aria-label="Decrease rental duration"
                >
                  -
                </motion.button>
                <motion.span
                  key={duration}
                  initial={{ scale: 0.82, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-14 text-center font-display text-3xl font-bold text-skardu-gold"
                >
                  {duration}
                </motion.span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDuration((value) => value + 1)}
                  className="grid size-9 place-items-center rounded-full border border-skardu-mist text-skardu-snow"
                  aria-label="Increase rental duration"
                >
                  +
                </motion.button>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={requestCar}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(37,211,102,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full rounded-xl bg-[#25D366] px-5 py-4 font-black text-white"
            >
              Request Car via WhatsApp
            </motion.button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Rent a car in Skardu</p>
          <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
            Choose the right vehicle for every altitude
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-skardu-ash">
            City transfers, lake days, cold-desert sunsets, and Deosai routes need different vehicles. Make the choice
            simple before the traveler lands in Skardu.
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}

function CarIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-10 w-16 ${active ? "text-skardu-gold" : "text-skardu-ash"}`} viewBox="0 0 96 48" fill="none" aria-hidden="true">
      <path d="M13 30h6l7-12h34l10 12h12c3 0 5 2 5 5v4H9v-5c0-2 2-4 4-4Z" stroke="currentColor" strokeWidth="3" />
      <path d="M31 18 25 30h40L55 18" stroke="currentColor" strokeWidth="3" />
      <circle cx="29" cy="39" r="5" fill="currentColor" />
      <circle cx="68" cy="39" r="5" fill="currentColor" />
    </svg>
  );
}
