"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

export interface SearchEntry {
  href: string;
  title: string;
  summary: string;
  type: string;
  searchText: string;
}

export default function SiteSearch({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q")?.trim().slice(0, 100) ?? "";
    setQuery(initialQuery);
  }, []);

  const results = useMemo(() => {
    const terms = normalizeText(query).split(" ").filter(Boolean);
    if (!terms.length) return entries;
    return entries.filter((entry) => {
      const haystack = normalizeText(entry.searchText);
      return terms.every((term) => haystack.includes(term));
    });
  }, [entries, query]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = query.trim() ? `/search/?q=${encodeURIComponent(query.trim())}` : "/search/";
    window.history.replaceState({}, "", url);
  }

  function clearSearch() {
    setQuery("");
    window.history.replaceState({}, "", "/search/");
  }

  return (
    <>
      <form onSubmit={submitSearch} role="search" className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="site-search">
          Search tours and travel guides
        </label>
        <input
          id="site-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value.slice(0, 100))}
          maxLength={100}
          placeholder="Try Deosai, K2 trek, or family tour"
          className="min-h-12 flex-1 rounded-full border border-skardu-control bg-skardu-stone px-5 py-3 text-base text-skardu-snow outline-none placeholder:text-skardu-ash focus-visible:border-skardu-gold focus-visible:ring-2 focus-visible:ring-skardu-gold"
        />
        <button
          type="submit"
          className="min-h-12 rounded-full bg-skardu-gold px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-void"
        >
          Search
        </button>
      </form>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-skardu-control pb-5">
        <div aria-live="polite" aria-atomic="true">
          <h2 className="font-display text-3xl font-bold text-skardu-snow">
            {query ? `Results for “${query}”` : "Browse all travel resources"}
          </h2>
          <p className="mt-2 text-sm text-skardu-ash">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
        </div>
        {query ? (
          <button type="button" onClick={clearSearch} className="min-h-11 text-sm font-bold text-skardu-teal underline underline-offset-4">
            Clear search
          </button>
        ) : null}
      </div>

      {results.length ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="rounded-2xl border border-skardu-control bg-skardu-stone/65 p-5 transition hover:border-skardu-gold hover:bg-skardu-stone"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">{entry.type}</span>
              <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-skardu-snow">{entry.title}</h3>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-skardu-ash">{entry.summary}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-skardu-control bg-skardu-stone/65 p-6">
          <h3 className="font-display text-3xl font-bold text-skardu-snow">No matching pages found</h3>
          <p className="mt-3 leading-7 text-skardu-ash">
            Try a shorter place or activity name, such as Skardu, Deosai, K2, jeep safari, family, or trekking.
          </p>
        </div>
      )}
    </>
  );
}

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
