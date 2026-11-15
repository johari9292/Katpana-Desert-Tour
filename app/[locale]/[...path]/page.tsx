import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/constants/brand";
import { isLocale, locales, localeInfo, localePath } from "@/lib/i18n/config";
import { innerRoutes, innerRoute } from "@/lib/i18n/page-registry";
import { loadTranslation, translateServerTree } from "@/lib/i18n/server-localization";
import { translateText, type Translation } from "@/lib/i18n/translate";
import { pageLanguageAlternates } from "@/lib/i18n/alternates";
import { jsonLdScript } from "@/lib/seo";
import clientKeys from "@/data/translations/client-keys.json";

export const dynamicParams = false;
type Props = { params: Promise<{ locale: string; path: string[] }> };
const paths = ["/", ...innerRoutes().map((route) => route.path)];

export function generateStaticParams() {
  return locales.filter(({ code }) => code !== "en").flatMap(({ code }) =>
    innerRoutes().map((route) => ({ locale: code, path: route.path.slice(1).split("/") }))
  );
}
async function resolve({ params }: Props) {
  const { locale, path } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  const route = innerRoute("/" + path.join("/"));
  if (!route) notFound();
  return { locale, route, translation: loadTranslation(locale, paths), props: { params: Promise.resolve({ slug: route.slug }) } };
}
function localizedMetadata(value: unknown, translation: Translation, key = ""): unknown {
  if (typeof value === "string") return ["title", "description", "alt"].includes(key) ? translateText(value, translation) : value;
  if (Array.isArray(value)) return value.map((item) => localizedMetadata(item, translation, key));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, localizedMetadata(item, translation, name)]));
  return value;
}
export async function generateMetadata(input: Props): Promise<Metadata> {
  const { locale, route, translation, props } = await resolve(input);
  const original = route.module.generateMetadata ? await route.module.generateMetadata(props) : route.module.metadata || {};
  const metadata = localizedMetadata(original, translation) as Metadata;
  const canonicalSource = String(original.alternates?.canonical || SITE_URL + route.path);
  const sourcePath = new URL(canonicalSource, SITE_URL).pathname;
  const url = SITE_URL + localePath(locale, sourcePath);
  return {
    ...metadata,
    alternates: { canonical: url, languages: pageLanguageAlternates(sourcePath) },
    openGraph: { ...metadata.openGraph, url, locale: localeInfo(locale).ogLocale,
      alternateLocale: locales.filter(({ code }) => code !== locale).map(({ ogLocale }) => ogLocale) },
    // Never index a temporary English fallback while a dictionary is being prepared.
    ...(!translation.complete ? { robots: { index: false, follow: true } } : {})
  };
}
export default async function LocalizedInnerPage(input: Props) {
  const { locale, route, translation, props } = await resolve(input);
  const clientDictionary = Object.fromEntries(clientKeys.filter((key) => translation.dictionary[key]).map((key) => [key, translation.dictionary[key]]));
  const content = await translateServerTree(await route.module.default(props), translation, clientDictionary);
  const metadata = await generateMetadata(input);
  const url = SITE_URL + localePath(locale, route.path);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript({
      "@context": "https://schema.org", "@type": "WebPage", "@id": url + "#webpage", url,
      name: metadata.title, description: metadata.description, inLanguage: locale
    })} />
    {content}
  </>;
}
