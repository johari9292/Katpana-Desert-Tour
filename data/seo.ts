import { BRAND_NAME, SITE_URL } from "@/constants/brand";

export interface SEOFaq {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface SEOSection {
  heading: string;
  body: string;
}

export interface SEOPage {
  slug: string;
  path: string;
  primaryKeyword: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  imageTitle: string;
  category: "pillar" | "trek" | "blog";
  schemaType: "TouristDestination" | "Article";
  cta: string;
  lastUpdated: string;
  author: string;
  sections: SEOSection[];
  faqs: SEOFaq[];
  relatedLinks: RelatedLink[];
  keywords: string[];
}

export const SKARDU_GEO = {
  "@type": "GeoCoordinates",
  latitude: 35.2971,
  longitude: 75.6358
};

export const seoAuthor = "Katpana Desert Tour Local Planning Team";
export const lastUpdated = "May 2026";

export const authorityLinks: RelatedLink[] = [
  { label: "Alpine Club of Pakistan permit guidance", href: "https://alpineclub.org.pk/" },
  { label: "PTDC Pakistan travel information", href: "https://tourism.gov.pk/" },
  { label: "Pakistan Meteorological Department forecasts", href: "https://www.pmd.gov.pk/" }
];

export const commonTravelFaqs: SEOFaq[] = [
  {
    question: "What is the best time to visit Skardu?",
    answer:
      "The best time to visit Skardu is May to October for lake trips, jeep routes, and most family tours. June to August works best for K2 and Baltoro trekking. April brings blossom color, while September and October give clearer light, cooler roads, and strong autumn views."
  },
  {
    question: "How do I get to Skardu from Islamabad?",
    answer:
      "You can reach Skardu from Islamabad by direct flight when weather allows or by road through the Karakoram Highway and Jaglot-Skardu Road. Flights take about one hour after boarding. The road journey usually needs a long day or an overnight stop because mountain traffic and landslides can change timing."
  },
  {
    question: "Is a permit required for K2 base camp?",
    answer:
      "Yes, foreign trekkers normally need trekking permits for the K2 base camp route because it enters restricted Central Karakoram areas. A licensed local operator helps with permits, guide documents, porter systems, and security paperwork. Domestic requirements can also change, so confirm before booking."
  },
  {
    question: "How many days do I need for the Baltoro Glacier trek?",
    answer:
      "Most Baltoro Glacier and Concordia treks need 18 to 21 days from Islamabad, including Skardu preparation, Askole jeep travel, glacier walking days, rest time, and weather buffers. Strong hikers should still keep extra days because flights, roads, river crossings, and altitude can affect the schedule."
  },
  {
    question: "Is Skardu safe for foreign tourists?",
    answer:
      "Skardu is generally welcoming for foreign tourists who travel with realistic plans, local guidance, and respect for village culture. Use registered hotels, confirm route conditions, carry passport copies, and avoid remote trekking routes without guides. Weather, altitude, and road safety matter more than city crime for most visitors."
  }
];

const pillarRelated: RelatedLink[] = [
  { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
  { label: "Gilgit-Baltistan tourism", href: "/gilgit-baltistan-tourism/" },
  { label: "Pakistan trekking guide", href: "/pakistan-trekking-guide/" },
  { label: "K2 base camp trek", href: "/treks/k2-base-camp/" },
  { label: "Karakoram Highway travel", href: "/karakoram-highway-travel/" },
  { label: "Deosai National Park safari", href: "/destinations/deosai-national-park/" }
];

export const pillarPages: SEOPage[] = [
  {
    slug: "skardu-travel-guide",
    path: "/skardu-travel-guide",
    primaryKeyword: "Skardu travel guide",
    title: "Skardu travel guide for first-time visitors",
    metaTitle: "Skardu Travel Guide 2026 | Katpana Desert Tour",
    metaDescription:
      "Skardu travel guide 2026 with routes, costs, weather, hotels, jeeps and local tips for first-time visitors. Plan now.",
    eyebrow: "Pillar guide",
    excerpt:
      "This Skardu travel guide gives a simple plan for lakes, cold desert sunsets, Balti culture, jeep tracks, weather, hotels, and day trips across the Karakoram.",
    image: "/images/katpana-skardu-hero.png",
    imageAlt: "Skardu travel guide cold desert and Karakoram mountains Pakistan",
    imageTitle: "Skardu travel guide for cold desert lakes and mountain routes",
    category: "pillar",
    schemaType: "Article",
    cta: "Download the Skardu Guide",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Skardu travel guide route overview",
        body:
          "A strong Skardu travel guide starts with timing. Spend day 1 near Skardu city and Katpana Desert, day 2 around Shangrila and Upper Kachura Lake, day 3 in Shigar Valley, and day 4 on Deosai if the plateau road is open. Add Khaplu or a K2-side trek when you have more days."
      },
      {
        heading: "Best time to visit Skardu Pakistan",
        body:
          "May to October gives the easiest Skardu travel season. Summer opens Deosai, Basho, and high jeep routes. September and October bring calmer roads, clear mountain light, apricot harvest colors, and better photography. Winter works for snow views, but flights, heating, and road buffers become more important."
      },
      {
        heading: "How to reach Skardu from Islamabad",
        body:
          "The fastest route is the Islamabad to Skardu flight. Weather can cancel mountain flights, so keep one buffer day. By road, travelers follow the Karakoram Highway, turn near Jaglot, and continue on the Skardu road. Hire a driver who knows landslide zones, fuel points, and safe night stops."
      },
      {
        heading: "Skardu hotels jeeps and local planning",
        body:
          "Choose a city hotel for markets and restaurants, a Katpana stay for desert sunsets, or Kachura for lake views. Regular cars work for city, airport, Kachura, and Shigar. Use a 4x4 for Deosai, Basho, Askole-side roads, and rough alpine tracks."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: pillarRelated,
    keywords: ["Skardu travel guide", "Skardu tourism", "Skardu itinerary", "Gilgit Baltistan travel"]
  },
  {
    slug: "gilgit-baltistan-tourism",
    path: "/gilgit-baltistan-tourism",
    primaryKeyword: "Gilgit-Baltistan tourism",
    title: "Gilgit-Baltistan tourism guide for mountain travel",
    metaTitle: "Gilgit-Baltistan Tourism 2026 | Katpana Desert Tour",
    metaDescription:
      "Gilgit-Baltistan tourism 2026 guide to Skardu, Hunza, Deosai, K2 routes, culture and safe planning. Start here.",
    eyebrow: "Destination hub",
    excerpt:
      "Gilgit-Baltistan tourism connects the Karakoram, Himalayas, cold deserts, glaciers, alpine lakes, and Balti culture into one of Asia's strongest mountain travel regions.",
    image: "/images/places/hunza-valley.jpg",
    imageAlt: "Gilgit-Baltistan tourism Karakoram Highway valleys and mountain villages Pakistan",
    imageTitle: "Gilgit-Baltistan tourism guide for Skardu Hunza and Karakoram travel",
    category: "pillar",
    schemaType: "TouristDestination",
    cta: "Talk to a Local Expert",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Gilgit-Baltistan tourism regions",
        body:
          "Gilgit-Baltistan tourism works best when you divide the region into Skardu, Hunza, Astore, Ghizer, and trekking corridors. Skardu gives cold deserts, lakes, Deosai, Shigar, Khaplu, and K2 logistics. Hunza adds forts, Passu Cones, Attabad Lake, and Karakoram Highway culture."
      },
      {
        heading: "Culture lakes glaciers and jeep routes",
        body:
          "Travelers come for glaciers, alpine lakes, mountain villages, apricot season, and Balti culture. Many highlights need patient road planning. A local driver helps with jeep tracks, hotel timing, fuel stops, village etiquette, and route changes after rain or landslides."
      },
      {
        heading: "Cheapest way to travel to Gilgit-Baltistan",
        body:
          "The cheapest way to travel to Gilgit-Baltistan is usually shared road transport plus simple hotels, but it costs time. Families and short-stay visitors often save stress with private transport. Group nearby sights into one car day to avoid paying for repeated short transfers."
      },
      {
        heading: "Safety and responsible tourism",
        body:
          "Gilgit-Baltistan tourism depends on fragile mountain environments. Carry waste back to towns, dress respectfully in villages, support local hotels and drivers, and avoid loud behavior near homes, mosques, and farms. For trekking, confirm permits, rescue cover, porters, and altitude plans."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: pillarRelated,
    keywords: ["Gilgit-Baltistan tourism", "northern Pakistan", "Skardu tourism", "Hunza travel"]
  },
  {
    slug: "pakistan-mountain-tourism",
    path: "/pakistan-mountain-tourism",
    primaryKeyword: "Pakistan mountain tourism",
    title: "Pakistan mountain tourism in the Karakoram",
    metaTitle: "Pakistan Mountain Tourism 2026 | Katpana Desert Tour",
    metaDescription:
      "Pakistan mountain tourism 2026 guide to K2, Skardu, Hunza, Deosai, glaciers and cultural routes. Explore now.",
    eyebrow: "Mountain tourism hub",
    excerpt:
      "Pakistan mountain tourism reaches its highest form in Skardu and the Karakoram, where glaciers, trekking permits, jeeps, porters, villages, and alpine lakes shape every route.",
    image: "/images/places/k2-base-camp.jpg",
    imageAlt: "Pakistan mountain tourism trekkers near K2 base camp Karakoram Pakistan",
    imageTitle: "Pakistan mountain tourism guide for K2 Skardu and Karakoram routes",
    category: "pillar",
    schemaType: "TouristDestination",
    cta: "Book Your Skardu Adventure",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Pakistan mountain tourism route families",
        body:
          "Pakistan mountain tourism includes easy lake days, 4x4 plateau safaris, cultural valleys, and serious expeditions. First-time visitors should start with Skardu, Kachura, Shigar, Khaplu, and Deosai. Experienced trekkers can extend toward Askole, Baltoro Glacier, Concordia, and K2 base camp."
      },
      {
        heading: "Altitude acclimatization and trekking permits",
        body:
          "Altitude acclimatization matters above Skardu. Build gradual days before trekking, drink water, sleep well, and avoid rushing from the airport into high terrain. Restricted routes need trekking permits, guide coordination, porter systems, and clear emergency planning."
      },
      {
        heading: "Mountain village culture",
        body:
          "The best Pakistan mountain tourism is not only about peaks. Mountain villages, Balti food, apricot orchards, old forts, mosques, and river valleys give context to every drive. Ask before photographing people and support local shops, drivers, cooks, and guides."
      },
      {
        heading: "Planning around weather",
        body:
          "Weather decides many mountain plans. Flights can cancel, Deosai can close, and trekking routes can slow after rain or snow. Check forecasts, use buffer days, and keep a lower-altitude backup such as Shigar, Kachura, Satpara, or Katpana Desert."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: pillarRelated,
    keywords: ["Pakistan mountain tourism", "Karakoram travel", "Skardu adventure", "K2 trekking"]
  },
  {
    slug: "pakistan-trekking-guide",
    path: "/pakistan-trekking-guide",
    primaryKeyword: "best trekking in Pakistan",
    title: "Best trekking in Pakistan from Skardu",
    metaTitle: "Best Trekking in Pakistan 2026 | Katpana Desert Tour",
    metaDescription:
      "Best trekking in Pakistan 2026 guide to K2, Baltoro, Concordia, Fairy Meadows and Skardu routes. Plan today.",
    eyebrow: "Trekking pillar",
    excerpt:
      "The best trekking in Pakistan ranges from Fairy Meadows viewpoints to the demanding Baltoro Glacier and K2 base camp route from Skardu.",
    image: "/images/places/k2-base-camp.jpg",
    imageAlt: "best trekking in Pakistan Baltoro Glacier route to K2 base camp",
    imageTitle: "Best trekking in Pakistan guide for K2 Baltoro and Fairy Meadows",
    category: "pillar",
    schemaType: "Article",
    cta: "Plan Your K2 Trek",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Best trekking in Pakistan by difficulty",
        body:
          "The best trekking in Pakistan depends on fitness and time. Fairy Meadows works for strong beginners with a jeep and hike. K2 base camp, Baltoro Glacier, and Concordia require expedition fitness, camping systems, porters, permits, and long weather buffers."
      },
      {
        heading: "K2 base camp trek cost and itinerary",
        body:
          "K2 base camp trek cost depends on group size, permit category, porter load, food, guide team, and hotel level. Most itineraries need 18 to 21 days from Islamabad, including Skardu preparation, Askole jeep travel, glacier camps, Concordia, and return buffers."
      },
      {
        heading: "Porters guides and camp systems",
        body:
          "Do not cut corners on porters, guides, cooks, tents, food, or rescue cover. The Karakoram is remote and weather can shift fast. A good support team keeps the route safer, manages load rules, protects camps, and helps trekkers move at a steady pace."
      },
      {
        heading: "When to trek in northern Pakistan",
        body:
          "June to August is the classic window for K2 and Baltoro. Fairy Meadows often works from late spring to early autumn. Shoulder seasons can be quieter, but snow, road closures, and colder nights demand stronger planning."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "K2 base camp trek", href: "/treks/k2-base-camp/" },
      { label: "Baltoro Glacier expedition", href: "/treks/baltoro-glacier/" },
      { label: "Concordia Pakistan trek", href: "/treks/concordia-pakistan/" },
      { label: "Fairy Meadows Pakistan", href: "/treks/fairy-meadows/" }
    ],
    keywords: ["best trekking in Pakistan", "K2 base camp trek", "Baltoro Glacier", "Fairy Meadows Pakistan"]
  },
  {
    slug: "karakoram-highway-travel",
    path: "/karakoram-highway-travel",
    primaryKeyword: "Karakoram Highway travel",
    title: "Karakoram Highway travel guide",
    metaTitle: "Karakoram Highway Travel 2026 | Katpana Desert Tour",
    metaDescription:
      "Karakoram Highway travel 2026 guide for Hunza, Gilgit, Skardu road links, stops, safety and timing. Plan now.",
    eyebrow: "Road guide",
    excerpt:
      "Karakoram Highway travel links Islamabad with Gilgit-Baltistan through river valleys, mountain villages, Hunza viewpoints, and road connections toward Skardu.",
    image: "/images/places/hunza-valley.jpg",
    imageAlt: "Karakoram Highway travel through Hunza and Gilgit-Baltistan Pakistan",
    imageTitle: "Karakoram Highway travel guide for Hunza Gilgit and Skardu",
    category: "pillar",
    schemaType: "Article",
    cta: "Get a Free Trip Quote",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Karakoram Highway travel route",
        body:
          "Karakoram Highway travel usually starts from Islamabad and follows the Indus and Gilgit river systems toward Hunza. Skardu travelers often connect through Gilgit, Jaglot, and the Skardu road. The route is scenic, but timing changes with traffic, weather, and landslide work."
      },
      {
        heading: "Best stops on the Karakoram Highway",
        body:
          "Key stops include Besham or Chilas for overnight breaks, Gilgit for supplies, Hunza for forts and viewpoints, Attabad Lake, Passu Cones, and the junction toward Skardu. Build stops around daylight because mountain roads are easier and safer to read during the day."
      },
      {
        heading: "Road safety and vehicle choice",
        body:
          "Use a driver who knows the Karakoram Highway, not only city roads. Keep water, snacks, warm layers, cash, and offline maps. Families should avoid overpacked transfer days. A private vehicle gives more control over rest stops and photo timing."
      },
      {
        heading: "Connecting Hunza and Skardu",
        body:
          "Hunza and Skardu deserve separate nights. Rushing both regions turns the trip into long transfers. Give Hunza time for Karimabad, Attabad, and Passu, then give Skardu time for Katpana Desert, Kachura, Shigar, Deosai, and Khaplu."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: pillarRelated,
    keywords: ["Karakoram Highway travel", "Hunza road trip", "Gilgit to Skardu", "Pakistan road travel"]
  }
];

