import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { articleCategories, articles } from "@/data/articles";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Skardu Travel Articles | Katpana Desert Tour",
  description: "Skardu travel articles for 2026 covering routes, hotels, cars, Deosai, Kachura and culture. Read now.",
  path: "/articles",
  imageAlt: "Skardu travel articles and Gilgit-Baltistan tourism guides",
  keywords: [
    "Skardu travel articles",
    "Skardu tourism blog",
    "Gilgit Baltistan travel guide",
    "Katapana Desert guide",
    "Skardu rent a car",
    "Skardu hotels"
  ]
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Skardu and Gilgit Baltistan travel articles",
  numberOfItems: articles.length,
  itemListElement: articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/articles/${article.slug}/`,
    name: article.title,
    description: article.excerpt
  }))
};

export default function ArticlesPage() {
  const categories = articleCategories.filter((category) => category !== "All");

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(itemListSchema)}
      />
      <PageHeader />
      <section className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Articles library</p>
            <h1 className="font-display text-6xl font-bold leading-none text-skardu-snow md:text-7xl">
              Skardu and Gilgit Baltistan travel guides
            </h1>
            <p className="mt-6 text-lg leading-8 text-skardu-ash">
              Explore 40 practical guides for Skardu tourism, Katapana Desert hotel booking, Skardu rent a car planning,
              Kachura lakes, Deosai, Shigar, Khaplu, culture, food, family trips, and seasonal routes.
            </p>
          </div>

          <div className="mt-12 grid gap-10">
            {categories.map((category) => {
              const categoryArticles = articles.filter((article) => article.category === category);

              return (
                <section key={category} aria-labelledby={`${category.toLowerCase().replaceAll(" ", "-")}-heading`}>
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <h2 id={`${category.toLowerCase().replaceAll(" ", "-")}-heading`} className="font-display text-4xl font-bold text-skardu-snow">
                      {category}
                    </h2>
                    <span className="text-sm font-bold text-skardu-ash">{categoryArticles.length} guides</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {categoryArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/articles/${article.slug}/`}
                        className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5 transition hover:border-skardu-gold hover:bg-skardu-stone"
                      >
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">{article.readTime}</span>
                        <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-skardu-snow">{article.title}</h3>
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-skardu-ash">{article.excerpt}</p>
                        <span className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
                          Read guide
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
