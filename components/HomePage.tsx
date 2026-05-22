"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { motion } from "motion/react";

const whatsappNumber = "923438160801";

const stats = [
  ["Cold desert base", "Stay near Katpana dunes"],
  ["Local vehicles", "Cars, SUVs, Prado, Hiace"],
  ["Route planning", "Skardu attractions in one flow"]
];

const hotelOptions = [
  {
    title: "Katpana Desert View Stays",
    text: "Hotels, camps, and guest houses close to sunrise dunes, stargazing points, and airport pickup routes."
  },
  {
    title: "Family Guest Houses",
    text: "Warm rooms, parking, meal options, and easy day-trip access for families visiting Skardu."
  },
  {
    title: "Group Tour Rooms",
    text: "Flexible stays for friends, office groups, and honeymoon travelers who want smooth logistics."
  }
];

const vehicles = [
  ["Airport pickup", "Clean cars and SUVs for Skardu Airport, Katpana Desert, hotels, and city transfer."],
  ["4x4 Prado", "Best for Deosai, Basho Valley, Shigar side routes, and seasonal mountain roads."],
  ["Hiace and Coaster", "Comfortable group transport for families, student tours, and corporate trips."]
];

const attractions = [
  ["Katpana Desert", "Cold desert dunes, mountain views, sunrise light, and one of Skardu's strongest search attractions."],
  ["Shangrila Resort", "Lower Kachura lake views, family photos, lunch stops, and a classic first-time Skardu route."],
  ["Upper Kachura Lake", "Boating, trout meals, blue-water photography, village walks, and relaxed day planning."],
  ["Deosai National Park", "High plains, Sheosar Lake, wildlife, and summer 4x4 adventure from Skardu."],
  ["Shigar Fort", "Historic architecture, quiet gardens, local food, and a scenic Shigar Valley drive."],
  ["Manthokha Waterfall", "A full-day route with cliffs, picnic stops, water views, and peaceful village scenery."]
];

const itinerary = [
  ["Day 1", "Arrival, hotel check-in, Katpana Desert sunset", "Airport pickup, desert photography, local dinner, and overnight stay near Skardu."],
  ["Day 2", "Shangrila, Upper Kachura, and city route", "Easy lake-focused tour with car rental, family stops, and flexible return time."],
  ["Day 3", "Deosai or Shigar route", "Choose a 4x4 highland adventure or a softer culture and valley route."]
];

const faqs = [
  {
    question: "Can I book a hotel near Katpana Desert?",
    answer:
      "Yes. You can request hotels, guest houses, or desert-view stays near Katpana Desert and central Skardu through the WhatsApp booking form."
  },
  {
    question: "Do you provide rent a car in Skardu?",
    answer:
      "Yes. You can request airport pickup, daily car rental, 4x4 Prado, SUV, Hiace, or Coaster depending on your Skardu route."
  },
  {
    question: "Which Skardu attraction points are best from Katpana Desert?",
    answer:
      "Popular routes include Katpana Desert, Shangrila Resort, Upper Kachura Lake, Deosai National Park, Shigar Fort, and Manthokha Waterfall."
  },
  {
    question: "Is Katpana Desert good for families and first-time tourists?",
    answer:
      "Yes. Katpana Desert is close to Skardu city and airport, so it works well for families, honeymoon trips, groups, and first-time visitors."
  }
];

const sectionReveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const service = formData.get("service") || "Not selected";
    const date = formData.get("date") || "Flexible / not selected";
    const travelers = formData.get("travelers") || "Not selected";
    const message = formData.get("message") || "No extra message";

    const whatsappMessage = [
      "Katpana Desert Tours booking request",
      "",
      "Question: Which travel service do you need?",
      `Answer: ${service}`,
      "",
      "Question: What is your travel date?",
      `Answer: ${date}`,
      "",
      "Question: How many travelers?",
      `Answer: ${travelers}`,
      "",
      "Question: Any hotel, car, or attraction details?",
      `Answer: ${message}`,
      "",
      "Source: Katpana Desert Skardu tourism website"
    ].join("\n");

    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  }

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#17211f]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#101917]/55 px-4 py-3 text-white backdrop-blur-xl sm:px-6 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5" aria-label="Primary navigation">
          <a href="#top" className="flex min-w-0 items-center gap-3 font-black">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/35 bg-white/15">K</span>
            <span className="truncate">Katpana Desert Tours</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-bold lg:flex">
            <a className="transition hover:text-[#f2c46f]" href="#hotels">Hotels</a>
            <a className="transition hover:text-[#f2c46f]" href="#cars">Cars</a>
            <a className="transition hover:text-[#f2c46f]" href="#attractions">Attractions</a>
            <a className="transition hover:text-[#f2c46f]" href="#faq">FAQ</a>
          </div>
          <a
            href="#booking"
            className="rounded-md bg-[#f2c46f] px-4 py-2 text-sm font-black text-[#17211f] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ffd98a]"
          >
            Book on WhatsApp
          </a>
        </nav>
      </header>

      <section id="top" className="relative isolate min-h-[92vh] overflow-hidden">
        <Image
          src="/images/katpana-skardu-hero.png"
          alt="Katpana Desert near Skardu with sand dunes, mountains, and tour vehicle"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,14,.88),rgba(8,15,14,.56)_46%,rgba(8,15,14,.14)),linear-gradient(180deg,rgba(8,15,14,.05),rgba(8,15,14,.48))]" />
        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl content-center px-5 pb-20 pt-28 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl text-white"
          >
            <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-[#f2c46f]">
              Katpana Desert, Skardu, Gilgit-Baltistan
            </p>
            <h1 className="text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl">
              Skardu hotels, cars, and attraction tours built around Katpana Desert
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88">
              A cleaner way for tourists to book stays near the cold desert, hire trusted local transport,
              and explore Shangrila, Upper Kachura, Deosai, Shigar Fort, and Manthokha Waterfall.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#booking"
                className="rounded-md bg-[#f2c46f] px-6 py-4 text-center font-black text-[#17211f] shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-[#ffd98a]"
              >
                Plan my Skardu trip
              </a>
              <a
                href="#attractions"
                className="rounded-md border border-white/35 bg-white/15 px-6 py-4 text-center font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/22"
              >
                View attraction points
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section aria-label="Tour highlights" className="grid border-y border-[#17211f]/10 bg-white md:grid-cols-3">
        {stats.map(([title, text], index) => (
          <motion.div
            key={title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionReveal}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="border-b border-[#17211f]/10 px-6 py-7 md:border-b-0 md:border-r last:md:border-r-0 lg:px-10"
          >
            <strong className="block text-lg">{title}</strong>
            <span className="mt-1 block text-[#59645f]">{text}</span>
          </motion.div>
        ))}
      </section>

      <SeoIntro />
      <Hotels />
      <Cars />
      <Attractions />
      <Itinerary />
      <BookingForm onSubmit={handleSubmit} />
      <FAQ />

      <footer className="bg-[#0d1715] px-5 py-8 text-white/80 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row">
          <p>Katpana Desert Tours - Skardu hotels, rent a car, and attraction point planning. WhatsApp: 0343 8160801</p>
          <a className="font-black text-[#f2c46f]" href="#top">Back to top</a>
        </div>
      </footer>
    </main>
  );
}

function SeoIntro() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionReveal}
      transition={{ duration: 0.55 }}
      className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-28"
    >
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#a97824]">Skardu tourism with local intent</p>
        <h2 className="text-4xl font-black leading-tight sm:text-5xl">A travel base designed around Katpana Desert searches</h2>
        <p className="mt-5 text-lg leading-8 text-[#59645f]">
          Katpana Desert is a powerful entry point for Skardu tourism because visitors search for cold desert views,
          hotel booking, car rentals, and nearby attraction points in one trip. This Next.js page is structured to
          answer those searches quickly and convert them into WhatsApp leads.
        </p>
      </div>
      <div className="grid gap-3 self-center">
        {["Katpana Desert hotel booking", "Skardu rent a car", "Skardu tour packages", "Places to visit in Skardu"].map((item) => (
          <span key={item} className="rounded-lg border border-[#17211f]/10 bg-white px-5 py-4 font-bold shadow-sm">
            {item}
          </span>
        ))}
      </div>
    </motion.section>
  );
}

