"use client";

import { motion } from "framer-motion";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, displayPhone, displayPhone2, WHATSAPP_CAR, WHATSAPP_HOTEL } from "@/constants/contact";

export default function Footer() {
  const hotelUrl = buildWhatsAppURL(WHATSAPP_HOTEL, `Hi! I want to book a hotel for my ${BRAND_NAME} trip near Katpana Desert or Skardu.`);
  const carUrl = buildWhatsAppURL(WHATSAPP_CAR, `Hi! I want to rent a car for my ${BRAND_NAME} route.`);

  return (
    <footer className="relative border-t border-skardu-mist/60 bg-gradient-to-r from-skardu-void via-skardu-stone to-skardu-void px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">Start the journey</p>
        <h2 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-5xl md:text-6xl">Ready to Plan Northern Pakistan?</h2>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <WhatsAppButton href={hotelUrl}>Book stay</WhatsAppButton>
          <WhatsAppButton href={carUrl}>Plan transport</WhatsAppButton>
        </div>
        <p className="mt-6 text-sm leading-6 text-skardu-ash sm:text-base">WhatsApp: {displayPhone}, {displayPhone2}</p>
        {/* <div className="mt-8 flex justify-center gap-4 text-skardu-ash">
          {["Instagram", "Facebook", "YouTube"].map((label) => (
            <motion.a key={label} href="#" aria-label={label} whileHover={{ color: "#C9A84C", y: -3 }} className="grid size-10 place-items-center rounded-full border border-skardu-mist">
              <SocialIcon />
            </motion.a>
          ))}
        </div> */}
        <p className="mt-8 text-sm leading-6 text-skardu-ash sm:mt-10">(c) 2026 {BRAND_NAME} / Built with care in Pakistan</p>
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
      className="flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-8 py-4 font-black text-white"
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