export const trekPages: SEOPage[] = [
  {
    slug: "k2-base-camp",
    path: "/treks/k2-base-camp",
    primaryKeyword: "K2 base camp trek",
    title: "K2 base camp trek guide from Skardu",
    metaTitle: "K2 Base Camp Trek Guide 2026 | Katpana Desert Tour",
    metaDescription:
      "K2 base camp trek 2026 guide with itinerary, cost factors, permits, porters and Skardu logistics. Plan your trek.",
    eyebrow: "Karakoram trek",
    excerpt:
      "The K2 base camp trek reaches about 5,150m after days on the Baltoro Glacier, with Skardu, Shigar, Askole, Concordia, and porter planning shaping the route.",
    image: "/images/places/k2-base-camp.jpg",
    imageAlt: "trekkers on Baltoro Glacier route to K2 base camp Karakoram Pakistan",
    imageTitle: "K2 base camp trek route from Skardu through Baltoro Glacier",
    category: "trek",
    schemaType: "Article",
    cta: "Plan Your K2 Trek",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "K2 base camp trek itinerary",
        body:
          "A normal K2 base camp trek takes 18 to 21 days from Islamabad. Trekkers fly or drive to Skardu, prepare gear, ride jeeps to Askole, walk through Paiju and Urdukas, cross Baltoro Glacier, reach Concordia, then continue toward K2 base camp if weather and fitness allow."
      },
      {
        heading: "K2 base camp trek cost and permits",
        body:
          "Cost depends on permits, guide team, porters, food, tents, transport, hotels, rescue cover, and group size. Foreign trekkers normally need restricted-area trekking permits. Work with a local operator because documents, porter rules, and route conditions change."
      },
      {
        heading: "Altitude acclimatization on the route",
        body:
          "Skardu sits around 2,438m and helps the body adjust before the glacier. Move slowly on the Baltoro, drink water, eat well, and listen to guide advice. Headache, nausea, or unusual fatigue need attention because altitude problems can grow quickly."
      },
      {
        heading: "What to pack for K2 base camp",
        body:
          "Bring broken-in boots, layered clothing, warm sleeping gear, waterproof shells, sun protection, trekking poles, personal medicine, and glacier-ready camp clothing. The route is remote, so small gear failures can become serious problems."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "best trekking in Pakistan", href: "/pakistan-trekking-guide/" },
      { label: "Baltoro Glacier expedition", href: "/treks/baltoro-glacier/" },
      { label: "Concordia Pakistan trek", href: "/treks/concordia-pakistan/" },
      { label: "K2 base camp trek packages", href: "/tours/k2-trek-packages/" }
    ],
    keywords: ["K2 base camp trek", "K2 base camp trek cost", "Baltoro Glacier", "Concordia Pakistan"]
  },
  {
    slug: "baltoro-glacier",
    path: "/treks/baltoro-glacier",
    primaryKeyword: "Baltoro Glacier expedition",
    title: "Baltoro Glacier expedition guide",
    metaTitle: "Baltoro Glacier Expedition 2026 | Katpana Desert Tour",
    metaDescription:
      "Baltoro Glacier expedition 2026 guide to Skardu, Askole, porters, camps, permits and Concordia. Plan safely.",
    eyebrow: "Glacier expedition",
    excerpt:
      "A Baltoro Glacier expedition is the classic Karakoram approach to Concordia and K2 views, using Skardu logistics, Askole jeeps, porters, and high camp systems.",
    image: "/images/places/k2-base-camp.jpg",
    imageAlt: "Baltoro Glacier expedition camp route in the Karakoram near K2 Pakistan",
    imageTitle: "Baltoro Glacier expedition planning from Skardu to Concordia",
    category: "trek",
    schemaType: "Article",
    cta: "Plan Your K2 Trek",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Baltoro Glacier expedition route",
        body:
          "A Baltoro Glacier expedition starts with Skardu preparation, a jeep route through Shigar and Braldu, and the walk from Askole toward Paiju, Urdukas, Goro, and Concordia. Each camp has different water, wind, and altitude conditions."
      },
      {
        heading: "Porters camps and food planning",
        body:
          "Porters, cooks, tents, fuel, and food shape the expedition more than any single viewpoint. Plan loads fairly, carry enough buffer food, and keep camp systems simple. A strong local team protects safety and reduces stress on the glacier."
      },
      {
        heading: "Weather on the Baltoro",
        body:
          "The Baltoro can swing from strong sun to cold wind fast. Glacier glare burns skin, storms slow progress, and river crossings can change timing. Trekking sunglasses, sunscreen, layered clothing, and patient guide decisions matter every day."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "K2 base camp trek", href: "/treks/k2-base-camp/" },
      { label: "Concordia Pakistan trek", href: "/treks/concordia-pakistan/" },
      { label: "best trekking in Pakistan", href: "/pakistan-trekking-guide/" }
    ],
    keywords: ["Baltoro Glacier expedition", "Baltoro trek", "Concordia trek", "Skardu trekking"]
  },
  {
    slug: "concordia-pakistan",
    path: "/treks/concordia-pakistan",
    primaryKeyword: "Concordia Pakistan trek",
    title: "Concordia Pakistan trek guide",
    metaTitle: "Concordia Pakistan Trek 2026 | Katpana Desert Tour",
    metaDescription:
      "Concordia Pakistan trek 2026 guide with route, camps, K2 views, permits and Skardu logistics. Plan today.",
    eyebrow: "High mountain trek",
    excerpt:
      "The Concordia Pakistan trek reaches one of the world's great mountain amphitheaters where K2, Broad Peak, Gasherbrum views, and Baltoro Glacier camps meet.",
    image: "/images/places/k2-base-camp.jpg",
    imageAlt: "Concordia Pakistan trek mountain amphitheater near K2 and Baltoro Glacier",
    imageTitle: "Concordia Pakistan trek route from Skardu and Askole",
    category: "trek",
    schemaType: "Article",
    cta: "Plan Your K2 Trek",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Concordia Pakistan trek overview",
        body:
          "The Concordia Pakistan trek follows the Baltoro Glacier from Askole toward the meeting point of great Karakoram peaks. Many trekkers treat Concordia as the main objective, while stronger teams continue toward K2 base camp after a rest and weather check."
      },
      {
        heading: "How many days Concordia needs",
        body:
          "Most Concordia plans need 16 to 20 days from Islamabad, depending on flights, roads, acclimatization, and return buffers. Do not remove buffer days. The route is remote, and Skardu flight changes or trail delays can affect the whole plan."
      },
      {
        heading: "Fitness and altitude planning",
        body:
          "Concordia is not technical climbing, but it is a long high-altitude camping trek. Train with loaded hikes, build endurance, and prepare for cold nights. Guides should monitor pace, hydration, appetite, and symptoms during the glacier approach."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "K2 base camp trek", href: "/treks/k2-base-camp/" },
      { label: "Baltoro Glacier expedition", href: "/treks/baltoro-glacier/" },
      { label: "best trekking in Pakistan", href: "/pakistan-trekking-guide/" }
    ],
    keywords: ["Concordia Pakistan trek", "Concordia trek", "K2 views", "Baltoro Glacier"]
  },
  {
    slug: "fairy-meadows",
    path: "/treks/fairy-meadows",
    primaryKeyword: "Fairy Meadows Pakistan",
    title: "Fairy Meadows Pakistan trekking guide",
    metaTitle: "Fairy Meadows Pakistan 2026 | Katpana Desert Tour",
    metaDescription:
      "Fairy Meadows Pakistan 2026 guide to Nanga Parbat views, jeep track, hiking time, safety and route planning. Go.",
    eyebrow: "Nanga Parbat trek",
    excerpt:
      "Fairy Meadows Pakistan gives close Nanga Parbat views with a dramatic jeep track, forest hike, wooden huts, and a shorter trekking option than the Baltoro route.",
    image: "/images/places/astore-rama-meadows.jpg",
    imageAlt: "Fairy Meadows Pakistan style alpine meadow and Nanga Parbat mountain route",
    imageTitle: "Fairy Meadows Pakistan trek planning for Nanga Parbat views",
    category: "trek",
    schemaType: "Article",
    cta: "Check Availability",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Fairy Meadows Pakistan route",
        body:
          "Fairy Meadows Pakistan is reached from the Karakoram Highway through Raikot Bridge, a narrow jeep track, and a hike to the meadows. The route is shorter than K2 treks, but the jeep section, trail exposure, and weather still need careful planning."
      },
      {
        heading: "Best time for Nanga Parbat views",
        body:
          "June to September gives the most practical window for Fairy Meadows. Clear mornings often give the best Nanga Parbat views. Shoulder months can be quieter, but snow, cold nights, and road conditions can limit access."
      },
      {
        heading: "Who should choose Fairy Meadows",
        body:
          "Choose Fairy Meadows if you want a strong mountain experience without a three-week expedition. It suits fit families, photographers, and travelers combining Hunza, Astore, or Skardu. People afraid of exposed jeep tracks should discuss the route first."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "best trekking in Pakistan", href: "/pakistan-trekking-guide/" },
      { label: "Pakistan mountain tourism", href: "/pakistan-mountain-tourism/" },
      { label: "Karakoram Highway travel", href: "/karakoram-highway-travel/" }
    ],
    keywords: ["Fairy Meadows Pakistan", "Nanga Parbat views", "Pakistan trekking", "Karakoram Highway"]
  }
];

