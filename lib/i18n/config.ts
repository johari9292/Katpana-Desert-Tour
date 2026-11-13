export const locales = [
  { code: "en", name: "English", dir: "ltr", href: "/", ogLocale: "en_GB" },
  { code: "ur", name: "اردو", dir: "rtl", href: "/ur/", ogLocale: "ur_PK" },
  { code: "ar", name: "العربية", dir: "rtl", href: "/ar/", ogLocale: "ar_SA" },
  { code: "hi", name: "हिन्दी", dir: "ltr", href: "/hi/", ogLocale: "hi_IN" },
  { code: "zh", name: "中文", dir: "ltr", href: "/zh/", ogLocale: "zh_CN" },
  { code: "es", name: "Español", dir: "ltr", href: "/es/", ogLocale: "es_ES" },
  { code: "fr", name: "Français", dir: "ltr", href: "/fr/", ogLocale: "fr_FR" },
  { code: "de", name: "Deutsch", dir: "ltr", href: "/de/", ogLocale: "de_DE" },
  { code: "it", name: "Italiano", dir: "ltr", href: "/it/", ogLocale: "it_IT" },
  { code: "pt", name: "Português", dir: "ltr", href: "/pt/", ogLocale: "pt_PT" },
  { code: "ru", name: "Русский", dir: "ltr", href: "/ru/", ogLocale: "ru_RU" },
  { code: "ja", name: "日本語", dir: "ltr", href: "/ja/", ogLocale: "ja_JP" },
  { code: "ko", name: "한국어", dir: "ltr", href: "/ko/", ogLocale: "ko_KR" },
  { code: "tr", name: "Türkçe", dir: "ltr", href: "/tr/", ogLocale: "tr_TR" },
  { code: "fa", name: "فارسی", dir: "rtl", href: "/fa/", ogLocale: "fa_IR" },
  { code: "bn", name: "বাংলা", dir: "ltr", href: "/bn/", ogLocale: "bn_BD" },
  { code: "id", name: "Bahasa Indonesia", dir: "ltr", href: "/id/", ogLocale: "id_ID" },
  { code: "ms", name: "Bahasa Melayu", dir: "ltr", href: "/ms/", ogLocale: "ms_MY" },
  { code: "th", name: "ไทย", dir: "ltr", href: "/th/", ogLocale: "th_TH" },
  { code: "vi", name: "Tiếng Việt", dir: "ltr", href: "/vi/", ogLocale: "vi_VN" },
] as const;

export type Locale = (typeof locales)[number]["code"];

export function isLocale(value: string): value is Locale {
  return locales.some(({ code }) => code === value);
}

export function localePath(locale: Locale): string {
  return locale === "en" ? "/" : `/${locale}/`;
}

export function localeInfo(locale: Locale) {
  return locales.find(({ code }) => code === locale)!;
}
