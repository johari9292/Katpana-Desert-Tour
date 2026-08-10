import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME } from "@/constants/brand";
import { articles, getArticleBySlug, getRelatedArticles, isReviewedArticle } from "@/data/articles";
import { absoluteUrl, breadcrumbSchema, createMetadata, jsonLdScript, organizationEntity, WEBSITE_ID } from "@/lib/seo";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return createMetadata({
      title: `Travel Article Not Found | ${BRAND_NAME}`,
      description: "This travel article is unavailable. Browse the reviewed Skardu and Karakoram guide library.",
      path: "/articles",
      imageAlt: "Katpana Desert dunes beneath the Karakoram mountains near Skardu",
      index: false
    });
  }

  return createMetadata({
    title: `${article.primaryKeyword} | ${BRAND_NAME}`,
    description: article.excerpt.slice(0, 152),
    path: `/articles/${article.slug}`,
    imageAlt: "Katpana Desert dunes beneath the Karakoram mountains near Skardu",
    type: "article",
    index: isReviewedArticle(article)
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

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

  const reviewed = isReviewedArticle(article);
  const articleSchema = reviewed ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    dateModified: article.reviewedAt,
    author: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: absoluteUrl("/about")
    },
    publisher: organizationEntity(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl
    },
    isPartOf: {
      "@id": WEBSITE_ID
    },
    inLanguage: "en",
    isAccessibleForFree: true,
    articleSection: article.category,
    wordCount: [article.excerpt, ...article.sections.map((section) => section.body)].join(" ").trim().split(/\s+/).length
  } : null;

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      {articleSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleSchema)} /> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{article.category}</span>
              <span className="text-skardu-ash">{article.readTime}</span>
              {reviewed && article.reviewedAt ? (
                <time className="text-skardu-ash" dateTime={article.reviewedAt}>
                  Locally reviewed {formatArticleDate(article.reviewedAt)}
                </time>
              ) : (
                <span className="text-skardu-ash">Editorial draft</span>
              )}
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{article.title}</h1>
            {reviewed ? (
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-skardu-ash">
                Reviewed by {article.reviewedBy}
              </p>
            ) : (
              <p className="mt-5 rounded-2xl border border-skardu-gold/70 bg-skardu-gold/10 p-4 text-sm leading-6 text-skardu-snow">
                This planning draft is excluded from search results until a named local route specialist verifies its
                access, season, safety and logistics claims.
              </p>
            )}
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

function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
}
