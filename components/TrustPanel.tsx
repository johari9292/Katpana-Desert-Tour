import Link from "next/link";

const trustPoints = [
  {
    title: "Route-aware planning",
    body: "Vehicle choice, driving time, altitude and seasonal access are reviewed before a route is confirmed.",
  },
  {
    title: "Written trip scope",
    body: "Your quote should state the itinerary, accommodation level, transport, inclusions and exclusions before payment.",
  },
  {
    title: "Safety before schedule",
    body: "Mountain weather and road access can change. Local instructions and a safe alternative take priority over a fixed checklist.",
  },
];

export default function TrustPanel() {
  return (
    <section aria-labelledby="planning-standards-heading" className="rounded-2xl border border-skardu-mist bg-skardu-stone/65 p-5 sm:p-7">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-skardu-gold">Planning standards</p>
      <h2 id="planning-standards-heading" className="mt-3 font-display text-3xl font-bold text-skardu-snow sm:text-4xl">
        Know what is confirmed before you travel
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {trustPoints.map((point) => (
          <div key={point.title} className="rounded-xl border border-skardu-control bg-skardu-void/45 p-4">
            <h3 className="font-bold text-skardu-snow">{point.title}</h3>
            <p className="mt-2 text-sm leading-6 text-skardu-ash">{point.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
        <Link href="/booking-terms/" className="text-skardu-teal underline decoration-2 underline-offset-4">
          Booking terms
        </Link>
        <Link href="/travel-safety/" className="text-skardu-teal underline decoration-2 underline-offset-4">
          Travel safety
        </Link>
        <Link href="/responsible-travel/" className="text-skardu-teal underline decoration-2 underline-offset-4">
          Responsible travel
        </Link>
      </div>
    </section>
  );
}
