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
  primaryKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  schemaType?: string;
  faqs?: { question: string; answer: string }[];
  author?: string;
  lastUpdated?: string;
  relatedLinks?: { label: string; href: string }[];
  imageAlt?: string;
  imageTitle?: string;
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
    keywords: ["Deosai National Park safari", "Sheosar Lake", "Skardu 4x4 tour", "Deosai Plains"],
    primaryKeyword: "Deosai National Park safari",
    metaTitle: "Deosai National Park Safari | Katpana Desert Tour",
    metaDescription: "Deosai National Park safari guide with Sheosar Lake, 4x4 routes, weather, wildlife and Skardu timing. Book now.",
    canonicalPath: "/destinations/deosai-national-park",
    imageAlt: "Deosai National Park safari across high plateau and Sheosar Lake Pakistan",
    imageTitle: "Deosai National Park safari from Skardu by 4x4"
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
    keywords: ["Shigar Valley Skardu", "Shigar Fort", "Sarfaranga Cold Desert", "Skardu heritage tour"],
    primaryKeyword: "Shigar Valley Skardu",
    metaTitle: "Shigar Valley Skardu Guide | Katpana Desert Tour",
    metaDescription: "Shigar Valley Skardu guide to Shigar Fort, Sarfaranga, Balti culture, route timing and day trips. Explore.",
    canonicalPath: "/destinations/shigar-valley",
    imageAlt: "Shigar Valley Skardu heritage fort and Karakoram village route Pakistan",
    imageTitle: "Shigar Valley Skardu guide for forts culture and cold desert"
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
  },
  {
    slug: "upper-kachura-lake",
    name: "Upper Kachura Lake",
    region: "Skardu",
    type: "Alpine lake",
    bestSeason: "May to October, with autumn color strongest in September and October",
    image: "/images/places/kachura-lakes.jpg",
    overview:
      "Upper Kachura Lake Skardu is a clear alpine lake above the Kachura village route, known for short walks, boating, trout meals, family photography, and calm mountain views.",
    highlights: ["Upper Kachura village walk", "Boat rides", "Trout lunch stops", "Autumn lake reflections"],
    activities: ["Boating", "Short walking trail", "Family photography", "Lake-view meals"],
    idealFor: ["Families", "Couples", "Nature lovers", "First-time Skardu visitors"],
    travelNote:
      "Wear comfortable shoes because the final access often includes a short walk from the parking area to the lake edge.",
    keywords: ["Upper Kachura Lake Skardu", "Kachura Lake", "Skardu boating", "Skardu lake guide"],
    primaryKeyword: "Upper Kachura Lake Skardu",
    metaTitle: "Upper Kachura Lake Skardu | Katpana Desert Tour",
    metaDescription: "Upper Kachura Lake Skardu guide with boating, village walk, trout lunch, best season and route tips. Visit now.",
    canonicalPath: "/destinations/upper-kachura-lake",
    imageAlt: "Upper Kachura Lake Skardu alpine water and mountain village Pakistan",
    imageTitle: "Upper Kachura Lake Skardu boating and village travel guide",
    faqs: [
      {
        question: "What is Upper Kachura Lake Skardu famous for?",
        answer:
          "Upper Kachura Lake Skardu is famous for clear water, mountain reflections, short village walks, boating, and trout meals. It feels calmer than many busy lake stops and works well for families, couples, photographers, and first-time Skardu travelers."
      },
      {
        question: "How far is Upper Kachura Lake from Skardu city?",
        answer:
          "Upper Kachura Lake is usually around 45 to 60 minutes from Skardu city by car, depending on traffic, hotel location, and road conditions. The final access may include a short walk, so comfortable shoes help."
      },
      {
        question: "What is the best time to visit Upper Kachura Lake?",
        answer:
          "May to October is the best time to visit Upper Kachura Lake. Summer gives easier movement and boating, while September and October bring crisp air and autumn colors. Morning often gives calmer water and better reflections."
      },
      {
        question: "Can families visit Upper Kachura Lake Skardu?",
        answer:
          "Yes, families can visit Upper Kachura Lake Skardu comfortably with a private car and flexible timing. Keep children close near the water, carry warm layers, and allow time for the short walk, photos, and a relaxed meal."
      },
      {
        question: "Can Upper Kachura Lake be combined with Shangrila Lake?",
        answer:
          "Yes, Upper Kachura Lake and Shangrila Lake fit well in one Skardu day trip. Many travelers visit Lower Kachura first, then continue to Upper Kachura for boating, village scenery, and trout lunch before returning to Skardu."
      }
    ],
    author: "Katpana Desert Tour Local Planning Team",
    lastUpdated: "May 2026",
    relatedLinks: [
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "things to do in Skardu in summer", href: "/blog/things-to-do-skardu-summer/" },
      { label: "Satpara Lake Skardu", href: "/destinations/satpara-lake-skardu/" }
    ]
  },
  {
    slug: "satpara-lake-skardu",
    name: "Satpara Lake Skardu",
    region: "Skardu",
    type: "Lake and Deosai gateway",
    bestSeason: "April to October, with June to September best for Deosai combinations",
    image: "/images/places/deosai-plains.jpg",
    overview:
      "Satpara Lake Skardu is a blue mountain lake above the city and a natural gateway toward Deosai National Park, making it ideal for short visits, photos, and high-route warmups.",
    highlights: ["Satpara Lake viewpoint", "Deosai road gateway", "Short family stop", "Mountain water scenery"],
    activities: ["Photography", "Short sightseeing", "Deosai route stop", "Family travel"],
    idealFor: ["Families", "Deosai travelers", "Short-stay visitors", "Photographers"],
    travelNote:
      "Use Satpara Lake as a short morning or afternoon stop, or pair it with the Deosai route when the high plateau road is open.",
    keywords: ["Satpara Lake Skardu", "Sadpara Lake", "Skardu lake guide", "Deosai gateway"],
    primaryKeyword: "Satpara Lake Skardu",
    metaTitle: "Satpara Lake Skardu Guide | Katpana Desert Tour",
    metaDescription: "Satpara Lake Skardu guide with Deosai route tips, best season, family stops and lake viewpoints. Explore.",
    canonicalPath: "/destinations/satpara-lake-skardu",
    imageAlt: "Satpara Lake Skardu blue mountain water on route to Deosai Pakistan",
    imageTitle: "Satpara Lake Skardu guide for Deosai gateway and family stops",
    faqs: [
      {
        question: "What is Satpara Lake Skardu known for?",
        answer:
          "Satpara Lake Skardu is known for blue mountain water, quick access from Skardu city, and its position on the route toward Deosai National Park. It works well as a short scenic stop or a warm-up before higher roads."
      },
      {
        question: "How far is Satpara Lake from Skardu city?",
        answer:
          "Satpara Lake is close to Skardu city and often takes about 25 to 40 minutes by car, depending on hotel location and road traffic. It is one of the easier lake stops for families or travelers with limited time."
      },
      {
        question: "Can Satpara Lake be visited with Deosai National Park?",
        answer:
          "Yes, Satpara Lake is commonly visited on the way to Deosai National Park. Travelers often stop for photos before continuing toward Deosai Top, Bara Pani, Kala Pani, and Sheosar Lake when the summer road is open."
      },
      {
        question: "What is the best time to visit Satpara Lake Skardu?",
        answer:
          "April to October is the best time to visit Satpara Lake Skardu. June to September is ideal if you also want to continue toward Deosai. Early morning and late afternoon usually give softer light and calmer conditions."
      },
      {
        question: "Is Satpara Lake safe for families?",
        answer:
          "Satpara Lake is family-friendly when travelers stay near safe viewpoints, keep children away from steep edges, and follow local driver advice. Wind can rise quickly near the water, so warm layers are useful even on clear days."
      }
    ],
    author: "Katpana Desert Tour Local Planning Team",
    lastUpdated: "May 2026",
    relatedLinks: [
      { label: "Deosai National Park safari", href: "/destinations/deosai-national-park/" },
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "Skardu jeep safari guide", href: "/tours/jeep-safari-skardu/" }
    ]
  }
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function getRelatedDestinations(destination: Destination, limit = 3) {
  return destinations.filter((item) => item.slug !== destination.slug && item.type !== destination.type).slice(0, limit);
}
