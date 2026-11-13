import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SEOGuidePage from "@/components/SEOGuidePage";
import { getSeoPageBySlug, trekPages } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

interface TrekPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return trekPages.map((page) => ({
    slug: page.slug
  }));
}

export async function generateMetadata({ params }: TrekPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug, "trek");
  return page
    ? createSeoPageMetadata(page)
    : {
        title: "Pakistan Trekking Guide",
        description: "Northern Pakistan trekking guide."
      };
}

export default async function TrekPage({ params }: TrekPageProps) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug, "trek");

  if (!page) {
    notFound();
  }

  return <SEOGuidePage page={page} />;
}
