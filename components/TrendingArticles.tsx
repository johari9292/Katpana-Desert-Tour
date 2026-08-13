import Link from "next/link";
import { getSeoPageByPath } from "@/data/seo";
import { archivedSeoSignals, staticTrendingArticles } from "@/data/trending-static";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Karachi"
});

export default function TrendingArticles() {
  const articles = [...staticTrendingArticles].sort(
    (left, right) => Date.parse(right.last_verified_at) - Date.parse(left.last_verified_at)
  );
  const seoArticles = archivedSeoSignals.flatMap((signal) => {
    const page = getSeoPageByPath(signal.targetPath);
    return page ? [{ page, signal }] : [];
  });
  const showingArchivedSeoDemand = !articles.length && seoArticles.length > 0;

  return (
    <section aria-labelledby="verified-updates-heading" className="relative px-4 pb-16 pt-6 sm:px-5 sm:pb-20 sm:pt-10 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-4 rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(260px,0.3fr)] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">
              {showingArchivedSeoDemand ? "SEO archive" : "Editorial standard"}
            </p>
            <h2 id="verified-updates-heading" className="mt-2 font-display text-3xl font-bold text-skardu-snow sm:text-4xl">
              {showingArchivedSeoDemand ? "Popular Skardu travel articles" : "Verified Skardu travel updates"}
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-skardu-ash">
              {showingArchivedSeoDemand
                ? "We consolidated the strongest topics from the historical article archive into one canonical guide for each search intent, avoiding thin and duplicate pages."
                : "We publish an update only after a named reviewer checks local field evidence, source links, search intent, and overlap with our existing destination and tour guides."}
            </p>
          </div>
          <p className="text-sm leading-6 text-skardu-ash lg:text-right">
            {showingArchivedSeoDemand
              ? "Archive activity influences selection and ordering; the links point to the maintained SEO guide that owns each topic."
              : "Conditions in the Karakoram can change quickly. Confirm time-sensitive route, permit, weather, and access details before departure."}
          </p>
        </div>

        {articles.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="flex h-full flex-col rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">
                  <span className="rounded-full bg-skardu-gold px-3 py-1.5 text-skardu-void">{article.content_cluster}</span>
                  <time dateTime={article.last_verified_at} className="text-skardu-ash">
                    Verified {formatDate(article.last_verified_at)}
                  </time>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-3xl">
                  <Link href={`/trending/${article.slug}/`} className="transition hover:text-skardu-gold focus-visible:text-skardu-gold">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 leading-7 text-skardu-ash">{article.excerpt}</p>
                <div className="mt-5 border-t border-skardu-mist pt-4 text-sm text-skardu-ash">
                  Reviewed by {article.reviewed_by} · {article.citations.length} cited {article.citations.length === 1 ? "source" : "sources"}
                </div>
                <Link
                  href={`/trending/${article.slug}/`}
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-5 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-skardu-void"
                >
                  Read verified update
                </Link>
              </article>
            ))}
          </div>
        ) : seoArticles.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {seoArticles.map(({ page, signal }) => (
              <article key={page.path} className="flex h-full flex-col rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">
                  <span className="rounded-full bg-skardu-gold px-3 py-1.5 text-skardu-void">{page.eyebrow}</span>
                  <span className="text-skardu-ash">
                    {signal.matchingArticleCount} archive {signal.matchingArticleCount === 1 ? "signal" : "signals"}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-3xl">
                  <Link href={page.path} className="transition hover:text-skardu-gold focus-visible:text-skardu-gold">
                    {page.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 leading-7 text-skardu-ash">{page.excerpt}</p>
                <div className="mt-5 border-t border-skardu-mist pt-4 text-sm text-skardu-ash">
                  Primary search query: {page.primaryKeyword}
                </div>
                <Link
                  href={page.path}
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-5 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-skardu-void"
                >
                  Read SEO guide
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyEditorialState />
        )}
      </div>
    </section>
  );
}

function EmptyEditorialState() {
  return (
    <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/60 p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">Editorial review in progress</p>
      <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-skardu-snow sm:text-4xl">
        The first verified update is being prepared
      </h3>
      <p className="mt-4 max-w-3xl text-base leading-8 text-skardu-ash sm:text-lg">
        We retired the automated daily archive so that route and trip-planning information is published only when it adds a distinct, evidence-backed answer for travelers.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/destinations/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-skardu-teal">
          Explore destinations
        </Link>
        <Link href="/tours/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-skardu-void">
          Browse tours
        </Link>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}
