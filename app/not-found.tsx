import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import TrendingNotFoundRedirect from "@/components/TrendingNotFoundRedirect";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-skardu-void text-skardu-snow">
      <TrendingNotFoundRedirect />
      <PageHeader />
      <section className="px-4 pb-16 pt-28 sm:px-5 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Page not found</p>
          <h1 className="font-display text-5xl font-bold leading-tight text-skardu-snow sm:text-6xl">
            This page is not available.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-skardu-ash">
            The article may still be available in the live trending archive.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/trending/" className="flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-skardu-void">
              Trending articles
            </Link>
            <Link href="/" className="flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-skardu-teal">
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
