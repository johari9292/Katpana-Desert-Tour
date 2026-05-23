"use client";

import { useState } from "react";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import type { TourPackage } from "@/data/tours";

const hotelStyles = ["Budget", "Standard", "Luxury", "Flexible"] as const;

export default function TourInquiryForm({ tour }: { tour: TourPackage }) {
  const [name, setName] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [hotelStyle, setHotelStyle] = useState<(typeof hotelStyles)[number]>("Flexible");
  const [selectedActivities, setSelectedActivities] = useState<string[]>(tour.activities);
  const [notes, setNotes] = useState("");

  function toggleActivity(activity: string) {
    setSelectedActivities((current) =>
      current.includes(activity) ? current.filter((item) => item !== activity) : [...current, activity]
    );
  }

  function requestTour() {
    const message = [
      `Hi! I am interested in *${tour.title}* with ${BRAND_NAME}.`,
      `Name: ${name || "Not provided"}`,
      `Tour: ${tour.title}`,
      `Duration: ${tour.duration}`,
      `Region: ${tour.region}`,
      `Travel date: ${travelDate || "Flexible"}`,
      `Travelers: ${travelers}`,
      `Hotel style: ${hotelStyle}`,
      `Selected interests: ${selectedActivities.length ? selectedActivities.join(", ") : "Please suggest"}`,
      `Best season noted: ${tour.bestSeason}`,
      `Notes: ${notes || "No extra notes yet"}`,
      "",
      "Please send a detailed quote, hotel options, vehicle recommendation, and day-by-day plan."
    ].join("\n");

    window.open(buildWhatsAppURL(WHATSAPP_MAIN, message), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
      <h2 className="font-display text-3xl font-bold text-skardu-snow">Tour interest form</h2>
      <p className="mt-2 text-sm leading-6 text-skardu-ash">Send this selected tour, route, dates, and interests directly to WhatsApp.</p>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-skardu-snow">
          Traveler name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="rounded-xl border border-skardu-mist bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/20"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-skardu-snow">
          Preferred date
          <input
            value={travelDate}
            onChange={(event) => setTravelDate(event.target.value)}
            type="date"
            className="rounded-xl border border-skardu-mist bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/20"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-skardu-snow">
          Travelers
          <input
            value={travelers}
            onChange={(event) => setTravelers(Number(event.target.value))}
            min={1}
            type="number"
            className="rounded-xl border border-skardu-mist bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/20"
          />
        </label>

        <div>
          <p className="mb-2 text-sm font-bold text-skardu-snow">Hotel style</p>
          <div className="rounded-2xl border border-skardu-mist bg-skardu-void/50 p-2">
            <div className="grid grid-cols-2 gap-2">
              {hotelStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setHotelStyle(style)}
                  className={`rounded-xl px-3 py-3 text-sm font-black ${
                    hotelStyle === style ? "bg-skardu-gold text-skardu-void" : "text-skardu-ash"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-skardu-snow">Travel interests</p>
          <div className="grid gap-2">
            {tour.activities.map((activity) => (
              <label key={activity} className="flex items-center gap-3 rounded-xl border border-skardu-mist bg-skardu-void/45 px-4 py-3 text-sm font-bold text-skardu-ash">
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity)}
                  onChange={() => toggleActivity(activity)}
                  className="size-4 accent-skardu-gold"
                />
                {activity}
              </label>
            ))}
          </div>
        </div>

        <label className="grid gap-2 text-sm font-bold text-skardu-snow">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Family needs, pickup city, hotel preference, route questions..."
            rows={4}
            className="rounded-xl border border-skardu-mist bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/20"
          />
        </label>

        <button type="button" onClick={requestTour} className="rounded-xl bg-[#25D366] px-5 py-4 font-black text-white">
          Send selected tour
        </button>
      </div>
    </div>
  );
}
