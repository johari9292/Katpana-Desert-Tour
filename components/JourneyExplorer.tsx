"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/en";

type JourneyMessages = Pick<Messages, "finderTitle" | "finderDestination" | "finderStyle" | "finderPlaces" | "finderStyles" | "finderAction" | "journeysEyebrow" | "journeysTitle" | "journeysText" | "allJourneys" | "tripNames" | "tripTexts" | "tripTags" | "tripDurations" | "tripAction" | "customQuote" | "englishContent"> & { planTripLabel: string };
const journeys = [
  { image: "katapana-desert", slug: "katpana-desert-skardu-highlights-tour", destination: 1, styles: [1, 2] },
  { image: "hunza-valley", slug: "hunza-skardu-grand-northern-tour", destination: 2, styles: [1, 2] },
  { image: "k2-base-camp", slug: "k2-base-camp-concordia-trek-planning", destination: 3, styles: [3] },
];

export default function JourneyExplorer({ locale, messages: t }: { locale: Locale; messages: JourneyMessages }) {
  const [destination, setDestination] = useState(0);
  const [style, setStyle] = useState(0);
  const [filter, setFilter] = useState({ destination: 0, style: 0 });
  const visible = journeys.map((journey, i) => ({ ...journey, index: i })).filter(journey => (!filter.destination || journey.destination === filter.destination) && (!filter.style || journey.styles.includes(filter.style)));
  const applyFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilter({ destination, style });
    const results = document.getElementById("journeys");
    results?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    results?.focus({ preventScroll: true });
  };
  const chooseJourney = (name: string) => window.dispatchEvent(new CustomEvent("katpana:journey-selected", { detail: name }));

  return <><section className="modern-finder modern-container" aria-labelledby="finder-title"><h2 id="finder-title">{t.finderTitle}</h2><form onSubmit={applyFilter}><label>{t.finderDestination}<select value={destination} onChange={e => setDestination(Number(e.target.value))}>{t.finderPlaces.map((label, i) => <option value={i} key={label}>{label}</option>)}</select></label><label>{t.finderStyle}<select value={style} onChange={e => setStyle(Number(e.target.value))}>{t.finderStyles.map((label, i) => <option value={i} key={label}>{label}</option>)}</select></label><button className="modern-button" type="submit">{t.finderAction}<span aria-hidden="true">↗</span></button></form></section>
    <section id="journeys" className="modern-section modern-container" tabIndex={-1} aria-labelledby="journeys-title"><div className="section-heading"><div><p className="modern-eyebrow">{t.journeysEyebrow}</p><h2 id="journeys-title">{t.journeysTitle}</h2></div><div className="section-heading-side"><p>{t.journeysText}</p><Link className="modern-text-link" href="/tours/" hrefLang="en">{t.allJourneys}<span aria-hidden="true">↗</span></Link>{locale !== "en" && <span className="content-language-note">{t.englishContent}</span>}</div></div>
      <div className="modern-journey-grid" aria-live="polite">{visible.map(journey => <article className="modern-journey-card" key={journey.slug}><a className="journey-photo" href={`/tours/${journey.slug}/`} hrefLang="en" aria-label={`${t.tripAction}: ${t.tripNames[journey.index]}`}><Image src={`/images/places/${journey.image}.jpg`} alt={t.tripNames[journey.index]} fill sizes="(max-width: 650px) 92vw, (max-width: 1000px) 45vw, 30vw" /><span className="journey-tag">{t.tripTags[journey.index]}</span><span className="journey-photo-arrow" aria-hidden="true">↗</span></a><div className="journey-card-copy"><p className="journey-duration">{t.tripDurations[journey.index]}</p><h3><a href={`/tours/${journey.slug}/`} hrefLang="en">{t.tripNames[journey.index]}</a></h3><p>{t.tripTexts[journey.index]}</p><div className="journey-card-bottom"><span>{t.customQuote}</span><a href="#plan-trip" aria-label={`${t.planTripLabel}: ${t.tripNames[journey.index]}`} onClick={() => chooseJourney(t.tripNames[journey.index])}>↗</a></div></div></article>)}</div>
      {visible.length === 0 && <div className="journey-empty"><p>{t.journeysText}</p><button type="button" className="modern-button" onClick={() => { setDestination(0); setStyle(0); setFilter({ destination: 0, style: 0 }); }}>{t.finderPlaces[0]} <span aria-hidden="true">↺</span></button></div>}
    </section></>;
}
