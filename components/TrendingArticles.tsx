"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { normalizeTrendingArticle, type TrendingArticle, type TrendingArticleRow } from "@/data/trending";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import AnimatedSection from "./AnimatedSection";

type LoadState = "loading" | "ready" | "empty" | "error" | "missing-config";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "Asia/Karachi"
});

const PAGE_SIZE = 5;

export default function TrendingArticles() {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const selectedSlug = searchParams.get("article");

  useEffect(() => {
    let mounted = true;

    async function loadArticles() {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setLoadState("missing-config");
        return;
      }

      const { data, error } = await supabase
        .from("trending_articles")
        .select(
          "id,slug,title,excerpt,sections,faqs,keywords,trend_topic,trend_rank,trend_source_url,trend_geo,published_at,generation_date"
        )
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(30);

      if (!mounted) return;

      if (error) {
        setErrorMessage(error.message);
        setLoadState("error");
        return;
      }

      const normalizedArticles = ((data ?? []) as TrendingArticleRow[]).map(normalizeTrendingArticle);
      setArticles(normalizedArticles);
      const selectedArticle = selectedSlug
        ? normalizedArticles.find((article) => article.slug === selectedSlug)
        : null;

      setActiveId(selectedArticle?.id ?? normalizedArticles[0]?.id ?? null);
      setPage(0);
      setLoadState(normalizedArticles.length ? "ready" : "empty");
    }

    loadArticles();

    return () => {
      mounted = false;
    };
  }, [selectedSlug]);

  const activeArticle = useMemo(
    () => articles.find((article) => article.id === activeId) ?? articles[0],
    [activeId, articles]
  );
  const pageCount = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const paginatedArticles = articles.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <AnimatedSection className="relative px-4 pb-16 pt-6 sm:px-5 sm:pb-20 sm:pt-10 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        {loadState === "loading" ? <LoadingState /> : null}
        {loadState === "missing-config" ? <MissingConfigState /> : null}
        {loadState === "error" ? <ErrorState message={errorMessage} /> : null}
        {loadState === "empty" ? <EmptyState /> : null}

        {loadState === "ready" && activeArticle ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(300px,0.32fr)]">
            <motion.article
              key={activeArticle.id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-2xl p-4 sm:p-6 md:p-8"
            >
              <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] sm:gap-3 sm:text-xs sm:tracking-[0.16em]">
                <span className="rounded-full bg-skardu-gold px-3 py-1.5 text-skardu-void">
                  {activeArticle.trend_rank ? `Trend #${activeArticle.trend_rank}` : "Travel trend"}
                </span>
                <span className="rounded-full border border-skardu-mist px-3 py-1.5 text-skardu-ash">
                  {activeArticle.trend_geo}
                </span>
                <span className="text-skardu-ash">{formatDate(activeArticle.published_at)}</span>
              </div>

              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">
                Trending topic: {activeArticle.trend_topic}
              </p>
              <h2 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-5xl md:text-6xl">
                {activeArticle.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-skardu-ash sm:mt-6 sm:text-xl sm:leading-9">{activeArticle.excerpt}</p>

              <div className="mt-7 grid gap-7 sm:mt-8 sm:gap-8">
                {activeArticle.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-3xl md:text-4xl">
                      {section.heading}
                    </h3>
                    <p className="mt-3 text-base leading-8 text-skardu-ash sm:text-lg sm:leading-9">{section.body}</p>
                  </section>
                ))}
              </div>

              {activeArticle.faqs.length ? (
                <section className="mt-8 border-t border-skardu-mist pt-7 sm:mt-10 sm:pt-8">
                  <h3 className="font-display text-3xl font-bold text-skardu-snow sm:text-4xl">Frequently asked questions</h3>
                  <div className="mt-5 grid gap-4">
                    {activeArticle.faqs.map((faq) => (
                      <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-void/45 p-4 sm:p-5">
                        <summary className="cursor-pointer font-bold text-skardu-snow">{faq.question}</summary>
                        <p className="mt-3 leading-7 text-skardu-ash">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-2">
                {activeArticle.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                    {keyword}
                  </span>
                ))}
              </div>

              <Link
                href={`/trending/?article=${activeArticle.slug}`}
                className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-skardu-void sm:w-fit"
              >
                Open article
              </Link>
            </motion.article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-4 sm:p-5">
                <div className="flex items-end justify-between gap-3">
                  <h2 className="font-display text-2xl font-bold text-skardu-snow sm:text-3xl">Date-wise posts</h2>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-skardu-ash">
                    {page + 1}/{pageCount}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:mt-5">
                  {paginatedArticles.map((article) => {
                    const active = article.id === activeArticle.id;

                    return (
                      <div
                        key={article.id}
                        className={`rounded-2xl border p-4 transition ${
                          active ? "border-skardu-gold bg-skardu-stone" : "border-skardu-mist bg-skardu-void/45 hover:border-skardu-gold"
                        }`}
                      >
                        <button type="button" onClick={() => setActiveId(article.id)} className="block w-full text-left">
                          <span className="mb-2 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">
                            <span className={active ? "text-skardu-gold" : "text-skardu-ash"}>
                              {formatDate(article.published_at)}
                            </span>
                            <span>{article.trend_rank ? `#${article.trend_rank}` : "Travel"}</span>
                          </span>
                          <span className="block font-display text-xl font-bold leading-tight text-skardu-snow sm:text-2xl">
                            {article.title}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-skardu-ash">{article.trend_topic}</span>
                        </button>
                        <Link href={`/trending/?article=${article.slug}`} className="mt-3 inline-flex min-h-9 items-center text-xs font-black uppercase tracking-[0.14em] text-skardu-teal">
                          Details
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(0, current - 1))}
                    disabled={page === 0}
                    className="min-h-11 rounded-full border border-skardu-mist px-4 text-sm font-black uppercase tracking-[0.14em] text-skardu-ash disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                    disabled={page >= pageCount - 1}
                    className="min-h-11 rounded-full border border-skardu-teal px-4 text-sm font-black uppercase tracking-[0.14em] text-skardu-teal disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}

function LoadingState() {
  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-skardu-gold">Loading trending articles</p>
      <div className="mt-6 grid gap-4">
        <div className="h-10 rounded-xl bg-skardu-mist/30" />
        <div className="h-24 rounded-xl bg-skardu-mist/20" />
        <div className="h-24 rounded-xl bg-skardu-mist/20" />
      </div>
    </div>
  );
}

function MissingConfigState() {
  return (
    <StatePanel
      title="Supabase is not configured"
      body="Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the site environment to show published trending articles."
    />
  );
}

function ErrorState({ message }: { message: string }) {
  return <StatePanel title="Trending articles could not load" body={message || "Please check the Supabase table and public read policy."} />;
}

function EmptyState() {
  return (
    <StatePanel
      title="No trending articles yet"
      body="The page is ready. The first post will appear after the scheduled Supabase Edge Function publishes a daily article."
    />
  );
}

function StatePanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Trending articles</p>
      <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-skardu-ash">{body}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}
