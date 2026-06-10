import Link from "next/link";

const globalPlanningPoints = [
  {
    title: "Worldwide trip planning",
    body:
      "Plan Skardu, Hunza, Deosai, K2, and Karakoram trips from the USA, UK, Europe, Canada, Australia, the Middle East, Southeast Asia, or Pakistan before you arrive.",
  },
  {
    title: "Foreign visitor logistics",
    body:
      "Get practical help with airport pickups, hotel location, private cars, 4x4 jeeps, local drivers, route buffers, seasonal timing, and trekking permit coordination.",
  },
  {
    title: "Private northern Pakistan tours",
    body:
      "Build family trips, honeymoon routes, photography journeys, small group tours, and serious K2-side trekking plans around safe road timing and local conditions.",
  },
];

export default function GlobalTravelSeo() {
  return (
    <section className="relative px-4 py-16 sm:px-5 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl border-t border-skardu-mist pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(300px,0.42fr)] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">
              International Pakistan tours
            </p>
            <h2 className="max-w-4xl font-display text-4xl font-bold leading-tight text-skardu-snow sm:text-5xl md:text-6xl">
              Skardu travel planning for visitors worldwide
            </h2>
            <p className="mt-5 max-w-4xl text-base leading-8 text-skardu-ash sm:text-lg">
              Katpana Desert Tour helps international travelers plan Pakistan tours with Skardu-based local support,
              English and Urdu communication, private transport, hotel guidance, Deosai safari planning, Hunza extensions,
              and K2 trekking logistics.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link
              href="/international-pakistan-tours/"
              className="flex min-h-12 items-center justify-center rounded-full bg-skardu-gold px-6 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-skardu-void"
            >
              International guide
            </Link>
            <Link
              href="/#tours"
              className="flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-skardu-teal"
            >
              Plan private tour
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {globalPlanningPoints.map((point) => (
            <article key={point.title} className="rounded-lg border border-skardu-mist bg-skardu-stone/55 p-5">
              <h3 className="font-display text-3xl font-bold leading-tight text-skardu-snow">{point.title}</h3>
              <p className="mt-3 text-sm leading-7 text-skardu-ash">{point.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
