import Link from "next/link";

const commitments = [
  {
    title: "A written scope before payment",
    body: "Confirm the route, accommodation level, vehicle, inclusions, exclusions, payment schedule and cancellation terms in writing.",
  },
  {
    title: "Current conditions over old promises",
    body: "Weather, flights, roads and protected-area access can change. A current route check and safe alternative take priority.",
  },
  {
    title: "Feedback published with context",
    body: "Traveler feedback should identify the trip and date and be published only with permission. Anonymous marketing quotes are not used as verified proof.",
  },
];

export default function Testimonials() {
  return (
    <section id="traveler-assurance" aria-labelledby="traveler-assurance-heading" className="relative px-4 py-14 sm:px-5 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">Traveler assurance</p>
          <h2 id="traveler-assurance-heading" className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-5xl md:text-6xl">
            Trust the written plan, not an unverifiable claim
          </h2>
          <p className="mt-5 text-base leading-8 text-skardu-ash sm:text-lg">
            High-altitude travel needs transparent decisions. These are the standards travelers should ask for before confirming an itinerary.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {commitments.map((commitment, index) => (
            <article key={commitment.title} className="rounded-2xl border border-skardu-control bg-skardu-stone/65 p-5 sm:p-6">
              <span className="text-xs font-black tracking-[0.18em] text-skardu-gold">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-2xl font-bold text-skardu-snow">{commitment.title}</h3>
              <p className="mt-3 text-sm leading-7 text-skardu-ash">{commitment.body}</p>
            </article>
          ))}
        </div>

        <Link href="/testimonials/" className="mt-8 inline-flex min-h-12 items-center font-bold text-skardu-teal underline decoration-2 underline-offset-4">
          Read our feedback publication standard
        </Link>
      </div>
    </section>
  );
}
