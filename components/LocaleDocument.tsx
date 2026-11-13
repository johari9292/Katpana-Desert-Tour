"use client";

import { useEffect } from "react";
import { localeInfo, type Locale } from "@/lib/i18n/config";

export default function LocaleDocument({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeInfo(locale).dir;
    return () => {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    };
  }, [locale]);
  return null;
}