export const blogPages: SEOPage[] = [
  {
    slug: "best-time-to-visit-skardu",
    path: "/blog/best-time-to-visit-skardu",
    primaryKeyword: "best time to visit Skardu Pakistan",
    title: "Best time to visit Skardu Pakistan",
    metaTitle: "Best Time to Visit Skardu Pakistan 2026 | Katpana",
    metaDescription:
      "Best time to visit Skardu Pakistan in 2026 by month, weather, Deosai access, flights and hotel demand. Plan now.",
    eyebrow: "Season guide",
    excerpt:
      "The best time to visit Skardu Pakistan depends on whether you want Deosai, lake weather, blossom, autumn color, snow, or K2 trekking routes.",
    image: "/images/places/katapana-desert.jpg",
    imageAlt: "best time to visit Skardu Pakistan Katpana Desert and mountains by season",
    imageTitle: "Best time to visit Skardu Pakistan monthly weather guide",
    category: "blog",
    schemaType: "Article",
    cta: "Download the Skardu Guide",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Best time to visit Skardu Pakistan by season",
        body:
          "The best time to visit Skardu Pakistan is May to October for most travelers. June to September opens Deosai and high jeep routes. April brings blossom and cool evenings. September and October bring autumn color, clear skies, and fewer peak-season crowds."
      },
      {
        heading: "Skardu weather month by month",
        body:
          "April is cool and scenic. May warms up. June to August is peak summer and trekking season. September is clear and comfortable. October brings autumn. November to March is cold, with snow possible around Katpana, Kachura, and higher valleys."
      },
      {
        heading: "When to avoid rushed trips",
        body:
          "Avoid very tight plans in winter or during unsettled flight weather. Skardu is safe to enjoy when you keep buffer days, confirm heating, and choose routes that match the season. Deosai and remote jeep tracks need extra caution outside summer."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "Skardu weather month by month", href: "/blog/skardu-weather-month-by-month/" },
      { label: "things to do in Skardu in summer", href: "/blog/things-to-do-skardu-summer/" }
    ],
    keywords: ["best time to visit Skardu Pakistan", "Skardu weather", "Skardu seasons", "Deosai season"]
  },
  {
    slug: "how-to-reach-skardu-from-islamabad",
    path: "/blog/how-to-reach-skardu-from-islamabad",
    primaryKeyword: "how to reach Skardu from Islamabad",
    title: "How to reach Skardu from Islamabad",
    metaTitle: "How to Reach Skardu from Islamabad 2026 | Katpana",
    metaDescription:
      "How to reach Skardu from Islamabad in 2026 by flight or road, with timing, buffers and route tips. Plan today.",
    eyebrow: "Transport guide",
    excerpt:
      "How to reach Skardu from Islamabad comes down to two choices: a weather-dependent mountain flight or a long road journey through northern Pakistan.",
    image: "/images/places/shigar-fort-valley.jpg",
    imageAlt: "how to reach Skardu from Islamabad by Karakoram Highway and mountain road",
    imageTitle: "How to reach Skardu from Islamabad flight and road guide",
    category: "blog",
    schemaType: "Article",
    cta: "Talk to a Local Expert",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "How to reach Skardu from Islamabad by air",
        body:
          "The fastest way is the Islamabad to Skardu flight. It is one of Pakistan's most scenic flights, but weather decides the schedule. Keep a buffer day if you have hotel bookings, trekking permits, or international connections."
      },
      {
        heading: "How to reach Skardu from Islamabad by road",
        body:
          "The road route uses the Karakoram Highway, then the Skardu road from the Gilgit-Jaglot side. It can take a very long day or an overnight stop. Families should avoid late-night mountain driving and use an experienced driver."
      },
      {
        heading: "Cheapest way to reach Skardu",
        body:
          "Shared transport can be cheaper, but it takes more time and gives less control over stops. Private transport costs more but helps families, photographers, and groups manage luggage, meals, safe breaks, and arrival timing."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "Karakoram Highway travel", href: "/karakoram-highway-travel/" },
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "cheapest way to travel to Gilgit-Baltistan", href: "/blog/cheapest-way-to-gilgit-baltistan/" }
    ],
    keywords: ["how to reach Skardu from Islamabad", "Islamabad to Skardu flight", "Karakoram Highway travel"]
  },
  {
    slug: "k2-base-camp-trek-cost-itinerary",
    path: "/blog/k2-base-camp-trek-cost-itinerary",
    primaryKeyword: "K2 base camp trek cost and itinerary",
    title: "K2 base camp trek cost and itinerary",
    metaTitle: "K2 Base Camp Trek Cost and Itinerary 2026 | Katpana",
    metaDescription:
      "K2 base camp trek cost and itinerary 2026 with permits, porters, camps, Skardu prep and buffers. Plan now.",
    eyebrow: "Cost guide",
    excerpt:
      "K2 base camp trek cost and itinerary planning must include permits, porters, food, camp gear, Skardu hotels, Askole jeeps, and weather buffers.",
    image: "/images/places/k2-base-camp.jpg",
    imageAlt: "K2 base camp trek cost and itinerary planning on Baltoro Glacier Pakistan",
    imageTitle: "K2 base camp trek cost and itinerary from Skardu",
    category: "blog",
    schemaType: "Article",
    cta: "Plan Your K2 Trek",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "K2 base camp trek cost and itinerary factors",
        body:
          "K2 base camp trek cost and itinerary depends on group size, permits, porters, guide team, cook team, food quality, camping gear, jeeps, hotels, rescue cover, and buffers. A cheap quote can become risky if it cuts staff, food, or safety planning."
      },
      {
        heading: "Typical K2 trek day flow",
        body:
          "Most plans include Islamabad, Skardu, Askole jeep travel, Paiju, Urdukas, Goro, Concordia, K2 base camp, and return camps. Some groups add rest days or Gondogoro La only with strong fitness and safe conditions."
      },
      {
        heading: "How to compare trek quotes",
        body:
          "Ask what is included, what load porters carry, how many staff support the group, what insurance or rescue expectations exist, and whether permits are included. Compare real services, not only the lowest headline price."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "K2 base camp trek", href: "/treks/k2-base-camp/" },
      { label: "K2 base camp trek packages", href: "/tours/k2-trek-packages/" },
      { label: "Baltoro Glacier expedition", href: "/treks/baltoro-glacier/" }
    ],
    keywords: ["K2 base camp trek cost and itinerary", "K2 trek cost", "K2 trek itinerary", "Skardu trekking"]
  },
  {
    slug: "skardu-weather-month-by-month",
    path: "/blog/skardu-weather-month-by-month",
    primaryKeyword: "Skardu weather month by month",
    title: "Skardu weather month by month",
    metaTitle: "Skardu Weather Month by Month 2026 | Katpana",
    metaDescription:
      "Skardu weather month by month for 2026 travel, Deosai access, K2 trekking, snow and autumn color. Check now.",
    eyebrow: "Weather guide",
    excerpt:
      "Skardu weather month by month helps travelers choose between blossom, summer jeep routes, autumn colors, and snow-focused cold desert trips.",
    image: "/images/places/deosai-plains.jpg",
    imageAlt: "Skardu weather month by month Deosai plateau and Karakoram sky Pakistan",
    imageTitle: "Skardu weather month by month for Deosai and K2 routes",
    category: "blog",
    schemaType: "Article",
    cta: "Check Availability",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Skardu weather month by month overview",
        body:
          "Skardu weather month by month changes from cold winter to dry summer and clear autumn. April and May warm slowly. June to August supports Deosai and trekking. September and October bring crisp air and strong photography. Winter requires heating and flight buffers."
      },
      {
        heading: "Summer weather for lakes and Deosai",
        body:
          "Summer days can feel warm in Skardu city, but Deosai, Basho, and high passes stay cooler. Carry layers even in July. Sun at altitude is strong, so sunglasses, sunscreen, water, and early starts help every route."
      },
      {
        heading: "Winter and shoulder season planning",
        body:
          "Winter can bring beautiful snow around Katpana Desert and nearby mountains, but road and flight changes become more likely. Shoulder months are quieter and scenic, yet travelers must confirm heating, hot water, and route access."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "best time to visit Skardu Pakistan", href: "/blog/best-time-to-visit-skardu/" },
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "Deosai National Park safari", href: "/destinations/deosai-national-park/" }
    ],
    keywords: ["Skardu weather month by month", "Skardu weather", "Skardu seasons", "Deosai weather"]
  },
  {
    slug: "things-to-do-skardu-summer",
    path: "/blog/things-to-do-skardu-summer",
    primaryKeyword: "things to do in Skardu in summer",
    title: "Things to do in Skardu in summer",
    metaTitle: "Things to Do in Skardu in Summer 2026 | Katpana",
    metaDescription:
      "Things to do in Skardu in summer 2026: Deosai, Kachura, Shigar, Khaplu, jeeps and K2 trekking. Explore.",
    eyebrow: "Summer guide",
    excerpt:
      "Things to do in Skardu in summer include Deosai safari, Kachura boating, Shigar and Khaplu culture, jeep tracks, and K2-side trekking logistics.",
    image: "/images/places/kachura-lakes.jpg",
    imageAlt: "things to do in Skardu in summer Upper Kachura Lake boating Pakistan",
    imageTitle: "Things to do in Skardu in summer lakes Deosai and valleys",
    category: "blog",
    schemaType: "Article",
    cta: "Book Your Skardu Adventure",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Things to do in Skardu in summer with families",
        body:
          "Things to do in Skardu in summer start with Kachura Lakes, Katpana Desert sunset, Satpara Lake, and Shigar Fort. These routes fit families because they keep drives manageable and still show lakes, cold desert, villages, and mountain views."
      },
      {
        heading: "Summer adventure routes",
        body:
          "Summer opens Deosai National Park, Basho Valley, Sarfaranga, and longer Khaplu routes. Strong trekkers can prepare for Askole, Baltoro Glacier, Concordia, and K2 base camp. Keep one weather buffer for high routes."
      },
      {
        heading: "How to plan summer days",
        body:
          "Start early, carry water, use sun protection, and return before late mountain road fatigue. Book hotels early during peak months. Families should pair one active route with one softer route to avoid making the trip feel rushed."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "Upper Kachura Lake Skardu", href: "/destinations/upper-kachura-lake/" },
      { label: "Deosai National Park safari", href: "/destinations/deosai-national-park/" }
    ],
    keywords: ["things to do in Skardu in summer", "Skardu summer", "Skardu attractions", "Deosai safari"]
  },
  {
    slug: "is-skardu-safe-for-tourists",
    path: "/blog/is-skardu-safe-for-tourists",
    primaryKeyword: "is Skardu safe for tourists",
    title: "Is Skardu safe for tourists?",
    metaTitle: "Is Skardu Safe for Tourists 2026 | Katpana Desert Tour",
    metaDescription:
      "Is Skardu safe for tourists in 2026? Learn road, weather, altitude, culture and foreign visitor tips. Travel smart.",
    eyebrow: "Safety guide",
    excerpt:
      "Is Skardu safe for tourists? Most trips go smoothly with local planning, respectful behavior, weather buffers, safe vehicles, and realistic high-altitude choices.",
    image: "/images/places/shigar-fort-valley.jpg",
    imageAlt: "is Skardu safe for tourists Shigar Valley family travel and mountain road Pakistan",
    imageTitle: "Is Skardu safe for tourists guide for foreign and local travelers",
    category: "blog",
    schemaType: "Article",
    cta: "Talk to a Local Expert",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Is Skardu safe for tourists in 2026",
        body:
          "Skardu is generally safe for tourists who use reliable hotels, sensible transport, and local advice. Most risks come from weather, altitude, road conditions, and remote terrain rather than city crime. Foreign tourists should carry documents and follow local guidance."
      },
      {
        heading: "Road and altitude safety",
        body:
          "Do not rush high places after landing. Keep the first day light, use experienced mountain drivers, and avoid night drives on rough routes. Deosai, Basho, Askole, and trekking corridors need extra checks before departure."
      },
      {
        heading: "Cultural respect and comfort",
        body:
          "Skardu is welcoming, but travelers should dress modestly in villages, ask before portraits, and respect mosques, farms, and family spaces. Families and solo travelers should keep hotel contacts and driver details saved offline."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "how to reach Skardu from Islamabad", href: "/blog/how-to-reach-skardu-from-islamabad/" },
      { label: "Gilgit-Baltistan tourism", href: "/gilgit-baltistan-tourism/" }
    ],
    keywords: ["is Skardu safe for tourists", "Skardu safety", "foreign tourists Skardu", "Pakistan travel safety"]
  },
  {
    slug: "skardu-packing-list",
    path: "/blog/skardu-packing-list",
    primaryKeyword: "Skardu packing list",
    title: "Skardu packing list for mountain travel",
    metaTitle: "Skardu Packing List 2026 | Katpana Desert Tour",
    metaDescription:
      "Skardu packing list 2026 for lakes, cold desert, Deosai, K2 treks, family tours and winter trips. Pack well.",
    eyebrow: "Packing guide",
    excerpt:
      "A Skardu packing list must cover warm layers, sun protection, road days, lake stops, high plateaus, village etiquette, and trekking gear if you continue toward K2.",
    image: "/images/places/katapana-desert.jpg",
    imageAlt: "Skardu packing list for Katpana Desert Deosai and K2 trekking Pakistan",
    imageTitle: "Skardu packing list for family tours and mountain trekking",
    category: "blog",
    schemaType: "Article",
    cta: "Download the Skardu Guide",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Skardu packing list essentials",
        body:
          "A Skardu packing list starts with layered clothing, comfortable shoes, sunglasses, sunscreen, refillable water bottle, power bank, cash, personal medicine, and copies of documents. Even summer evenings can feel cold near lakes, deserts, and high plateaus."
      },
      {
        heading: "Packing for Deosai and jeep routes",
        body:
          "For Deosai, Basho, and rough jeep tracks, carry a warm jacket, snacks, water, camera protection, and motion sickness medicine if needed. Dust, wind, sun, and sudden cold can all happen in one day."
      },
      {
        heading: "Packing for K2 and Baltoro",
        body:
          "Trekkers need broken-in boots, waterproof shells, warm sleeping systems, gloves, headlamp, trekking poles, glacier sun protection, and personal first aid. Confirm porter load limits before packing expedition bags."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "K2 base camp trek", href: "/treks/k2-base-camp/" },
      { label: "Skardu weather month by month", href: "/blog/skardu-weather-month-by-month/" }
    ],
    keywords: ["Skardu packing list", "Skardu travel gear", "K2 trek packing", "Deosai packing"]
  },
  {
    slug: "cheapest-way-to-gilgit-baltistan",
    path: "/blog/cheapest-way-to-gilgit-baltistan",
    primaryKeyword: "cheapest way to travel to Gilgit-Baltistan",
    title: "Cheapest way to travel to Gilgit-Baltistan",
    metaTitle: "Cheapest Way to Travel to Gilgit-Baltistan 2026",
    metaDescription:
      "Cheapest way to travel to Gilgit-Baltistan in 2026 with buses, shared cars, budget hotels and smart routes. Save.",
    eyebrow: "Budget guide",
    excerpt:
      "The cheapest way to travel to Gilgit-Baltistan usually combines buses or shared cars, simple hotels, grouped day trips, and patient road timing.",
    image: "/images/places/hunza-valley.jpg",
    imageAlt: "cheapest way to travel to Gilgit-Baltistan by road through Karakoram villages",
    imageTitle: "Cheapest way to travel to Gilgit-Baltistan budget road guide",
    category: "blog",
    schemaType: "Article",
    cta: "Get a Free Trip Quote",
    lastUpdated,
    author: seoAuthor,
    sections: [
      {
        heading: "Cheapest way to travel to Gilgit-Baltistan",
        body:
          "The cheapest way to travel to Gilgit-Baltistan is usually shared road transport from Islamabad or Rawalpindi, simple guest houses, local food, and grouped sightseeing. It takes more time than flights or private cars, so budget travelers need patience."
      },
      {
        heading: "Where budget travel saves money",
        body:
          "Save by staying near markets, sharing transfers, booking longer car days instead of repeated short rides, and traveling outside peak weeks. Avoid false savings on remote routes where a poor vehicle or weak driver can create safety problems."
      },
      {
        heading: "When to spend more",
        body:
          "Spend more on experienced drivers for mountain roads, 4x4 routes, and family trips. K2, Deosai, Basho, and remote valleys need safer planning. Budget travel works best when you save on comfort, not on safety."
      }
    ],
    faqs: commonTravelFaqs,
    relatedLinks: [
      { label: "Gilgit-Baltistan tourism", href: "/gilgit-baltistan-tourism/" },
      { label: "Karakoram Highway travel", href: "/karakoram-highway-travel/" },
      { label: "how to reach Skardu from Islamabad", href: "/blog/how-to-reach-skardu-from-islamabad/" }
    ],
    keywords: ["cheapest way to travel to Gilgit-Baltistan", "budget Skardu travel", "Pakistan budget travel"]
  }
];