function Hotels() {
  return (
    <section id="hotels" className="bg-[#eef3f1] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Hotels and stays" title="Book stays near Katpana Desert and central Skardu" />
        <div className="grid gap-5 md:grid-cols-3">
          {hotelOptions.map((item, index) => (
            <AnimatedCard key={item.title} index={index}>
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-3 leading-7 text-[#59645f]">{item.text}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cars() {
  return (
    <motion.section
      id="cars"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={sectionReveal}
      transition={{ duration: 0.55 }}
      className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:px-10 lg:py-28"
    >
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#a97824]">Rent a car in Skardu</p>
        <h2 className="text-4xl font-black leading-tight sm:text-5xl">Vehicles for desert tracks, lakes, forts, and mountain roads</h2>
        <p className="mt-5 text-lg leading-8 text-[#59645f]">
          Tourists can request the right vehicle before they arrive: simple airport pickup, smooth city transfer,
          or a stronger 4x4 route for Deosai and valley roads.
        </p>
      </div>
      <div className="grid gap-4">
        {vehicles.map(([title, text], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="rounded-lg border border-[#17211f]/10 bg-white p-5 shadow-sm"
          >
            <strong className="text-lg">{title}</strong>
            <p className="mt-1 text-[#59645f]">{text}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function Attractions() {
  return (
    <section id="attractions" className="bg-[#173c35] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Attraction points" title="Top places to visit in Skardu from Katpana Desert" light />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {attractions.map(([title, text], index) => (
            <AnimatedCard key={title} index={index} dark>
              <span className="text-sm font-black text-[#f2c46f]">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-white/74">{text}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Itinerary() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Suggested route" title="Three-day Skardu tour plan for search visitors" />
        <div className="grid gap-4">
          {itinerary.map(([day, title, text], index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="grid gap-4 rounded-lg border border-[#17211f]/10 bg-white p-5 shadow-sm md:grid-cols-[120px_1fr]"
            >
              <span className="w-max rounded-full bg-[#173c35] px-4 py-2 text-sm font-black text-white">{day}</span>
              <div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-2 text-[#59645f]">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingForm({ onSubmit }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section id="booking" className="bg-[linear-gradient(135deg,#173c35,#102622)] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.22 }}
        variants={sectionReveal}
        transition={{ duration: 0.55 }}
        className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr]"
      >
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f2c46f]">Booking request</p>
          <h2 className="text-4xl font-black leading-tight sm:text-5xl">Send a Skardu travel quote directly to WhatsApp</h2>
          <p className="mt-5 text-lg leading-8 text-white/76">
            The form stays fast and static-friendly, but visitors still send a complete booking request with all answers
            already formatted for your WhatsApp chat.
          </p>
          <a
            className="mt-6 inline-flex rounded-md border border-white/30 bg-white/12 px-5 py-3 font-black transition hover:-translate-y-0.5 hover:bg-white/20"
            href="https://wa.me/923438160801"
            target="_blank"
            rel="noopener"
          >
            WhatsApp: 0343 8160801
          </a>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-7">
          <label className="grid gap-2 font-bold text-white/84">
            Travel service
            <select name="service" required className="rounded-md border border-white/20 bg-white/12 px-4 py-3 text-white outline-none focus:border-[#f2c46f]">
              <option className="text-[#17211f]">Hotel booking near Katpana Desert</option>
              <option className="text-[#17211f]">Skardu rent a car</option>
              <option className="text-[#17211f]">Full Skardu tour package</option>
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 font-bold text-white/84">
              Travel date
              <input name="date" type="date" className="rounded-md border border-white/20 bg-white/12 px-4 py-3 text-white outline-none focus:border-[#f2c46f]" />
            </label>
            <label className="grid gap-2 font-bold text-white/84">
              Travelers
              <input name="travelers" type="number" min="1" defaultValue="2" required className="rounded-md border border-white/20 bg-white/12 px-4 py-3 text-white outline-none focus:border-[#f2c46f]" />
            </label>
          </div>
          <label className="grid gap-2 font-bold text-white/84">
            Message
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us your hotel type, car preference, and attractions you want to visit."
              className="resize-none rounded-md border border-white/20 bg-white/12 px-4 py-3 text-white outline-none placeholder:text-white/45 focus:border-[#f2c46f]"
            />
          </label>
          <button type="submit" className="rounded-md bg-[#f2c46f] px-5 py-4 font-black text-[#17211f] transition hover:-translate-y-0.5 hover:bg-[#ffd98a]">
            Request booking quote on WhatsApp
          </button>
        </form>
      </motion.div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="bg-[#eef3f1] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Skardu travel FAQ" title="Answers tourists search before booking" />
        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
            >
              <details className="group rounded-lg border border-[#17211f]/10 bg-white p-5 shadow-sm" open={index === 0}>
                <summary className="cursor-pointer list-none text-lg font-black">
                  {faq.question}
                  <span className="float-right text-[#a97824] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-7 text-[#59645f]">{faq.answer}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className={`mb-3 text-xs font-black uppercase tracking-[0.16em] ${light ? "text-[#f2c46f]" : "text-[#a97824]"}`}>{eyebrow}</p>
      <h2 className={`text-4xl font-black leading-tight sm:text-5xl ${light ? "text-white" : "text-[#17211f]"}`}>{title}</h2>
    </div>
  );
}

function AnimatedCard({
  children,
  index,
  dark = false
}: {
  children: ReactNode;
  index: number;
  dark?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.32 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -6 }}
      className={`min-h-52 rounded-lg border p-6 shadow-sm transition ${
        dark
          ? "border-white/12 bg-white/8 text-white shadow-black/20"
          : "border-[#17211f]/10 bg-white text-[#17211f]"
      }`}
    >
      {children}
    </motion.article>
  );
}
