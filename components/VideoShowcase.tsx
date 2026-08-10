import { KATPANA_VIDEO_URL } from "@/constants/media";

export default function VideoShowcase() {
  return (
    <section
      aria-labelledby="katpana-video-heading"
      className="relative px-4 py-12 sm:px-5 sm:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-7 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <figure className="overflow-hidden rounded-2xl border border-skardu-mist bg-skardu-stone/70 p-1.5 shadow-xl shadow-black/25 sm:p-2">
          <video
            className="aspect-video w-full rounded-xl bg-skardu-void object-cover"
            controls
            playsInline
            preload="none"
            poster="/images/responsive/katpana-skardu-hero-1280.jpg"
            aria-label="Katpana Desert landscape video preview"
            aria-describedby="katpana-video-description"
          >
            <source src={KATPANA_VIDEO_URL} type="video/mp4" />
            Your browser cannot play this video. You can{" "}
            <a href={KATPANA_VIDEO_URL}>open the Katpana Desert video directly</a>.
          </video>
          <figcaption id="katpana-video-description" className="px-3 py-3 text-sm leading-6 text-skardu-ash">
            Press play to load the landscape preview. The video does not autoplay.
          </figcaption>
        </figure>

        <div>
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-skardu-gold sm:mb-4 sm:text-xs sm:tracking-[0.24em]">
            Katpana Desert video guide
          </p>
          <h2
            id="katpana-video-heading"
            className="font-display text-4xl font-bold leading-[0.95] text-skardu-snow sm:text-5xl md:text-6xl"
          >
            Preview the cold desert before you book Skardu
          </h2>
          <p className="mt-4 text-base leading-7 text-skardu-ash sm:mt-6 sm:text-lg sm:leading-8">
            See Katpana&apos;s sand, mountain light, and open Skardu landscape, then use our practical guides to plan
            transport, accommodation, photography stops, and a route that suits your group.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="Related planning topics">
            {[
              "Katpana Desert Skardu",
              "Skardu vehicle planning",
              "Gilgit-Baltistan tours",
              "Hotels near Katpana"
            ].map((item) => (
              <li
                key={item}
                className="rounded-full border border-skardu-mist bg-skardu-stone/75 px-4 py-3 text-sm font-bold text-skardu-ash"
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href="/articles/"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full border border-skardu-teal px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-skardu-teal transition-colors hover:bg-skardu-teal hover:text-skardu-void sm:mt-8 sm:tracking-[0.16em]"
          >
            Read Skardu guides
          </a>
        </div>
      </div>
    </section>
  );
}
