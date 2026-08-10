import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { WHATSAPP_MAIN } from "@/constants/contact";
import { type RelatedLink, type SEOPage } from "@/data/seo";
import { imageAltFor } from "@/lib/image-alt";

export const defaultOgImage = "/images/katpana-skardu-hero.jpg";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function canonicalPath(path: string) {
  if (!path || path === "/") return "/";
  const cleanPath = `/${path.replace(/^\/+|\/+$/g, "")}`;
  return /\.[a-z0-9]+$/i.test(cleanPath) ? cleanPath : `${cleanPath}/`;
}

export function absoluteUrl(path: string) {
  const cleanPath = canonicalPath(path);
  return cleanPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${cleanPath}`;
}

export function robotsMetadata(index = true): Metadata["robots"] {
  return {
    index,
    follow: true,
    googleBot: {
      index,
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
  type = "website",
  index = true
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt: string;
  type?: "website" | "article" | "profile";
  index?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const resolvedImageAlt = imageAltFor(image, imageAlt);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND_NAME,
      images: [
        {
          url: imageUrl,
          alt: resolvedImageAlt
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
    robots: robotsMetadata(index)
  };
}

export function createSeoPageMetadata(page: SEOPage): Metadata {
  return createMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    image: page.image,
    imageAlt: page.imageAlt,
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
  const currentPage = items.at(-1);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(currentPage ? { "@id": `${absoluteUrl(currentPage.href)}#breadcrumb` } : {}),
    itemListElement: breadcrumbItems(items)
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    ...organizationEntity()
  };
}

export function organizationEntity() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: BRAND_NAME,
    url: SITE_URL,
    description:
      "Local trip planning for private Skardu tours, Karakoram itineraries, 4x4 routes, and guided trekking logistics in northern Pakistan.",
    telephone: WHATSAPP_MAIN,
    image: absoluteUrl(defaultOgImage),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: WHATSAPP_MAIN,
      contactType: "reservations"
    }
  };
}

export function websiteEntity() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: BRAND_NAME,
    url: SITE_URL,
    inLanguage: "en",
    publisher: {
      "@id": ORGANIZATION_ID
    }
  };
}

export function seoArticleSchema(page: SEOPage) {
  const bodyText = [page.excerpt, ...page.sections.map((section) => `${section.heading} ${section.body}`)].join(" ");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(page.path)}#article`,
    headline: page.title,
    description: page.excerpt,
    image: absoluteUrl(page.image),
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: absoluteUrl("/about")
    },
    publisher: organizationEntity(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(page.path)
    },
    isPartOf: {
      "@id": WEBSITE_ID
    },
    inLanguage: "en",
    articleSection: page.category,
    wordCount: bodyText.trim().split(/\s+/).length
  };
}

export function seoDestinationSchema(page: SEOPage) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${absoluteUrl(page.path)}#destination`,
    name: page.title,
    description: page.excerpt,
    url: absoluteUrl(page.path),
    image: absoluteUrl(page.image),
    touristType: ["Adventure travellers", "Cultural travellers", "Nature travellers"]
  };
}
