import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { getStaticTrendingArticle, staticTrendingArticles } from "@/data/trending-static";
import { absoluteUrl, breadcrumbSchema, createMetadata, faqSchema, jsonLdScript, organizationSchema } from "@/lib/seo";

interface TrendingArticlePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return staticTrendingArticles.map((article) => ({
    slug: article.slug
  }));
}

export function generateMetadata({ params }: TrendingArticlePageProps): Metadata {
  const article = getStaticTrendingArticle(params.slug);

  if (!article) {
    return createMetadata({
      title: `Trending Travel Article | ${BRAND_NAME}`,
      description: "Read Pakistan travel trends adapted for Skardu and Gilgit-Baltistan tourism. Explore now.",
      path: "/trending",
      image: "/images/places/katapana-desert.jpg",
      imageAlt: "Pakistan travel trends for Skardu tourism",
      keywords: ["Pakistan travel trends", "Skardu travel articles"]
    });
  }

  return createMetadata({
    title: `${compactTitle(article.title)} | ${BRAND_NAME}`,
    description: compactDescription(article.excerpt),
    path: `/trending/${article.slug}`,
    image: "/images/places/katapana-desert.jpg",
    imageAlt: `${article.trend_topic} Skardu travel article Gilgit-Baltistan`,
    keywords: article.keywords,
    type: "article"
  });
}

export default function TrendingArticlePage({ params }: TrendingArticlePageProps) {
  const article = getStaticTrendingArticle(params.slug);

  if (!article) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Trending", href: "/trending/" },
    { label: article.trend_topic, href: `/trending/${article.slug}/` }
  ];
  const wordCount = [article.excerpt, ...article.sections.map((section) => `${section.heading} ${section.body}`)].join(" ").split(/\s+/).length;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl("/images/places/katapana-desert.jpg"),
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      "@type": "Organization",
      name: `${BRAND_NAME} Editorial Team`,
      url: SITE_URL
    },
    publisher: organizationSchema(),
    mainEntityOfPage: absoluteUrl(`/trending/${article.slug}`),
    articleSection: "Trending travel",
    keywords: article.keywords.join(", "),
    wordCount,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p:first-of-type"]
    }
  };

  return (
    <main className="min-h-screen bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      {article.faqs.length ? <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(article.faqs))} /> : null}
      <PageHeader />
      <article className="px-4 pb-16 pt-28 sm:px-5 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-8">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">
              Trending topic: {article.trend_topic}
            </p>
            <h1 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-6xl md:text-7xl">
              {article.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-skardu-ash sm:mt-6 sm:text-xl sm:leading-9">{article.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1.5 text-skardu-void">
                {article.trend_rank ? `Trend #${article.trend_rank}` : "Travel trend"}
              </span>
              <span className="rounded-full border border-skardu-mist px-3 py-1.5 text-skardu-ash">{article.generation_date}</span>
              <span className="rounded-full border border-skardu-mist px-3 py-1.5 text-skardu-ash">{article.trend_geo}</span>
            </div>
          </div>

          <div className="mt-10 grid gap-8">
            {article.sections.map((section) => (
              <section key={section.heading} className="rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-4 sm:p-6">
                <h2 className="font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-4xl">{section.heading}</h2>
                <p className="mt-3 text-base leading-8 text-skardu-ash sm:text-lg sm:leading-9">{section.body}</p>
              </section>
            ))}
          </div>

          {article.faqs.length ? (
            <section className="mt-10 border-t border-skardu-mist pt-8">
              <h2 className="font-display text-3xl font-bold text-skardu-snow sm:text-4xl">Frequently asked questions</h2>
              <div className="mt-5 grid gap-4">
                {article.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-4 sm:p-5">
                    <summary className="cursor-pointer font-bold text-skardu-snow">{faq.question}</summary>
                    <p className="mt-3 leading-7 text-skardu-ash">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                {keyword}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/trending/" className="flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-skardu-teal">
              More trending articles
            </Link>
            <Link href="/#tours" className="flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-skardu-void">
              Plan your Skardu trip
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}

function compactTitle(value: string) {
  if (value.length <= 38) return value;
  return `${value.slice(0, 37).replace(/\s+\S*$/, "")} Guide`;
}

function compactDescription(value: string) {
  if (value.length <= 154) return value;
  return `${value.slice(0, 151).replace(/\s+\S*$/, "")}.`;
}
