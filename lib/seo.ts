import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { displayPhone } from "@/constants/contact";
import { SKARDU_GEO, type RelatedLink, type SEOFaq, type SEOPage } from "@/data/seo";

export const defaultOgImage = "/images/katpana-skardu-hero.png";

export function canonicalPath(path: string) {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

export function absoluteUrl(path: string) {
  const cleanPath = canonicalPath(path);
  return cleanPath === "/" ? SITE_URL : `${SITE_URL}${cleanPath}`;
}

export function languageAlternates(path: string) {
  const url = absoluteUrl(path);
  return {
    en: url,
    "en-GB": url,
    "en-AU": url,
    "en-US": url,
    de: url,
    fr: url,
    ar: url,
    ur: url,
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

  return {
    title,
    description,
    keywords,
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
      type
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    robots: robotsMetadata()
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
    areaServed: ["Skardu", "Gilgit-Baltistan", "Hunza", "Deosai", "Karakoram"],
    priceRange: "$$",
    currenciesAccepted: "PKR, USD",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: displayPhone,
      contactType: "tour booking",
      availableLanguage: ["English", "Urdu"]
    }
  };
}

export function websiteSearchSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
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
