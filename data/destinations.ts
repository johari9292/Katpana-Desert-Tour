export interface Destination {
  slug: string;
  name: string;
  region: string;
  type: string;
  bestSeason: string;
  image: string;
  overview: string;
  highlights: string[];
  activities: string[];
  idealFor: string[];
  travelNote: string;
  keywords: string[];
}

export const destinations: Destination[] = [
  {
    slug: "katapana-desert-skardu",
    name: "Katapana Desert",
    region: "Skardu",
    type: "Cold desert",
    bestSeason: "All year, strongest for sunrise, sunset, and winter snow",
    image: "/images/places/katapana-desert.jpg",
    overview:
      "Katapana Desert is the signature cold-desert landscape near Skardu, with soft sand, lake edges, and mountain backdrops close to the airport and city hotels.",
    highlights: ["Sunrise and sunset dunes", "Katapana Lake", "Snow desert views in winter", "Easy first-day sightseeing"],
    activities: ["Photography", "Short walks", "Family sightseeing", "Desert-view hotel stays"],
    idealFor: ["Families", "Couples", "First-time visitors", "Photographers"],
    travelNote: "Arrive before golden hour and keep warm layers ready because the wind can feel cold even when the day is clear.",
    keywords: ["Katapana Desert", "Skardu cold desert", "Katapana Desert tour", "hotels near Katapana"]
  },
  {
    slug: "deosai-national-park",
    name: "Deosai National Park",
    region: "Skardu and Astore",
    type: "High-altitude plateau",
    bestSeason: "June to September",
    image: "/images/places/deosai-plains.jpg",
    overview:
      "Deosai is a vast summer plateau of lakes, rivers, wildflowers, and big skies. It is one of the strongest adventure day trips from Skardu when the road is open.",
    highlights: ["Sheosar Lake", "Bara Pani", "Kala Pani", "High plateau landscapes"],
    activities: ["4x4 safari", "Wildlife-aware viewing", "Landscape photography", "Picnic stops"],
    idealFor: ["Adventure travelers", "Photographers", "Groups", "Nature lovers"],
    travelNote: "Use a local 4x4 driver, start early, and keep the day flexible because weather can shift quickly on the plains.",
    keywords: ["Deosai National Park", "Sheosar Lake", "Skardu 4x4 tour", "Deosai Plains"]
  },
  {
    slug: "kachura-lakes",
    name: "Kachura Lakes",
    region: "Skardu",
    type: "Lake and village route",
    bestSeason: "April to October",
    image: "/images/places/kachura-lakes.jpg",
    overview:
      "The Kachura lake circuit combines Shangrila, Lower Kachura, Upper Kachura, village scenery, boating, and trout meals into one relaxed Skardu day.",
    highlights: ["Shangrila Lake", "Upper Kachura walk", "Boat rides", "Trout lunch spots"],
    activities: ["Boating", "Village walks", "Family photography", "Lake-view dining"],
    idealFor: ["Families", "Couples", "Soft adventure travelers", "Food lovers"],
    travelNote: "Comfortable shoes help because Upper Kachura often includes a short walk from the parking area.",
    keywords: ["Shangrila Lake", "Upper Kachura", "Skardu lakes", "Kachura tour"]
  },
  {
    slug: "shigar-valley",
    name: "Shigar Valley",
    region: "Baltistan",
    type: "Heritage and desert route",
    bestSeason: "April to October",
    image: "/images/places/shigar-fort-valley.jpg",
    overview:
      "Shigar Valley links Skardu with heritage architecture, orchards, old streets, Sarfaranga Cold Desert, and the route toward Askole and the Karakoram trekking zone.",
    highlights: ["Shigar Fort", "Sarfaranga Cold Desert", "Old bazaar lanes", "Askole route gateway"],
    activities: ["Heritage tours", "Desert photography", "Cafe stops", "Cultural sightseeing"],
    idealFor: ["Culture travelers", "Photographers", "Families", "Trekking teams"],
    travelNote: "Pair Shigar Fort with Sarfaranga for a full day that still returns comfortably to Skardu.",
    keywords: ["Shigar Fort", "Shigar Valley", "Sarfaranga Cold Desert", "Skardu heritage tour"]
  },
  {
    slug: "khaplu-ghanche-valley",
    name: "Khaplu and Ghanche Valley",
    region: "Ghanche",
    type: "Palace, river, and cultural valley",
    bestSeason: "May to October",
    image: "/images/places/khaplu-palace.jpg",
    overview:
      "Khaplu is a slower cultural destination with palace architecture, river views, old mosques, and villages that reward an overnight stay instead of a rushed day trip.",
    highlights: ["Khaplu Palace", "Chaqchan Mosque", "Shyok River", "Village landscapes"],
    activities: ["Cultural walks", "Architecture photography", "River viewpoints", "Overnight stays"],
    idealFor: ["Couples", "Culture lovers", "Slow travelers", "Families"],
    travelNote: "Plan fuel, meals, and return timing before leaving Skardu because the drive is long and scenic.",
    keywords: ["Khaplu Palace", "Ghanche Valley", "Balti culture", "Khaplu tour"]
  },
  {
    slug: "k2-base-camp-baltoro",
    name: "K2 Base Camp and Baltoro",
    region: "Central Karakoram",
    type: "Trekking expedition",
    bestSeason: "June to August",
    image: "/images/places/k2-base-camp.jpg",
    overview:
      "The K2 Base Camp route starts from Skardu logistics, passes through Shigar and Askole, and continues onto the Baltoro Glacier toward Concordia.",
    highlights: ["Askole roadhead", "Baltoro Glacier", "Concordia", "K2 Base Camp"],
    activities: ["Expedition trekking", "Camping", "Glacier travel", "Mountain photography"],
    idealFor: ["Experienced trekkers", "Expedition teams", "International adventure travelers", "Mountain photographers"],
    travelNote: "This route needs permits, guides, porter systems, insurance, gear checks, and buffer days for mountain conditions.",
    keywords: ["K2 Base Camp", "Concordia trek", "Baltoro Glacier", "Askole"]
  },
  {
    slug: "hunza-valley",
    name: "Hunza Valley",
    region: "Gilgit Baltistan",
    type: "Karakoram Highway and culture",
    bestSeason: "April to October",
    image: "/images/places/hunza-valley.jpg",
    overview:
      "Hunza adds forts, terraced villages, Attabad Lake, Passu Cones, and Karakoram Highway viewpoints to a wider northern Pakistan itinerary.",
    highlights: ["Karimabad", "Baltit and Altit Forts", "Attabad Lake", "Passu Cones"],
    activities: ["Road trips", "Fort visits", "Lake boating", "Viewpoint photography"],
    idealFor: ["Road trip travelers", "Families", "Couples", "Culture tourists"],
    travelNote: "Give Hunza enough nights of its own because combining it with Skardu in too little time turns the route into long transfer days.",
    keywords: ["Hunza Valley", "Hunza Skardu tour", "Attabad Lake", "Passu Cones"]
  },
  {
    slug: "astore-rama-nanga-parbat",
    name: "Astore, Rama and Nanga Parbat Views",
    region: "Astore",
    type: "Meadows and mountain viewpoints",
    bestSeason: "June to September",
    image: "/images/places/astore-rama-meadows.jpg",
    overview:
      "Astore brings forested valleys, Rama Meadows, and seasonal Nanga Parbat viewpoint options into an extended Skardu or Gilgit Baltistan plan.",
    highlights: ["Rama Meadows", "Astore Valley", "Seasonal Deosai crossing", "Nanga Parbat viewpoints"],
    activities: ["Meadow walks", "4x4 road trips", "Mountain photography", "Seasonal side trips"],
    idealFor: ["Repeat visitors", "Photographers", "Adventure road trippers", "Small groups"],
    travelNote: "Confirm local access, permits where relevant, and road status before treating this as a fixed route.",
    keywords: ["Astore Valley", "Rama Meadows", "Nanga Parbat viewpoint", "Deosai to Astore"]
  }
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function getRelatedDestinations(destination: Destination, limit = 3) {
  return destinations.filter((item) => item.slug !== destination.slug && item.type !== destination.type).slice(0, limit);
}
