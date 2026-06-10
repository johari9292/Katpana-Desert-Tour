import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { BRAND_NAME, SITE_URL } from "@/constants/brand";
import { articleCategories, articles } from "@/data/articles";
import { createMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pakistan and Skardu Travel Articles | Katpana Desert Tour",
  description: "Pakistan and Skardu travel articles for international visitors covering routes, hotels, cars, Deosai, Kachura and culture.",
  path: "/articles",
  imageAlt: "Pakistan and Skardu travel articles for international Gilgit-Baltistan tourism",
  keywords: [
    "Pakistan travel articles",
    "international Pakistan travel blog",
    "Skardu travel articles",
    "Skardu tourism blog",
    "Gilgit Baltistan travel guide",
    "Katpana Desert guide",
    "Skardu rent a car",
    "Skardu hotels"
  ]
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Pakistan, Skardu and Gilgit-Baltistan travel articles",
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
      <section className="px-4 pb-16 pt-28 sm:px-5 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">Articles library</p>
            <h1 className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-6xl md:text-7xl">
              Pakistan, Skardu, and Gilgit-Baltistan travel guides
            </h1>
            <p className="mt-4 text-base leading-7 text-skardu-ash sm:mt-6 sm:text-lg sm:leading-8">
              Explore 40 practical guides for international Pakistan travel, Skardu tourism, Katpana Desert hotel booking,
              Skardu rent a car planning, Kachura lakes, Deosai, Shigar, Khaplu, culture, food, family trips, and seasonal routes.
            </p>
          </div>

          <div className="mt-9 grid gap-9 sm:mt-12 sm:gap-10">
            {categories.map((category) => {
              const categoryArticles = articles.filter((article) => article.category === category);

              return (
                <section key={category} aria-labelledby={`${category.toLowerCase().replaceAll(" ", "-")}-heading`}>
                  <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
                    <h2 id={`${category.toLowerCase().replaceAll(" ", "-")}-heading`} className="font-display text-3xl font-bold text-skardu-snow sm:text-4xl">
                      {category}
                    </h2>
                    <span className="text-sm font-bold text-skardu-ash">{categoryArticles.length} guides</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {categoryArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/articles/${article.slug}/`}
                        className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-4 transition hover:border-skardu-gold hover:bg-skardu-stone sm:p-5"
                      >
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">{article.readTime}</span>
                        <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-skardu-snow sm:text-3xl">{article.title}</h3>
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-skardu-ash">{article.excerpt}</p>
                        <span className="mt-5 inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.14em] text-skardu-teal sm:tracking-[0.16em]">
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
