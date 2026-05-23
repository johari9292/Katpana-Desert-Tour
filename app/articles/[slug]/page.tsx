import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { articles, getArticleBySlug, getRelatedArticles } from "@/data/articles";

const siteUrl = "https://katpanadesert.com";

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

  return {
    title: `${article.title} | Skardu Gilgit Baltistan Guide`,
    description: article.excerpt,
    keywords: article.keywords,
    alternates: {
      canonical: `/articles/${article.slug}/`
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${siteUrl}/articles/${article.slug}/`,
      siteName: "Katpana Desert Tours",
      type: "article",
      publishedTime: "2026-05-22",
      modifiedTime: article.updatedAt,
      authors: ["Katpana Desert Tours"],
      images: [
        {
          url: "/images/katpana-skardu-hero.png",
          width: 1536,
          height: 1024,
          alt: `${article.title} in Skardu and Gilgit Baltistan`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ["/images/katpana-skardu-hero.png"]
    }
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 3);
  const articleUrl = `${siteUrl}/articles/${article.slug}/`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${siteUrl}/images/katpana-skardu-hero.png`,
    datePublished: "2026-05-22",
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "Katpana Desert Tours"
    },
    publisher: {
      "@type": "Organization",
      name: "Katpana Desert Tours",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/katpana-skardu-hero.png`
      }
    },
    mainEntityOfPage: articleUrl,
    articleSection: article.category,
    keywords: article.keywords.join(", ")
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: `${siteUrl}/articles/`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]">
          <div>
            <Link href="/articles/" className="text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
              Back to articles
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{article.category}</span>
              <span className="text-skardu-ash">{article.readTime}</span>
              <span className="text-skardu-ash">Updated May 22, 2026</span>
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">{article.title}</h1>
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
