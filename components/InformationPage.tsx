import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import PageHeader from "./PageHeader";

export interface InformationSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
  links?: Array<{ label: string; href: string }>;
}

export default function InformationPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InformationSection[];
}) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen overflow-hidden bg-skardu-void text-skardu-snow">
      <PageHeader />
      <article className="px-5 pb-20 pt-32 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title, href: "#" }]} />
          <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-skardu-gold">{eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-none text-skardu-snow sm:text-6xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-skardu-ash sm:text-xl sm:leading-9">{intro}</p>

          <div className="mt-12 grid gap-10">
            {sections.map((section) => (
              <section key={section.heading} className="border-t border-skardu-control pt-8">
                <h2 className="font-display text-3xl font-bold text-skardu-snow sm:text-4xl">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-base leading-8 text-skardu-ash sm:text-lg">
                    {paragraph}
                  </p>
                ))}
                {section.items?.length ? (
                  <ul className="mt-5 grid gap-3 text-base leading-7 text-skardu-ash">
                    {section.items.map((item) => (
                      <li key={item} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:size-2 before:rounded-full before:bg-skardu-gold">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.links?.length ? (
                  <ul className="mt-5 grid gap-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center font-bold text-skardu-teal underline decoration-2 underline-offset-4"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
