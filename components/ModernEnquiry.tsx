"use client";

import { useEffect, useState, type FormEvent } from "react";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { trackConversion } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/en";

export default function ModernEnquiry({ locale, messages: t }: { locale: Locale; messages: Messages["form"] }) {
  const [error, setError] = useState(false);
  const [journey, setJourney] = useState("");
  useEffect(() => {
    const onSelect = (event: Event) => { if (event instanceof CustomEvent && typeof event.detail === "string") setJourney(event.detail); };
    window.addEventListener("katpana:journey-selected", onSelect);
    return () => window.removeEventListener("katpana:journey-selected", onSelect);
  }, []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const contact = String(formData.get("contact") ?? "").trim();
    if (!name || !contact) { setError(true); return; }
    setError(false);
    const message = [t.intro, `${t.name}: ${name}`, `${t.contact}: ${contact}`, `${t.date}: ${formData.get("date") || "—"}`, `${t.travellers}: ${formData.get("travellers") || "—"}`, ...(journey ? [`${t.selection}: ${journey}`] : []), `${t.message}: ${formData.get("message") || "—"}`, `Language: ${locale}`].join("\n");
    trackConversion("inquiry_submit", { placement: "modern_homepage", locale, journey });
    window.location.assign(buildWhatsAppURL(WHATSAPP_MAIN, message));
  };
  return <form className="modern-enquiry-form" onSubmit={submit} onFocusCapture={() => trackConversion("inquiry_start", { placement: "modern_homepage", locale })}>
    <div className="enquiry-form-row"><label htmlFor="enquiry-name">{t.name}<input id="enquiry-name" name="name" autoComplete="name" required maxLength={100} /></label><label htmlFor="enquiry-contact">{t.contact}<input id="enquiry-contact" name="contact" autoComplete="email" required maxLength={160} /></label></div>
    <div className="enquiry-form-row"><label htmlFor="enquiry-date">{t.date}<input id="enquiry-date" name="date" type="date" /></label><label htmlFor="enquiry-travellers">{t.travellers}<input id="enquiry-travellers" name="travellers" type="number" min="1" max="100" defaultValue="2" inputMode="numeric" /></label></div>
    {journey && <p className="enquiry-selection">{t.selection}: {journey}<button type="button" aria-label={t.selection} onClick={() => setJourney("")}>×</button></p>}
    <label htmlFor="enquiry-message">{t.message}<textarea id="enquiry-message" name="message" rows={3} maxLength={2000} /></label>
    {error && <p className="enquiry-error" role="alert">{t.required}</p>}
    <button className="modern-button button-peach" type="submit">{t.submit}<span aria-hidden="true">↗</span></button><p className="enquiry-note">{t.note} <a href="/privacy/">{t.privacy}</a></p>
  </form>;
}
