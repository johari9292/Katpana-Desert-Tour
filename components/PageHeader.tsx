"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BRAND_NAME } from "@/constants/brand";
import { destinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";

const pageLinks = [
  ["Articles", "/articles/"],
  ["Trending", "/trending/"],
  ["Search", "/search/"],
  ["About", "/about/"],
  ["Contact", "/contact/"],
];

const guideLinks = [
  ["Travel Guide Library", "/travel-guides/", "Guides grouped by travel intent"],
  ["International Pakistan Tours", "/international-pakistan-tours/", "Global trip planning"],
  ["Skardu Travel Guide", "/skardu-travel-guide/", "Skardu travel guide"],
  ["Gilgit-Baltistan Tourism", "/gilgit-baltistan-tourism/", "Gilgit-Baltistan tourism"],
  ["Pakistan Trekking Guide", "/pakistan-trekking-guide/", "Best trekking in Pakistan"],
  ["Karakoram Highway", "/karakoram-highway-travel/", "Karakoram Highway travel"],
];

export default function PageHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-nav-shell fixed inset-x-0 top-0 z-50 border-b">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-8 lg:py-4" aria-label="Page navigation">
        <Link href="/" className="max-w-[210px] shrink-0 truncate font-display text-xl font-bold italic tracking-wide text-skardu-gold sm:max-w-none sm:text-2xl lg:text-3xl">
          {BRAND_NAME}
        </Link>
        <div className="hidden items-center gap-4 text-xs font-bold uppercase tracking-[0.14em] text-skardu-ash xl:flex xl:gap-6 xl:tracking-[0.16em]">
          <HeaderDropdown label="Tours" href="/tours/" items={tourPackages.map((tour) => [tour.title, `/tours/${tour.slug}/`, tour.duration])} />
          <HeaderDropdown
            label="Destinations"
            href="/destinations/"
            items={destinations.map((destination) => [destination.name, `/destinations/${destination.slug}/`, destination.type])}
          />
          <HeaderDropdown label="Guides" href="/travel-guides/" items={guideLinks} />
          {pageLinks.map(([label, href]) => (
            <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined} className="hover:text-skardu-gold">
              {label}
            </Link>
          ))}
        </div>
        <Link href="/contact/" className="hidden min-h-12 items-center rounded-full bg-skardu-gold px-5 py-3 text-sm font-black text-skardu-void xl:inline-flex">
          Customize trip
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="glass-control grid size-12 place-items-center rounded-full text-skardu-snow xl:hidden"
          aria-label={open ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={open}
          aria-controls="page-mobile-navigation"
        >
          <span className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {open ? (
        <div id="page-mobile-navigation" className="site-nav-shell max-h-[calc(100dvh-68px)] overflow-y-auto border-t px-4 py-4 shadow-2xl shadow-black/40 xl:hidden">
          <MobileGroup title="Tours" href="/tours/" items={tourPackages.map((tour) => [tour.title, `/tours/${tour.slug}/`])} onSelect={() => setOpen(false)} />
          <MobileGroup
            title="Destinations"
            href="/destinations/"
            items={destinations.map((destination) => [destination.name, `/destinations/${destination.slug}/`])}
            onSelect={() => setOpen(false)}
          />
          <MobileGroup title="Guides" href="/travel-guides/" items={guideLinks.map(([label, href]) => [label, href])} onSelect={() => setOpen(false)} />
          <div className="mt-4 grid gap-2 text-sm font-bold uppercase tracking-[0.16em] text-skardu-ash">
            {pageLinks.map(([label, href]) => (
              <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)} className="glass-control flex min-h-12 items-center rounded-xl px-4">
                {label}
              </Link>
            ))}
            <Link className="flex min-h-12 items-center justify-center rounded-xl bg-skardu-gold px-4 text-skardu-void" href="/contact/" onClick={() => setOpen(false)}>
              Customize trip
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
        <div className="glass-panel rounded-2xl p-4 shadow-2xl shadow-black/40">
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map(([title, itemHref, meta]) => (
              <Link key={itemHref} href={itemHref} className="rounded-xl border border-transparent p-3 normal-case tracking-normal hover:border-skardu-gold/60 hover:bg-white/5">
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
    <div className="border-b border-skardu-control/70 py-3">
      <div className="flex items-center gap-2">
        <Link href={href} onClick={onSelect} className="flex min-h-12 flex-1 items-center text-sm font-black uppercase tracking-[0.16em] text-skardu-gold">
          {title}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="glass-control flex min-h-12 items-center gap-2 rounded-full px-4 text-xs font-black uppercase tracking-[0.14em] text-skardu-snow"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${title}`}
        >
          {expanded ? "Hide" : "Open"}
          <span aria-hidden="true" className={`text-skardu-gold transition ${expanded ? "rotate-180" : ""}`}>▼</span>
        </button>
      </div>
      {expanded ? (
        <div className="mt-2 grid gap-2">
          {visibleItems.map(([label, itemHref]) => (
            <Link key={itemHref} href={itemHref} onClick={onSelect} className="glass-control flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-bold leading-5 text-skardu-ash">
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
