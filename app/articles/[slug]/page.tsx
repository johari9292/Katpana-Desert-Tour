import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { articles, getArticleBySlug, getRelatedArticles } from "@/data/articles";
import { absoluteUrl, breadcrumbSchema, createMetadata, faqSchema, jsonLdScript, organizationSchema } from "@/lib/seo";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug
  }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Skardu Travel Article",
      description: "Skardu and Gilgit Baltistan travel article."
    };
  }

  return createMetadata({
    title: `${article.primaryKeyword} | ${BRAND_NAME}`,
    description: article.excerpt.slice(0, 152),
    path: `/articles/${article.slug}`,
    imageAlt: `${article.title} in Skardu and Gilgit-Baltistan Pakistan`,
    keywords: article.keywords,
    type: "article"
  });
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 3);
  const articleUrl = absoluteUrl(`/articles/${article.slug}`);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles/" },
    { label: article.primaryKeyword, href: `/articles/${article.slug}/` }
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${SITE_URL}/images/katpana-skardu-hero.png`,
    datePublished: "2026-05-22",
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "Katpana Desert Tour Local Planning Team",
      url: SITE_URL
    },
    publisher: organizationSchema(),
    mainEntityOfPage: articleUrl,
    articleSection: article.category,
    keywords: article.keywords.join(", "),
    wordCount: [article.excerpt, ...article.sections.map((section) => section.body)].join(" ").split(/\s+/).length,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p:first-of-type"]
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(article.faqs))} />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{article.category}</span>
              <span className="text-skardu-ash">{article.readTime}</span>
              <span className="text-skardu-ash">Updated May 22, 2026</span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{article.title}</h1>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-skardu-ash">
              Written by Katpana Desert Tour Local Planning Team
            </p>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{article.excerpt}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {article.highlights.map((highlight) => (
                <p key={highlight} className="rounded-2xl border border-skardu-mist bg-skardu-stone/70 p-5 text-sm leading-6 text-skardu-ash">
                  {highlight}
                </p>
              ))}
            </div>

            <div className="mt-12 grid gap-10">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow">{section.heading}</h2>
                  <p className="mt-4 text-lg leading-9 text-skardu-ash">{section.body}</p>
                </section>
              ))}
            </div>

            <section className="mt-12 border-t border-skardu-mist pt-10">
              <h2 className="font-display text-4xl font-bold text-skardu-snow">Frequently asked questions</h2>
              <div className="mt-6 grid gap-4">
                {article.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                    <summary className="cursor-pointer font-bold text-skardu-snow">{faq.question}</summary>
                    <p className="mt-3 leading-7 text-skardu-ash">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Article keywords</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Related guides</h2>
              <div className="mt-5 grid gap-4">
                {relatedArticles.map((related) => (
                  <Link key={related.slug} href={`/articles/${related.slug}/`} className="block border-t border-skardu-mist pt-4 first:border-t-0 first:pt-0">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-skardu-gold">{related.category}</span>
                    <span className="mt-2 block font-bold leading-snug text-skardu-snow">{related.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/#hotels"
              className="mt-5 block rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
            >
              Plan this trip
            </Link>
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}
