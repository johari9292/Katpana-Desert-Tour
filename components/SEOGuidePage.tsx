import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import MobileBookingBar from "@/components/MobileBookingBar";
import PageHeader from "@/components/PageHeader";
import TrustPanel from "@/components/TrustPanel";
import { BRAND_NAME } from "@/constants/brand";
import { buildWhatsAppURL, WHATSAPP_MAIN } from "@/constants/contact";
import { authorityLinks, type SEOPage } from "@/data/seo";
import { breadcrumbSchema, jsonLdScript, seoArticleSchema, seoDestinationSchema } from "@/lib/seo";

export default function SEOGuidePage({ page }: { page: SEOPage }) {
  const parentHref = page.category === "trek" ? "/pakistan-trekking-guide/" : "/travel-guides/";
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: page.category === "trek" ? "Treks" : "Travel guides", href: parentHref },
    { label: page.primaryKeyword, href: page.path }
  ];
  const pageSchema = page.schemaType === "TouristDestination" ? seoDestinationSchema(page) : seoArticleSchema(page);
  const whatsappUrl = buildWhatsAppURL(
    WHATSAPP_MAIN,
    `Hi ${BRAND_NAME}, I am reading ${page.title} and want a route matched to my dates and group.`
  );

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(pageSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(breadcrumbs))} />
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
          <div>
            <Breadcrumbs items={breadcrumbs} />
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">{page.eyebrow}</p>
            <h1 className="max-w-5xl font-display text-5xl font-bold leading-none text-skardu-snow md:text-7xl">
              {page.title}
            </h1>
            <p className="mt-6 text-xl leading-9 text-skardu-ash">{page.excerpt}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact/" className="flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void">
                {page.cta}
              </Link>
              <Link href="/travel-guides/" className="flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-teal">
                Browse related guides
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
                    <Link href="/contact/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-skardu-gold px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-skardu-void">
                      Customize this route
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
              <h2 className="font-display text-3xl font-bold text-skardu-snow">Official planning references</h2>
              <div className="mt-5 grid gap-4">
                {authorityLinks.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block border-t border-skardu-mist pt-4 text-sm font-bold leading-6 text-skardu-teal first:border-t-0 first:pt-0">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <TrustPanel />
            </div>

            <Link href="/contact/" className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-skardu-void">
              Request itinerary options
            </Link>
          </aside>
        </div>
      </article>
      <Footer />
      <MobileBookingBar whatsappUrl={whatsappUrl} context={`guide_${page.slug}`} customizeHref="/contact/" />
    </main>
  );
}
