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
  const archivedGuides = archivedSeoSignals.flatMap((signal) => {
    const page = getSeoPageByPath(signal.targetPath);
    return page ? [page] : [];
  });
  const showingArchivedGuides = !articles.length && archivedGuides.length > 0;

  return (
    <section aria-labelledby="travel-updates-heading" className="relative px-4 pb-16 pt-6 sm:px-5 sm:pb-20 sm:pt-10 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel mb-8 grid gap-4 rounded-2xl p-5 sm:p-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(260px,0.3fr)] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">Travel updates</p>
            <h2 id="travel-updates-heading" className="mt-2 font-display text-3xl font-bold text-skardu-snow sm:text-4xl">
              {showingArchivedGuides ? "Popular Skardu travel guides" : "Fresh ideas for your next trip"}
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-skardu-ash">
              {showingArchivedGuides
                ? "Helpful guides for planning time in Skardu, Katpana Desert, Deosai and the Karakoram."
                : "Practical travel notes to help you plan routes, timing, transport and days in the mountains."}
            </p>
          </div>
          <p className="text-sm leading-6 text-skardu-ash lg:text-right">
            Conditions can change quickly. Confirm important details before you leave.
          </p>
        </div>

        {articles.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="glass-card flex h-full flex-col rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">
                  <span className="rounded-full bg-skardu-gold px-3 py-1.5 text-skardu-void">Travel update</span>
                  <time dateTime={article.published_at} className="text-skardu-ash">
                    Published {formatDate(article.published_at)}
                  </time>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-3xl">
                  <Link href={`/trending/${article.slug}/`} className="transition hover:text-skardu-gold focus-visible:text-skardu-gold">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 leading-7 text-skardu-ash">{article.excerpt}</p>
                <div className="mt-5 border-t border-skardu-mist pt-4 text-sm text-skardu-ash">
                  Plan with current local conditions in mind.
                </div>
                <Link
                  href={`/trending/${article.slug}/`}
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-5 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-skardu-void"
                >
                  Read travel update
                </Link>
              </article>
            ))}
          </div>
        ) : archivedGuides.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {archivedGuides.map((page) => (
              <article key={page.path} className="glass-card flex h-full flex-col rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">
                  <span className="rounded-full bg-skardu-gold px-3 py-1.5 text-skardu-void">Travel guide</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-3xl">
                  <Link href={page.path} className="transition hover:text-skardu-gold focus-visible:text-skardu-gold">
                    {page.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 leading-7 text-skardu-ash">{page.excerpt}</p>
                <div className="mt-5 border-t border-skardu-mist pt-4 text-sm text-skardu-ash">
                  A practical guide for planning your trip.
                </div>
                <Link
                  href={page.path}
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-5 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-skardu-void"
                >
                  Read travel guide
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyTravelState />
        )}
      </div>
    </section>
  );
}

function EmptyTravelState() {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">Travel updates</p>
      <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-skardu-snow sm:text-4xl">
        More trip ideas are on the way
      </h3>
      <p className="mt-4 max-w-3xl text-base leading-8 text-skardu-ash sm:text-lg">
        We’re preparing practical updates for routes and places around Skardu. Explore the destinations and tours below while you plan.
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