export const seoPages = [...pillarPages, ...trekPages, ...blogPages];

export function getSeoPageByPath(path: string) {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");
  return seoPages.find((page) => page.path === normalized);
}

export function getSeoPageBySlug(slug: string, category?: SEOPage["category"]) {
  return seoPages.find((page) => page.slug === slug && (!category || page.category === category));
}

export const homepageAttractions = [
  { name: "Katpana Desert", url: `${SITE_URL}/destinations/katapana-desert-skardu`, image: `${SITE_URL}/images/places/katapana-desert.jpg` },
  { name: "Deosai National Park", url: `${SITE_URL}/destinations/deosai-national-park`, image: `${SITE_URL}/images/places/deosai-plains.jpg` },
  { name: "Upper Kachura Lake", url: `${SITE_URL}/destinations/upper-kachura-lake`, image: `${SITE_URL}/images/places/kachura-lakes.jpg` },
  { name: "Shigar Valley", url: `${SITE_URL}/destinations/shigar-valley`, image: `${SITE_URL}/images/places/shigar-fort-valley.jpg` },
  { name: "Khaplu Palace", url: `${SITE_URL}/destinations/khaplu-ghanche-valley`, image: `${SITE_URL}/images/places/khaplu-palace.jpg` },
  { name: "K2 Base Camp", url: `${SITE_URL}/treks/k2-base-camp`, image: `${SITE_URL}/images/places/k2-base-camp.jpg` }
];
