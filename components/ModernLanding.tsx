import Image from "next/image";
import Link from "next/link";
import Nav from "./Nav";
import Footer from "./Footer";
import JourneyExplorer from "./JourneyExplorer";
import ModernEnquiry from "./ModernEnquiry";
import { getMessages, localeInfo, localePath, type Locale } from "@/lib/i18n";

const places = [
  { name: "Deosai National Park", image: "deosai-plains", slug: "deosai-national-park" },
  { name: "Upper Kachura Lake", image: "kachura-lakes", slug: "upper-kachura-lake" },
  { name: "Shigar Valley", image: "shigar-fort-valley", slug: "shigar-valley" },
  { name: "Katpana Desert", image: "katapana-desert", slug: "katpana-desert-skardu" },
];

export default function ModernLanding({ locale = "en" }: { locale?: Locale }) {
  const t = getMessages(locale);
  return (
    <div className="modern-site" lang={locale} dir={localeInfo(locale).dir}>
      <Nav locale={locale} messages={{ nav: [...t.nav], language: t.language, menu: t.menu, close: t.close }} />
      <main id="main-content" tabIndex={-1}>
        <section className="modern-hero" aria-labelledby="hero-title">
          <Image src="/images/katpana-skardu-hero.jpg" alt={t.heroAlt} fill priority sizes="100vw" className="modern-hero-image" />
          <div className="hero-shade" />
          <div className="modern-hero-content"><p className="modern-eyebrow hero-eyebrow"><span className="eyebrow-line" />{t.heroEyebrow}</p><h1 id="hero-title">{t.heroTitle}</h1><p className="hero-description">{t.heroText}</p><div className="hero-buttons"><a className="modern-button button-peach" href="#journeys">{t.heroPrimary}<span aria-hidden="true">↗</span></a><a className="hero-secondary" href="#plan-trip">{t.heroSecondary}<span aria-hidden="true">↗</span></a></div></div>
          <div className="hero-bottom"><p><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>{t.heroLocation}</p><a href="#journeys" aria-label={t.heroPrimary}>↓</a></div>
        </section>
        <div className="modern-trust modern-container">{t.trust.map((item, i) => <p key={item}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">{i === 0 ? <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" stroke="currentColor" strokeWidth="1.4"/><path d="M9 3v15m6-12v15" stroke="currentColor" strokeWidth="1.4"/></> : i === 1 ? <><path d="M4 7h16v14H4V7Zm4 0V3h8v4" stroke="currentColor" strokeWidth="1.4"/><path d="M8 11v6m8-6v6" stroke="currentColor" strokeWidth="1.4"/></> : <><path d="M4 13v-2a8 8 0 0 1 16 0v6a4 4 0 0 1-4 4h-3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 11H2v6h5v-6H4Zm16 0h2v6h-5v-6h3Z" stroke="currentColor" strokeWidth="1.4"/></>}</svg>{item}</p>)}</div>
        <JourneyExplorer locale={locale} messages={{ finderTitle: t.finderTitle, finderDestination: t.finderDestination, finderStyle: t.finderStyle, finderPlaces: [...t.finderPlaces], finderStyles: [...t.finderStyles], finderAction: t.finderAction, journeysEyebrow: t.journeysEyebrow, journeysTitle: t.journeysTitle, journeysText: t.journeysText, allJourneys: t.allJourneys, tripNames: [...t.tripNames], tripTexts: [...t.tripTexts], tripTags: [...t.tripTags], tripDurations: [...t.tripDurations], tripAction: t.tripAction, customQuote: t.customQuote, englishContent: t.englishContent, planTripLabel: t.nav[4] }} />
        <section id="destinations" className="modern-section modern-destinations modern-container" aria-labelledby="destinations-title"><div className="section-heading"><div><p className="modern-eyebrow">{t.placesEyebrow}</p><h2 id="destinations-title">{t.placesTitle}</h2></div><div className="section-heading-side"><p>{t.placesText}</p></div></div><div className="destination-editorial-grid">{places.map((place, i) => <Link key={place.slug} href={localePath(locale, `/destinations/${place.slug}/`)} hrefLang={locale} className={`modern-destination destination-${i}`}><Image src={`/images/places/${place.image}.jpg`} alt={place.name} fill sizes="(max-width: 600px) 85vw, (max-width: 1000px) 46vw, 26vw" /><span className="destination-shade" /><div><p>{t.placeLabels[i]}</p><h3>{place.name}</h3></div><span className="destination-arrow" aria-hidden="true">↗</span></Link>)}</div></section>
        <section id="our-approach" className="modern-approach" aria-labelledby="approach-title"><div className="modern-container approach-grid"><div className="approach-images"><div className="approach-photo"><Image src="/images/places/khaplu-palace.jpg" alt="Historic Khaplu Palace in Baltistan" fill sizes="(max-width: 750px) 80vw, 40vw" /></div><div className="approach-small-photo"><Image src="/images/places/kachura-lakes.jpg" alt="Mountain scenery at Kachura Lakes" fill sizes="(max-width: 750px) 40vw, 20vw" /></div><span className="approach-coordinate" aria-hidden="true">BALTISTAN, PAKISTAN · 35° N</span></div><div className="approach-copy"><p className="modern-eyebrow">{t.approachEyebrow}</p><h2 id="approach-title">{t.approachTitle}</h2><p>{t.approachText}</p><ul>{t.approachPoints.map(point => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul><Link className="modern-text-link" href={localePath(locale, "/about/")}>{t.approachAction}<span aria-hidden="true">↗</span></Link></div></div></section>
        <section className="modern-section modern-container guide-section" aria-labelledby="guides-title"><div className="guide-intro"><p className="modern-eyebrow">{t.guideEyebrow}</p><h2 id="guides-title">{t.guideTitle}</h2><p>{t.guideText}</p></div><div className="modern-guide-list">{["/skardu-travel-guide/", "/international-pakistan-tours/", "/pakistan-trekking-guide/"].map((href, i) => <Link key={href} href={localePath(locale, href)} hrefLang={locale}><span className="guide-number" aria-hidden="true">0{i + 1}</span><h3>{t.guideLinks[i]}</h3><span aria-hidden="true">↗</span></Link>)}</div></section>
        <section className="modern-faq modern-container" aria-labelledby="faq-title"><h2 id="faq-title">{t.faqTitle}</h2><div>{t.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
        <section id="plan-trip" className="modern-enquiry-section" aria-labelledby="enquiry-title"><div className="modern-container enquiry-grid"><div><p className="modern-eyebrow">{t.enquiryEyebrow}</p><h2 id="enquiry-title">{t.enquiryTitle}</h2><p>{t.enquiryText}</p><a className="enquiry-phone" href="tel:+923430249240" dir="ltr">+92 343 024 9240 <span aria-hidden="true">↗</span></a><div className="enquiry-mountain" aria-hidden="true"><svg viewBox="0 0 400 150" fill="none"><path d="m0 145 70-80 25 30 65-90 80 105 50-70 110 105M110 74l29 14 21-28 28 22 18-19M250 96l40 10 16-20" stroke="currentColor" strokeWidth="1"/></svg></div></div><ModernEnquiry locale={locale} messages={t.form} /></div></section>
      </main><Footer locale={locale} />
    </div>
  );
}
