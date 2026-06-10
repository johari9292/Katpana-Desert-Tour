"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND_NAME } from "@/constants/brand";
import { destinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";

const pageLinks = [
  ["Articles", "/articles/"],
  ["Trending", "/trending/"],
];

const guideLinks = [
  ["International Pakistan Tours", "/international-pakistan-tours/", "Global trip planning"],
  ["Skardu Travel Guide", "/skardu-travel-guide/", "Skardu travel guide"],
  ["Gilgit-Baltistan Tourism", "/gilgit-baltistan-tourism/", "Gilgit-Baltistan tourism"],
  ["Pakistan Trekking Guide", "/pakistan-trekking-guide/", "Best trekking in Pakistan"],
  ["Karakoram Highway", "/karakoram-highway-travel/", "Karakoram Highway travel"],
];

export default function PageHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-skardu-mist/50 bg-skardu-void/85 backdrop-blur-md lg:bg-skardu-void/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-8 lg:py-4" aria-label="Page navigation">
        <Link href="/" className="max-w-[210px] shrink-0 truncate font-display text-xl font-bold italic tracking-wide text-skardu-gold sm:max-w-none sm:text-2xl lg:text-3xl">
          {BRAND_NAME}
        </Link>
        <div className="hidden items-center gap-4 text-xs font-bold uppercase tracking-[0.14em] text-skardu-ash xl:gap-6 xl:tracking-[0.16em] lg:flex">
          <HeaderDropdown label="Tours" href="/tours/" items={tourPackages.map((tour) => [tour.title, `/tours/${tour.slug}/`, tour.duration])} />
          <HeaderDropdown
            label="Destinations"
            href="/destinations/"
            items={destinations.map((destination) => [destination.name, `/destinations/${destination.slug}/`, destination.type])}
          />
          <HeaderDropdown label="Guides" href="/skardu-travel-guide/" items={guideLinks} />
          {pageLinks.map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-skardu-gold">
              {label}
            </Link>
          ))}
        </div>
        <Link href="/#tours" className="hidden rounded-full bg-skardu-gold px-5 py-3 text-sm font-black text-skardu-void lg:inline-flex">
          Plan tour
        </Link>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="grid size-11 place-items-center rounded-full border border-skardu-mist bg-skardu-stone/50 text-skardu-snow lg:hidden"
          aria-label={open ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={open}
        >
          <span className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {open ? (
        <div className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-skardu-mist/50 bg-skardu-void/97 px-4 py-4 shadow-2xl shadow-black/40 lg:hidden">
          <MobileGroup title="Tours" href="/tours/" items={tourPackages.map((tour) => [tour.title, `/tours/${tour.slug}/`])} onSelect={() => setOpen(false)} />
          <MobileGroup
            title="Destinations"
            href="/destinations/"
            items={destinations.map((destination) => [destination.name, `/destinations/${destination.slug}/`])}
            onSelect={() => setOpen(false)}
          />
          <MobileGroup title="Guides" href="/skardu-travel-guide/" items={guideLinks.map(([label, href]) => [label, href])} onSelect={() => setOpen(false)} />
          <div className="mt-4 grid gap-2 text-sm font-bold uppercase tracking-[0.16em] text-skardu-ash">
            {pageLinks.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-xl border border-skardu-mist bg-skardu-stone/45 px-4">
                {label}
              </Link>
            ))}
            <Link className="flex min-h-12 items-center justify-center rounded-xl bg-skardu-gold px-4 text-skardu-void" href="/#tours" onClick={() => setOpen(false)}>
              Plan tour
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeaderDropdown({ label, href, items }: { label: string; href: string; items: string[][] }) {
  return (
    <div className="group relative">
      <Link href={href} className="inline-flex items-center gap-1.5 py-3 hover:text-skardu-gold">
        {label}
        <span aria-hidden="true" className="mt-[1px] text-[10px] text-skardu-gold transition-transform duration-200 group-hover:rotate-180">
          ▼
        </span>
      </Link>

      <div className="invisible absolute left-1/2 top-full w-[min(78vw,620px)] -translate-x-1/2 translate-y-3 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <div className="rounded-2xl border border-skardu-mist bg-skardu-void/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map(([title, itemHref, meta]) => (
              <Link key={itemHref} href={itemHref} className="rounded-xl border border-transparent p-3 normal-case tracking-normal hover:border-skardu-gold hover:bg-skardu-stone">
                <span className="block font-display text-xl font-bold leading-tight text-skardu-snow">{title}</span>
                <span className="mt-1 block text-xs font-black uppercase tracking-[0.16em] text-skardu-ash">{meta}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileGroup({ title, href, items, onSelect }: { title: string; href: string; items: string[][]; onSelect: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : [];

  return (
    <div className="border-b border-skardu-mist/50 py-3">
      <div className="flex items-center gap-2">
        <Link href={href} onClick={onSelect} className="flex min-h-11 flex-1 items-center text-sm font-black uppercase tracking-[0.16em] text-skardu-gold">
          {title}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="flex min-h-11 items-center gap-2 rounded-full border border-skardu-mist bg-skardu-stone/55 px-4 text-xs font-black uppercase tracking-[0.14em] text-skardu-snow"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${title}`}
        >
          {expanded ? "Hide" : "Open"}
          <span className={`text-skardu-gold transition ${expanded ? "rotate-180" : ""}`}>▼</span>
        </button>
      </div>
      {expanded ? (
        <div className="mt-2 grid gap-2">
          {visibleItems.map(([label, itemHref]) => (
            <Link key={itemHref} href={itemHref} onClick={onSelect} className="flex min-h-12 items-center rounded-xl border border-skardu-mist bg-skardu-stone/50 px-4 py-3 text-sm font-bold leading-5 text-skardu-ash">
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
