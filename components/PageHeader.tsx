import Link from "next/link";
import { BRAND_NAME } from "@/constants/brand";
import { destinations } from "@/data/destinations";
import { tourPackages } from "@/data/tours";

const pageLinks = [

 
  ["Articles", "/articles/"],
    ["Trending", "/trending/"],

];

const guideLinks = [
  ["Skardu Travel Guide", "/skardu-travel-guide/", "Skardu travel guide"],
  ["Gilgit-Baltistan Tourism", "/gilgit-baltistan-tourism/", "Gilgit-Baltistan tourism"],
  ["Pakistan Trekking Guide", "/pakistan-trekking-guide/", "Best trekking in Pakistan"],
  ["Karakoram Highway", "/karakoram-highway-travel/", "Karakoram Highway travel"]
];

export default function PageHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-skardu-mist/50 bg-skardu-void/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8" aria-label="Page navigation">
        <Link href="/" className="shrink-0 font-display text-xl font-bold italic tracking-wide text-skardu-gold sm:text-2xl lg:text-3xl">
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
        <Link href="/#tours" className="rounded-full bg-skardu-gold px-5 py-3 text-sm font-black text-skardu-void">
          Plan tour
        </Link>
      </nav>
    </header>
  );
}

function HeaderDropdown({
  label,
  href,
  items
}: {
  label: string;
  href: string;
  items: string[][];
}) {
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
              <Link
                key={itemHref}
                href={itemHref}
                className="rounded-xl border border-transparent p-3 normal-case tracking-normal hover:border-skardu-gold hover:bg-skardu-stone"
              >
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
