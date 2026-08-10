import AnimatedSection from "./AnimatedSection";

const planningFactors = [
  {
    title: "Altitude pacing",
    body: "Keep the first day lighter and build high plateaus or trekking days into the route progressively."
  },
  {
    title: "Vehicle fit",
    body: "Match standard-road transfers and rough 4x4 tracks to different vehicles instead of treating every route alike."
  },
  {
    title: "Seasonal access",
    body: "Confirm high-road, plateau and trail conditions close to departure and retain a workable alternative."
  },
  {
    title: "Written scope",
    body: "Record accommodation, transport, inclusions, exclusions and quote assumptions before a trip is confirmed."
  }
];

const standards = [
  "Realistic driving days",
  "Weather buffers",
  "Itemized quote basis",
  "Safety-first route changes",
  "Responsible travel guidance"
];

export default function Stats() {
  return (
    <AnimatedSection id="why-skardu" className="relative px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-skardu-gold">Why plan from Skardu</p>
          <h2 className="font-display text-5xl font-bold leading-none text-skardu-snow md:text-6xl">
            Mountain routes need more than a list of stops
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {planningFactors.map((factor) => (
            <article key={factor.title} className="glass-panel rounded-2xl p-6">
              <h3 className="font-display text-3xl font-bold text-skardu-gold">{factor.title}</h3>
              <p className="mt-3 text-sm leading-6 text-skardu-ash">{factor.body}</p>
            </article>
          ))}
        </div>
        <ul className="mt-10 flex flex-wrap gap-3" aria-label="Route planning standards">
          {standards.map((standard) => (
            <li
              key={standard}
              className="rounded-full border border-skardu-control bg-skardu-stone/75 px-5 py-3 text-sm font-bold text-skardu-ash"
            >
              {standard}
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
}
