import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SEOGuidePage from "@/components/SEOGuidePage";
import { blogPages, getSeoPageBySlug } from "@/data/seo";
import { createSeoPageMetadata } from "@/lib/seo";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPages.map((page) => ({
    slug: page.slug
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug, "blog");
  return page
    ? createSeoPageMetadata(page)
    : {
        title: "Skardu Travel Blog",
        description: "Skardu and Gilgit-Baltistan travel blog."
      };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug, "blog");

  if (!page) {
    notFound();
  }

  return <SEOGuidePage page={page} />;
}
