"use client";

import { type FormEvent, useState } from "react";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import type { TourPackage } from "@/data/tours";
import { trackConversion } from "@/lib/analytics";

export default function TourInquiryForm({ tour }: { tour?: TourPackage }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [started, setStarted] = useState(false);

  const tripName = tour?.title ?? "a custom northern Pakistan itinerary";

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackConversion("inquiry_start", {
      tour: tripName,
      page: typeof window === "undefined" ? undefined : window.location.pathname,
    });
  }

  function requestTour(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; contact?: string } = {};

    if (!name.trim()) nextErrors.name = "Enter your name so the planning team knows who to reply to.";
    if (!contact.trim()) nextErrors.contact = "Enter a WhatsApp number or email address for the reply.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    const message = [
      `Hi! I want to plan *${tripName}* with ${BRAND_NAME}.`,
      `Name: ${name.trim()}`,
      `Reply to: ${contact.trim()}`,
      tour ? `Tour: ${tour.title}` : "Tour: Please recommend a route",
      tour ? `Duration: ${tour.duration}` : "Duration: Flexible",
      tour ? `Region: ${tour.region}` : "Region: Skardu / northern Pakistan",
      `Travel date: ${travelDate || "Flexible"}`,
      `Travelers: ${travelers}`,
      `Notes: ${notes || "No extra notes yet"}`,
      "",
      "Please send the route options, quote basis, hotel and vehicle choices, inclusions, exclusions, and next steps.",
    ].join("\n");

    trackConversion("inquiry_submit", {
      tour: tripName,
      travelers,
      flexible_date: !travelDate,
      channel: "whatsapp",
    });

    window.open(buildWhatsAppURL(WHATSAPP_MAIN, message), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      id="tour-inquiry"
      noValidate
      onFocus={markStarted}
      onSubmit={requestTour}
      className="scroll-mt-28 rounded-2xl border border-skardu-control bg-skardu-stone/65 p-5"
    >
      <h2 className="font-display text-3xl font-bold text-skardu-snow">Customize your itinerary</h2>
      <p className="mt-2 text-sm leading-6 text-skardu-ash">
        Share the five essentials below. The site prepares a private WhatsApp message; submitting this form does not confirm a booking or payment.
      </p>

      <div className="mt-5 grid gap-4">
        <label htmlFor="inquiry-name" className="grid gap-2 text-sm font-bold text-skardu-snow">
          Name <span className="font-medium text-skardu-ash">(required)</span>
          <input
            id="inquiry-name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "inquiry-name-error" : undefined}
            className="min-h-12 rounded-xl border border-skardu-control bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/40"
          />
          {errors.name ? <span id="inquiry-name-error" className="text-sm font-medium text-red-300">{errors.name}</span> : null}
        </label>

        <label htmlFor="inquiry-contact" className="grid gap-2 text-sm font-bold text-skardu-snow">
          WhatsApp number or email <span className="font-medium text-skardu-ash">(required)</span>
          <input
            id="inquiry-contact"
            name="contact"
            autoComplete="tel"
            required
            value={contact}
            onChange={(event) => {
              setContact(event.target.value);
              if (errors.contact) setErrors((current) => ({ ...current, contact: undefined }));
            }}
            placeholder="For example, +44… or name@example.com"
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "inquiry-contact-error" : "inquiry-contact-hint"}
            className="min-h-12 rounded-xl border border-skardu-control bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none placeholder:text-skardu-ash focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/40"
          />
          <span id="inquiry-contact-hint" className="text-xs font-medium leading-5 text-skardu-ash">Include the international country code for WhatsApp.</span>
          {errors.contact ? <span id="inquiry-contact-error" className="text-sm font-medium text-red-300">{errors.contact}</span> : null}
        </label>

        <label htmlFor="inquiry-date" className="grid gap-2 text-sm font-bold text-skardu-snow">
          Preferred date <span className="font-medium text-skardu-ash">(optional — leave blank if flexible)</span>
          <input
            id="inquiry-date"
            name="travel_date"
            value={travelDate}
            onChange={(event) => setTravelDate(event.target.value)}
            type="date"
            className="min-h-12 rounded-xl border border-skardu-control bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/40"
          />
        </label>

        <label htmlFor="inquiry-travelers" className="grid gap-2 text-sm font-bold text-skardu-snow">
          Travelers
          <input
            id="inquiry-travelers"
            name="travelers"
            value={travelers}
            onChange={(event) => setTravelers(Number(event.target.value))}
            min={1}
            max={50}
            type="number"
            inputMode="numeric"
            className="min-h-12 rounded-xl border border-skardu-control bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/40"
          />
        </label>

        <label htmlFor="inquiry-notes" className="grid gap-2 text-sm font-bold text-skardu-snow">
          Trip goals or notes <span className="font-medium text-skardu-ash">(optional)</span>
          <textarea
            id="inquiry-notes"
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Interests, comfort needs, arrival city, preferred hotel level…"
            rows={3}
            className="rounded-xl border border-skardu-control bg-skardu-void/70 px-4 py-3 text-skardu-snow outline-none placeholder:text-skardu-ash focus:border-skardu-gold focus:ring-2 focus:ring-skardu-gold/40"
          />
        </label>

        <button type="submit" className="min-h-12 rounded-xl bg-[#25D366] px-5 py-4 font-black text-skardu-void">
          Send itinerary request
        </button>
        <p role="status" aria-live="polite" className="text-xs leading-5 text-skardu-ash">
          You can review and edit the prepared message in WhatsApp before sending it.
        </p>
      </div>
    </form>
  );
}
