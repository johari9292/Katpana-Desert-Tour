import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { displayPhone } from "@/constants/contact";
import { SKARDU_GEO, type RelatedLink, type SEOFaq, type SEOPage } from "@/data/seo";

export const defaultOgImage = "/images/katpana-skardu-hero.jpg";

const globalKeywords = [
  "Katpana Desert Tour",
  "Pakistan tours for international travelers",
  "Pakistan tours from USA",
  "Pakistan tours from UK",
  "Pakistan tours from Europe",
  "Pakistan tours from Canada",
  "Pakistan tours from Australia",
  "Skardu tours for foreigners",
  "private Pakistan tours",
  "Pakistan travel agency",
  "international Pakistan travel",
  "Skardu tours",
  "Skardu travel",
  "Skardu travel guide",
  "Katpana Desert Skardu",
  "Cold Desert Skardu",
  "Gilgit-Baltistan tourism",
  "Gilgit Baltistan tours",
  "Pakistan tours",
  "Pakistan travel guide",
  "Northern Pakistan travel",
  "Karakoram travel",
  "K2 base camp trek",
  "Deosai National Park",
  "Hunza Skardu itinerary",
  "Skardu hotels",
  "Skardu rent a car",
  "Skardu tour packages"
];

const worldwideServiceAreas = [
  "Worldwide",
  "United States",
  "United Kingdom",
  "Europe",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Singapore",
  "Malaysia",
  "Pakistan"
];

export function canonicalPath(path: string) {
  if (!path || path === "/") return "/";
  const cleanPath = `/${path.replace(/^\/+|\/+$/g, "")}`;
  return /\.[a-z0-9]+$/i.test(cleanPath) ? cleanPath : `${cleanPath}/`;
}

export function absoluteUrl(path: string) {
  const cleanPath = canonicalPath(path);
  return cleanPath === "/" ? SITE_URL : `${SITE_URL}${cleanPath}`;
}

export function languageAlternates(path: string) {
  const url = absoluteUrl(path);
  return {
    en: url,
    "en-US": url,
    "en-GB": url,
    "en-CA": url,
    "en-AU": url,
    "en-PK": url,
    "x-default": url
  };
}

export function robotsMetadata(): Metadata["robots"] {
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  };
}

export function createMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  imageAlt,
  keywords = [],
  type = "website"
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const mergedKeywords = Array.from(new Set([...keywords, ...globalKeywords]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical,
      languages: languageAlternates(path)
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt
        }
      ],
      locale: "en_US",
      alternateLocale: ["en_GB", "en_CA", "en_AU", "en_PK"],
      type
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    robots: robotsMetadata(),
    classification: "Travel agency, Pakistan tour operator, Skardu travel guide",
    other: {
      "geo.region": "PK-GB",
      "geo.placename": "Skardu, Gilgit-Baltistan, Pakistan",
      "travel.region": "Skardu, Gilgit-Baltistan, Karakoram, Northern Pakistan",
      "audience": "International travelers, foreign tourists, families, trekkers, photographers"
    }
  };
}

export function createSeoPageMetadata(page: SEOPage): Metadata {
  return createMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    image: page.image,
    imageAlt: page.imageAlt,
    keywords: page.keywords,
    type: page.category === "blog" || page.category === "trek" ? "article" : "website"
  });
}

export function jsonLdScript(schema: unknown) {
  return {
    __html: JSON.stringify(schema)
  };
}

export function breadcrumbItems(items: RelatedLink[]) {
  return items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    item: absoluteUrl(item.href)
  }));
}

export function breadcrumbSchema(items: RelatedLink[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems(items)
  };
}

export function faqSchema(faqs: SEOFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: BRAND_NAME,
    url: SITE_URL,
    telephone: displayPhone,
    image: absoluteUrl(defaultOgImage),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Skardu",
      addressRegion: "Gilgit-Baltistan",
      addressCountry: "PK"
    },
    geo: SKARDU_GEO,
    areaServed: [
      ...worldwideServiceAreas,
      "Skardu",
      "Gilgit-Baltistan",
      "Hunza",
      "Deosai",
      "Karakoram",
      "Northern Pakistan"
    ],
    knowsAbout: [
      "Skardu travel planning",
      "Pakistan tours for international travelers",
      "K2 base camp trekking",
      "Gilgit-Baltistan tourism",
      "Karakoram Highway road trips",
      "Deosai National Park jeep safaris",
      "Skardu hotels and private transport"
    ],
    priceRange: "$$",
    currenciesAccepted: "PKR, USD",
    availableLanguage: ["English", "Urdu"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: displayPhone,
      contactType: "tour booking",
      areaServed: worldwideServiceAreas,
      availableLanguage: ["English", "Urdu"]
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Pakistan and Skardu tour planning services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "International Pakistan tour planning"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Skardu private tour packages"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "K2 base camp trekking logistics"
          }
        }
      ]
    }
  };
}

export function websiteSearchSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function seoArticleSchema(page: SEOPage) {
  const bodyText = [page.excerpt, ...page.sections.map((section) => `${section.heading} ${section.body}`)].join(" ");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.excerpt,
    image: absoluteUrl(page.image),
    datePublished: "2026-05-23",
    dateModified: "2026-05-23",
    author: {
      "@type": "Organization",
      name: page.author,
      url: SITE_URL
    },
    publisher: organizationSchema(),
    mainEntityOfPage: absoluteUrl(page.path),
    articleSection: page.category,
    keywords: page.keywords.join(", "),
    wordCount: bodyText.split(/\s+/).length,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p:first-of-type"]
    }
  };
}

export function seoDestinationSchema(page: SEOPage) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: page.title,
    description: page.excerpt,
    url: absoluteUrl(page.path),
    image: absoluteUrl(page.image),
    geo: SKARDU_GEO,
    touristType: ["Adventure", "Cultural", "Eco"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Skardu",
      addressRegion: "Gilgit-Baltistan",
      addressCountry: "PK"
    }
  };
}
