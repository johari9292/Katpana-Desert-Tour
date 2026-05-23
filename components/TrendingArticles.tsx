"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { normalizeTrendingArticle, type TrendingArticle, type TrendingArticleRow } from "@/data/trending";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import AnimatedSection from "./AnimatedSection";

type LoadState = "loading" | "ready" | "empty" | "error" | "missing-config";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "Asia/Karachi"
});

export default function TrendingArticles() {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const reduceMotion = useReducedMotion();

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
      setActiveId(normalizedArticles[0]?.id ?? null);
      setLoadState(normalizedArticles.length ? "ready" : "empty");
    }

    loadArticles();

    return () => {
      mounted = false;
    };
  }, []);

  const activeArticle = useMemo(
    () => articles.find((article) => article.id === activeId) ?? articles[0],
    [activeId, articles]
  );

  return (
    <AnimatedSection className="relative px-5 pb-20 pt-10 lg:px-8 lg:pb-28">
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
              className="glass-panel rounded-2xl p-6 md:p-8"
            >
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
                <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">
                  {activeArticle.trend_rank ? `Trend #${activeArticle.trend_rank}` : "Travel trend"}
                </span>
                <span className="rounded-full border border-skardu-mist px-3 py-1 text-skardu-ash">
                  {activeArticle.trend_geo}
                </span>
                <span className="text-skardu-ash">{formatDate(activeArticle.published_at)}</span>
              </div>

              <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">
                Trending topic: {activeArticle.trend_topic}
              </p>
              <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
                {activeArticle.title}
              </h2>
              <p className="mt-6 text-xl leading-9 text-skardu-ash">{activeArticle.excerpt}</p>

              <div className="mt-8 grid gap-8">
                {activeArticle.sections.map((section) => (
                  <section key={section.heading}>
                    <h3 className="font-display text-3xl font-bold leading-tight text-skardu-snow md:text-4xl">
                      {section.heading}
                    </h3>
                    <p className="mt-3 text-lg leading-9 text-skardu-ash">{section.body}</p>
                  </section>
                ))}
              </div>

              {activeArticle.faqs.length ? (
                <section className="mt-10 border-t border-skardu-mist pt-8">
                  <h3 className="font-display text-4xl font-bold text-skardu-snow">Frequently asked questions</h3>
                  <div className="mt-5 grid gap-4">
                    {activeArticle.faqs.map((faq) => (
                      <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-void/45 p-5">
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

            
            </motion.article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                <h2 className="font-display text-3xl font-bold text-skardu-snow">Date-wise trending posts</h2>
                <div className="mt-5 grid gap-3">
                  {articles.map((article) => {
                    const active = article.id === activeArticle.id;

                    return (
                      <button
                        key={article.id}
                        type="button"
                        onClick={() => setActiveId(article.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active ? "border-skardu-gold bg-skardu-stone" : "border-skardu-mist bg-skardu-void/45 hover:border-skardu-gold"
                        }`}
                      >
                        <span className="mb-2 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">
                          <span className={active ? "text-skardu-gold" : "text-skardu-ash"}>
                            {formatDate(article.published_at)}
                          </span>
                          <span>{article.trend_rank ? `#${article.trend_rank}` : "Travel"}</span>
                        </span>
                        <span className="block font-display text-2xl font-bold leading-tight text-skardu-snow">
                          {article.title}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-skardu-ash">{article.trend_topic}</span>
                      </button>
                    );
                  })}
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

