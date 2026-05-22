"use client";

import { motion } from "framer-motion";
import { buildWhatsAppURL, displayPhone, displayPhone2, WHATSAPP_CAR, WHATSAPP_HOTEL } from "@/constants/contact";

export default function Footer() {
  const hotelUrl = buildWhatsAppURL(WHATSAPP_HOTEL, "Hi! I want to book a hotel in Skardu near Katpana Desert.");
  const carUrl = buildWhatsAppURL(WHATSAPP_CAR, "Hi! I want to rent a car in Skardu for my tour.");

  return (
    <footer className="relative border-t border-skardu-mist/60 bg-gradient-to-r from-skardu-void via-skardu-stone to-skardu-void px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Start the journey</p>
        <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">Ready to Explore Skardu?</h2>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <WhatsAppButton href={hotelUrl}>Book hotel</WhatsAppButton>
          <WhatsAppButton href={carUrl}>Rent a car</WhatsAppButton>
        </div>
        <p className="mt-6 text-skardu-ash">WhatsApp: {displayPhone}, {displayPhone2}</p>
        {/* <div className="mt-8 flex justify-center gap-4 text-skardu-ash">
          {["Instagram", "Facebook", "YouTube"].map((label) => (
            <motion.a key={label} href="#" aria-label={label} whileHover={{ color: "#C9A84C", y: -3 }} className="grid size-10 place-items-center rounded-full border border-skardu-mist">
              <SocialIcon />
            </motion.a>
          ))}
        </div> */}
        <p className="mt-10 text-sm text-skardu-ash">(c) 2026 Skardu Tourism / Built with care in Pakistan</p>
      </div>
    </footer>
  );
}

function WhatsAppButton({ href, children }: { href: string; children: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(37,211,102,0.3)" }}
      whileTap={{ scale: 0.97 }}
      className="rounded-full bg-[#25D366] px-8 py-4 font-black text-white"
    >
      {children}
    </motion.a>
  );
}

function SocialIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}
