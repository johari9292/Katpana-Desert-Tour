import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME } from "@/constants/brand";
import { getStaticTrendingArticle, staticTrendingArticles } from "@/data/trending-static";
import { isTrendingReviewCurrent } from "@/data/trending";
import { absoluteUrl, breadcrumbSchema, createMetadata, jsonLdScript, organizationEntity } from "@/lib/seo";

interface TrendingArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Karachi"
});

const EMPTY_ARCHIVE_SLUG = "__editorial-archive-empty";

export const dynamicParams = false;

export function generateStaticParams() {
  const approvedParams = staticTrendingArticles.map((article) => ({ slug: article.slug }));

  return approvedParams.length ? approvedParams : [{ slug: EMPTY_ARCHIVE_SLUG }];
}

export async function generateMetadata({ params }: TrendingArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getStaticTrendingArticle(slug);

  if (!article) {
    const fallback = createMetadata({
      title: `Travel Update Not Found | ${BRAND_NAME}`,
      description: "This travel update is unavailable. Browse verified Skardu and Karakoram planning information.",
      path: "/trending",
      image: "/images/places/katapana-desert.jpg",
      imageAlt: "Katpana Cold Desert near Skardu"
    });

    return { ...fallback, robots: { index: false, follow: true } };
  }

  const articleMetadata = createMetadata({
    title: `${compactTitle(article.title)} | ${BRAND_NAME}`,
    description: compactDescription(article.excerpt),
    path: `/trending/${article.slug}`,
    image: "/images/places/katapana-desert.jpg",
    imageAlt: "Katpana Cold Desert dunes with Karakoram mountains near Skardu",
    type: "article"
  });

  return isReviewOverdue(article.next_review_at)
    ? { ...articleMetadata, robots: { index: false, follow: true } }
    : articleMetadata;
}

export default async function TrendingArticlePage({ params }: TrendingArticlePageProps) {
  const { slug } = await params;
  const article = getStaticTrendingArticle(slug);
  if (!article) notFound();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Travel updates", href: "/trending/" },
    { label: article.title, href: `/trending/${article.slug}/` }
  ];
  const wordCount = [article.excerpt, ...article.sections.map((section) => `${section.heading} ${section.body}`)]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl("/images/places/katapana-desert.jpg"),
    datePublished: article.published_at,
    dateModified: article.updated_at || article.reviewed_at,
    expires: article.next_review_at,
    author: organizationEntity(),
    editor: {
      "@type": "Person",
      name: article.reviewed_by
    },
    publisher: organizationEntity(),
    mainEntityOfPage: absoluteUrl(`/trending/${article.slug}`),
    articleSection: article.content_cluster,
    about: {
      "@type": "Thing",
      name: article.primary_query
    },
    citation: article.citations.map((source) => source.url),
    wordCount
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <PageHeader />
      <article className="px-4 pb-16 pt-28 sm:px-5 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} />

          <header className="mt-8">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">
              Skardu travel update<span className="hidden">
              {article.content_cluster} · {article.search_intent}
              </span>
            </p>
            <h1 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-6xl md:text-7xl">
              {article.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-skardu-ash sm:mt-6 sm:text-xl sm:leading-9">{article.excerpt}</p>
            <dl className="glass-panel mt-6 grid gap-3 rounded-2xl p-4 text-sm sm:grid-cols-3 sm:p-5">
              <Fact label="Published" value={formatDate(article.published_at)} />
              <Fact label="Updated" value={formatDate(article.last_verified_at)} />
              <Fact label="Read time" value={`${Math.max(1, Math.ceil(wordCount / 200))} min`} />
            </dl>
          </header>

          <aside className="glass-panel mt-8 rounded-2xl p-5 sm:p-6" aria-labelledby="travel-note-heading">
            <h2 id="travel-note-heading" className="font-display text-2xl font-bold text-skardu-snow">A quick note for your trip</h2>
            <p className="mt-3 leading-7 text-skardu-ash">
              Use this update to plan your route, timing and next steps around Skardu.
            </p>
            <p className="mt-3 text-sm leading-6 text-skardu-ash">
              Mountain conditions can change quickly. Confirm important road, flight, permit, weather and safety details close to departure.
            </p>
          </aside>

          <div className="glass-panel mt-10 grid gap-8 rounded-3xl p-5 sm:p-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-4xl">{section.heading}</h2>
                <p className="mt-3 whitespace-pre-line text-base leading-8 text-skardu-ash sm:text-lg sm:leading-9">{section.body}</p>
              </section>
            ))}
          </div>

          {article.faqs.length ? (
            <section className="mt-10 border-t border-skardu-mist pt-8">
              <h2 className="font-display text-3xl font-bold text-skardu-snow sm:text-4xl">Traveler questions</h2>
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

          <section className="mt-10 border-t border-skardu-mist pt-8" aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="font-display text-3xl font-bold text-skardu-snow sm:text-4xl">Useful links</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-5">
                <h3 className="text-lg font-bold text-skardu-snow">Further reading</h3>
                <ol className="mt-4 grid gap-4">
                  {article.citations.map((source, index) => (
                    <li key={source.id} className="text-sm leading-6 text-skardu-ash">
                      <span className="font-bold text-skardu-snow">{index + 1}. {source.publisher}: </span>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-skardu-teal underline decoration-skardu-teal/50 underline-offset-4">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="hidden rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-5">
                <h3 className="text-lg font-bold text-skardu-snow">Local evidence</h3>
                <ul className="mt-4 grid gap-4">
                  {article.local_evidence.map((evidence) => (
                    <li key={evidence.id} className="text-sm leading-6 text-skardu-ash">
                      <span className="font-bold text-skardu-snow">{evidence.location} · {formatDate(evidence.observed_at)}</span>
                      <span className="block">{evidence.description}</span>
                      <span className="block">Verified by {evidence.verified_by}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={article.canonical_parent} className="flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-skardu-void">
              Continue trip planning
            </Link>
            <Link href="/trending/" className="flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-skardu-teal">
              More travel updates
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-black uppercase tracking-[0.12em] text-skardu-gold">{label}</dt>
      <dd className="mt-1 text-skardu-ash">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function compactTitle(value: string) {
  if (value.length <= 48) return value;
  return value.slice(0, 47).replace(/\s+\S*$/, "").trim();
}

function compactDescription(value: string) {
  if (value.length <= 154) return value;
  return `${value.slice(0, 151).replace(/\s+\S*$/, "").trim()}.`;
}

function isReviewOverdue(value: string) {
  return !isTrendingReviewCurrent(value);
}
