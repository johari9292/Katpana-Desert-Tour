import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageBySlug, trekPages } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

interface TrekPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return trekPages.map((page) => ({
    slug: page.slug
  }));
}

export function generateMetadata({ params }: TrekPageProps): Metadata {
  const page = getSeoPageBySlug(params.slug, "trek");
  return page
    ? createSeoPageMetadata(page)
    : {
        title: "Pakistan Trekking Guide",
        description: "Northern Pakistan trekking guide."
      };
}

export default function TrekPage({ params }: TrekPageProps) {
  const page = getSeoPageBySlug(params.slug, "trek");

  if (!page) {
    notFound();
  }

  return <SEOGuidePage page={page} />;
}
