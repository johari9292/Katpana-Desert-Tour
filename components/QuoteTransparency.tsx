import Link from "next/link";

const quoteFactors = [
  "Confirmed dates and seasonal route access",
  "Number of travelers and room sharing",
  "Accommodation standard and meal plan",
  "Vehicle type, driver days and airport transfers",
  "Guides, permits, camping, entry fees and requested extras",
];

export default function QuoteTransparency({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby={compact ? "quote-factors-compact" : "quote-factors"} className="rounded-2xl border border-skardu-control bg-skardu-stone/65 p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">Transparent pricing</p>
      <h2 id={compact ? "quote-factors-compact" : "quote-factors"} className="mt-3 font-display text-3xl font-bold text-skardu-snow">
        Why this itinerary uses a tailored quote
      </h2>
      <p className="mt-3 text-sm leading-6 text-skardu-ash">
        No price is shown until the trip assumptions are clear. Ask for an itemized written quote covering:
      </p>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-skardu-ash">
        {quoteFactors.slice(0, compact ? 3 : quoteFactors.length).map((factor) => (
          <li key={factor} className="relative pl-5 before:absolute before:left-0 before:top-[0.65em] before:size-1.5 before:rounded-full before:bg-skardu-gold">
            {factor}
          </li>
        ))}
      </ul>
      <Link href="/booking-terms/" className="mt-4 inline-flex min-h-10 items-center font-bold text-skardu-teal underline decoration-2 underline-offset-4">
        Read booking and quote terms
      </Link>
    </section>
  );
}
