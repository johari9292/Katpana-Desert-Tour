import Link from "next/link";

const pageLinks = [
  ["Home", "/"],
  ["Hotels", "/#hotels"],
  ["Cars", "/#cars"],
  ["Videos", "/skardu-videos/"],
  ["Why Skardu", "/why-skardu/"],
  ["Articles", "/articles/"],
  ["Reviews", "/testimonials/"]
];

export default function PageHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-skardu-mist/50 bg-skardu-void/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8" aria-label="Page navigation">
        <Link href="/" className="shrink-0 font-display text-3xl font-bold italic tracking-wide text-skardu-gold">
          SKARDU
        </Link>
        <div className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.16em] text-skardu-ash lg:flex">
          {pageLinks.map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-skardu-gold">
              {label}
            </Link>
          ))}
        </div>
        <Link href="/#hotels" className="rounded-full bg-skardu-gold px-5 py-3 text-sm font-black text-skardu-void">
          Book now
        </Link>
      </nav>
    </header>
  );
}
