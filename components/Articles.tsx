"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { articleCategories, articles, type TravelArticle } from "@/data/articles";

type ArticleCategoryFilter = (typeof articleCategories)[number];

export default function Articles() {
  const [activeCategory, setActiveCategory] = useState<ArticleCategoryFilter>("All");
  const [activeSlug, setActiveSlug] = useState(articles[0].slug);
  const reduceMotion = useReducedMotion();

  const filteredArticles = useMemo(
    () => (activeCategory === "All" ? articles : articles.filter((article) => article.category === activeCategory)),
    [activeCategory]
  );

  useEffect(() => {
    if (!filteredArticles.some((article) => article.slug === activeSlug)) {
      setActiveSlug(filteredArticles[0]?.slug ?? articles[0].slug);
    }
  }, [activeSlug, filteredArticles]);

  const selectedArticle = filteredArticles.find((article) => article.slug === activeSlug) ?? filteredArticles[0] ?? articles[0];

  return (
    <section id="articles" className="relative px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-4xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Skardu travel articles</p>
          <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
            Read Skardu and Gilgit Baltistan guides
          </h2>
          <p className="mt-6 text-lg leading-8 text-skardu-ash">
            Browse 40 practical articles covering Skardu tourism, Katapana Desert hotels, Skardu rent a car routes,
            family trips, seasonal planning, culture, food, and adventure travel across Gilgit Baltistan.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter Skardu travel articles by topic">
          {articleCategories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                  active
                    ? "border-skardu-gold bg-skardu-gold text-skardu-void"
                    : "border-skardu-mist bg-skardu-stone/70 text-skardu-ash hover:border-skardu-gold hover:text-skardu-snow"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid max-h-[760px] gap-3 overflow-y-auto pr-1">
            {filteredArticles.map((article, index) => (
              <ArticleListButton
                key={article.slug}
                article={article}
                index={index}
                active={selectedArticle.slug === article.slug}
                onSelect={() => setActiveSlug(article.slug)}
              />
            ))}
          </div>

          <motion.article
            key={selectedArticle.slug}
            initial={reduceMotion ? false : { opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-2xl p-6 md:p-8"
          >
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
              <span className="rounded-full bg-skardu-gold px-3 py-1 text-skardu-void">{selectedArticle.category}</span>
              <span className="text-skardu-ash">{selectedArticle.readTime}</span>
              <span className="text-skardu-ash">Updated May 22, 2026</span>
            </div>
            <h3 className="font-display text-4xl font-bold leading-tight text-skardu-snow md:text-5xl">{selectedArticle.title}</h3>
            <p className="mt-5 text-lg leading-8 text-skardu-ash">{selectedArticle.excerpt}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {selectedArticle.highlights.map((highlight) => (
                <p key={highlight} className="rounded-2xl border border-skardu-mist bg-skardu-void/45 p-4 text-sm leading-6 text-skardu-ash">
                  {highlight}
                </p>
              ))}
            </div>

            <div className="mt-7 border-t border-skardu-mist pt-7">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-skardu-gold">
                {selectedArticle.sections[0].heading}
              </h4>
              <p className="mt-3 text-base leading-8 text-skardu-ash">{selectedArticle.sections[0].body}</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {selectedArticle.keywords.slice(0, 5).map((keyword) => (
                <span key={keyword} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/articles/${selectedArticle.slug}/`}
                className="rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
              >
                Read full article
              </Link>
              <Link
                href="/articles/"
                className="rounded-full border border-skardu-teal px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-teal"
              >
                View all articles
              </Link>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function ArticleListButton({
  article,
  index,
  active,
  onSelect
}: {
  article: TravelArticle;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`rounded-2xl border p-4 text-left transition ${
        active ? "border-skardu-gold bg-skardu-stone" : "border-skardu-mist bg-skardu-stone/50 hover:border-skardu-gold"
      }`}
    >
      <span className="mb-3 flex items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">
        <span className={active ? "text-skardu-gold" : "text-skardu-ash"}>{String(index + 1).padStart(2, "0")}</span>
        <span>{article.category}</span>
        <span>{article.readTime}</span>
      </span>
      <span className="block font-display text-2xl font-bold leading-tight text-skardu-snow">{article.title}</span>
      <span className="mt-3 block line-clamp-2 text-sm leading-6 text-skardu-ash">{article.excerpt}</span>
    </button>
  );
}
