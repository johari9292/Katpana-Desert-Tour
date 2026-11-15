"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { localePath, type Locale } from "@/lib/i18n/config";
import { en, type Messages } from "@/lib/i18n/en";

function MountainMark() {
  return <svg viewBox="0 0 48 40" fill="none" aria-hidden="true"><path d="m2 33 16-25 9 14 6-9 13 20H2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m12 18 6 3 5-5m5 5 5 4 4-5M7 38h34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

type NavMessages = Pick<Messages, "language" | "menu" | "close"> & { nav: readonly string[] };

export default function Nav({ locale = "en", messages = en }: { locale?: Locale; messages?: NavMessages }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const home = localePath(locale);
  const links = ["#journeys", "#destinations", "#our-approach", "/travel-guides/"];

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [open]);

  return (
    <header lang={locale} className="modern-header" dir={locale === "ur" || locale === "ar" || locale === "fa" ? "rtl" : "ltr"}>
      <nav className="modern-nav" aria-label={messages.menu}>
        <Link href={home} className="modern-brand" aria-label="Katpana Desert Tour"><MountainMark /><span>KATPANA<span className="brand-subtitle">DESERT TOUR</span></span></Link>
        <div className="modern-desktop-links">{links.map((href, i) => <Link key={href} href={href.startsWith("#") ? `${home}${href}` : localePath(locale, href)}>{messages.nav[i]}</Link>)}</div>
        <div className="modern-nav-actions">
          <LanguageSwitcher locale={locale} label={messages.language} />
          <Link className="modern-button modern-button-small nav-plan" href={`${home}#plan-trip`}>{messages.nav[4]} <span aria-hidden="true">↗</span></Link>
          <button ref={menuButton} className="modern-menu-button" type="button" aria-expanded={open} aria-controls="modern-mobile-menu" aria-label={open ? messages.close : messages.menu} onClick={() => setOpen(!open)}>{open ? <span aria-hidden="true">×</span> : <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5"/></svg>}</button>
        </div>
      </nav>
      {open && <nav id="modern-mobile-menu" className="modern-mobile-menu" aria-label={messages.menu}>{links.map((href, i) => <Link key={href} href={href.startsWith("#") ? `${home}${href}` : localePath(locale, href)} onClick={() => setOpen(false)}>{messages.nav[i]} <span aria-hidden="true">↗</span></Link>)}<Link className="modern-button" href={`${home}#plan-trip`} onClick={() => setOpen(false)}>{messages.nav[4]} <span aria-hidden="true">↗</span></Link></nav>}
    </header>
  );
}
