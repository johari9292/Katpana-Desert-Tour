import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { authorityLinks, type SEOPage } from "@/data/seo";
import { breadcrumbSchema, faqSchema, jsonLdScript, seoArticleSchema, seoDestinationSchema } from "@/lib/seo";

export default function SEOGuidePage({ page }: { page: SEOPage }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: page.category === "trek" ? "Treks" : page.category === "blog" ? "Blog" : "Guides", href: page.category === "trek" ? "/pakistan-trekking-guide/" : page.category === "blog" ? "/articles/" : page.path },
    { label: page.primaryKeyword, href: page.path }
  ];
  const pageSchema = page.schemaType === "TouristDestination" ? seoDestinationSchema(page) : seoArticleSchema(page);

  return (
    <main className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(pageSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(page.faqs))} />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">{page.eyebrow}</p>
            <h1 className="max-w-5xl font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">
              {page.title}
            </h1>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-skardu-ash">
              Last updated: {page.lastUpdated} / Written by {page.author}
            </p>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{page.excerpt}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#tours" className="rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void">
                {page.cta}
              </Link>
              <Link href="/trending/" className="rounded-full border border-skardu-teal px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
                Read travel trends
              </Link>
            </div>

            <div className="mt-12 grid gap-10">
              {page.sections.map((section, index) => (
                <section key={section.heading} className="glass-panel rounded-2xl p-6 md:p-8">
                  <h2 className="font-display text-4xl font-bold leading-tight text-skardu-snow md:text-5xl">
                    {section.heading}
                  </h2>
                  <p className="mt-4 text-lg leading-9 text-skardu-ash">{section.body}</p>
                  {(index + 1) % 3 === 0 ? (
                    <Link href="/#tours" className="mt-6 inline-flex rounded-full bg-skardu-gold px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-void">
                      Talk to a Local Expert
                    </Link>
                  ) : null}
                </section>
              ))}
            </div>

            <section className="mt-12 border-t border-skardu-mist pt-10">
              <h2 className="font-display text-4xl font-bold text-skardu-snow">Frequently asked questions</h2>
              <div className="mt-6 grid gap-4">
                {page.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
                    <summary className="cursor-pointer font-bold text-skardu-snow">{faq.question}</summary>
                    <p className="mt-3 leading-7 text-skardu-ash">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Related guides</h2>
              <div className="mt-5 grid gap-4">
                {page.relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block border-t border-skardu-mist pt-4 first:border-t-0 first:pt-0">
                    <span className="font-bold leading-snug text-skardu-snow">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Authority sources</h2>
              <div className="mt-5 grid gap-4">
                {authorityLinks.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block border-t border-skardu-mist pt-4 text-sm font-bold leading-6 text-skardu-teal first:border-t-0 first:pt-0">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5">
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Topic keywords</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-skardu-mist px-3 py-1 text-xs font-bold text-skardu-ash">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/#tours" className="mt-5 block rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void">
              Get a Free Trip Quote
            </Link>
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}
