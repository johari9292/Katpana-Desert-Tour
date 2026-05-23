import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SEOGuidePage from "@/components/SEOGuidePage";
import { blogPages, getSeoPageBySlug } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return blogPages.map((page) => ({
    slug: page.slug
  }));
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const page = getSeoPageBySlug(params.slug, "blog");
  return page
    ? createSeoPageMetadata(page)
    : {
        title: "Skardu Travel Blog",
        description: "Skardu and Gilgit-Baltistan travel blog."
      };
}

export default function BlogPage({ params }: BlogPageProps) {
  const page = getSeoPageBySlug(params.slug, "blog");

  if (!page) {
    notFound();
  }

  return <SEOGuidePage page={page} />;
}
