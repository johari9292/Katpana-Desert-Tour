import type { Metadata } from "next";
import { SITE_URL } from "@/constants/brand";
import { homepageAttractions, SKARDU_GEO } from "@/data/seo";
import { getMessages, locales, localePath, localeInfo, type Locale } from "@/lib/i18n";
import {
  absoluteUrl,
  createMetadata,
  defaultOgImage,
  ORGANIZATION_ID,
  organizationEntity,
  WEBSITE_ID,
  websiteEntity
} from "@/lib/seo";

export function homepageLanguageAlternates() {
  return {
    ...Object.fromEntries(locales.map(({ code }) => [code, absoluteUrl(localePath(code))])),
    "x-default": absoluteUrl("/")
  };
}

export function localizedHomepageMetadata(locale: Locale): Metadata {
  const { metaTitle: title, metaDescription: description, heroAlt: imageAlt } = getMessages(locale);
  const metadata = createMetadata({ title, description, imageAlt, path: localePath(locale) });

  return {
    ...metadata,
    alternates: {
      canonical: absoluteUrl(localePath(locale)),
      languages: homepageLanguageAlternates()
    },
    openGraph: {
      ...metadata.openGraph,
      locale: localeInfo(locale).ogLocale,
      alternateLocale: locales.filter(({ code }) => code !== locale).map(({ ogLocale }) => ogLocale),
      images: [{ url: absoluteUrl(defaultOgImage), alt: imageAlt }]
    },
    twitter: {
      ...metadata.twitter,
      images: [{ url: absoluteUrl(defaultOgImage), alt: imageAlt }]
    }
  };
}

export function localizedHomepageSchema(locale: Locale) {
  const { metaTitle: title, metaDescription: description } = getMessages(locale);
  const url = absoluteUrl(localePath(locale));
  const destinationId = `${SITE_URL}/#skardu-destination`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationEntity(),
      { ...websiteEntity(), inLanguage: locales.map(({ code }) => code) },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": destinationId },
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: locale
      },
      {
        "@type": "TouristDestination",
        "@id": destinationId,
        name: "Skardu, Gilgit-Baltistan, Pakistan",
        url: absoluteUrl("/destinations/"),
        geo: SKARDU_GEO,
        image: absoluteUrl(defaultOgImage),
        includesAttraction: homepageAttractions.map((attraction) => ({
          "@type": "TouristAttraction",
          "@id": `${absoluteUrl(new URL(attraction.url).pathname)}#attraction`,
          name: attraction.name,
          url: absoluteUrl(new URL(attraction.url).pathname),
          image: attraction.image
        }))
      }
    ]
  };
}
