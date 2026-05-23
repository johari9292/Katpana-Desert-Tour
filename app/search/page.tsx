import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { blogPages, pillarPages, trekPages } from "@/data/seo";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Search Skardu Travel Guides | Katpana Desert Tour",
  description: "Search Skardu travel guides, K2 treks, Deosai routes and Gilgit-Baltistan tourism pages. Explore now.",
  path: "/search",
  imageAlt: "Search Skardu travel guides and K2 trekking routes Pakistan",
  keywords: ["Skardu search", "Skardu travel guide", "K2 trek search"]
});

const searchPages = [...pillarPages, ...trekPages, ...blogPages];

export default function SearchPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Search</p>
          <h1 className="max-w-5xl font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
            Search Skardu travel guides
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-skardu-ash">
            Find practical guides for Skardu, K2 trekking, Deosai safari, Gilgit-Baltistan tourism, Karakoram Highway travel, and seasonal planning.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {searchPages.map((page) => (
              <Link key={page.path} href={`${page.path}/`} className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5 transition hover:border-skardu-gold hover:bg-skardu-stone">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">{page.primaryKeyword}</span>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-skardu-snow">{page.title}</h2>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-skardu-ash">{page.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
