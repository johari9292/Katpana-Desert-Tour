"use client";

import { useId } from "react";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({ locale = "en", label = "Language" }: { locale?: Locale; label?: string }) {
  const id = useId();

  return (
    <label className="language-switcher" htmlFor={id}>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" /></svg>
      <span className="sr-only">{label}</span>
      <select id={id} value={locale} aria-label={label} onChange={(event) => {
        if (isLocale(event.target.value)) window.location.assign(localePath(event.target.value));
      }}>
        {locales.map((item) => <option key={item.code} value={item.code} lang={item.code}>{item.name}</option>)}
      </select>
    </label>
  );
}
