import { BRAND_NAME } from "@/constants/brand";

export interface TourItineraryDay {
  day: string;
  title: string;
  body: string;
}

export interface TourFaq {
  question: string;
  answer: string;
}

export interface TourPackage {
  slug: string;
  title: string;
  duration: string;
  category: string;
  region: string;
  difficulty: string;
  bestSeason: string;
  priceFrom: string;
  image: string;
  badge: string;
  overview: string;
  destinationOverview: string;
  activities: string[];
  highlights: string[];
  itinerary: TourItineraryDay[];
  included: string[];
  excluded: string[];
  keywords: string[];
  primaryKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;
  schemaType?: string;
  faqs?: TourFaq[];
  author?: string;
  lastUpdated?: string;
  relatedLinks?: { label: string; href: string }[];
  imageAlt?: string;
  imageTitle?: string;
}

export const tourPackages: TourPackage[] = [
  {
    slug: "katapana-desert-skardu-highlights-tour",
    title: "Katapana Desert and Skardu Highlights Tour",
    duration: "4 days / 3 nights",
    category: "Family and scenic",
    region: "Skardu, Katapana Desert, Kachura and Shigar",
    difficulty: "Easy",
    bestSeason: "April to October, with winter snow trips on request",
    priceFrom: "Custom quote",
    image: "/images/places/katapana-desert.jpg",
    badge: "Best seller",
    overview:
      `${BRAND_NAME} builds this short Skardu package around the cold desert, blue lakes, heritage lanes, and flexible airport timing. It works well for families, couples, and first-time visitors who want the strongest Skardu experiences without rushing every hour.`,
    destinationOverview:
      "Skardu sits between the Indus River, glacial lakes, desert dunes, and the gateway valleys of the Karakoram. Katapana Desert is close to the airport and city, which makes it ideal for sunrise, sunset, and first-day sightseeing.",
    activities: ["Cold desert sunset", "Lake viewpoints", "Heritage fort visit", "Private car sightseeing"],
    highlights: [
      "Golden-hour photography at Katapana Desert and Katapana Lake",
      "Shangrila and Upper Kachura lake circuit with relaxed family timing",
      "Shigar Fort, old bazaar lanes, and Sarfaranga Cold Desert option",
      "Airport pickup, hotel coordination, and local route support"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Skardu and Katapana sunset",
        body: "Meet at Skardu Airport, transfer to hotel, rest after the mountain flight, then visit Katapana Desert for dunes, lake views, and sunset photography."
      },
      {
        day: "Day 2",
        title: "Kachura lakes and Shangrila",
        body: "Drive toward Lower Kachura, Shangrila Lake, and Upper Kachura. Add boating, trout lunch, village walks, and photo stops based on weather."
      },
      {
        day: "Day 3",
        title: "Shigar Fort and cold desert route",
        body: "Explore Shigar Valley, Shigar Fort, gardens, local market streets, and optional Sarfaranga Cold Desert before returning to Skardu."
      },
      {
        day: "Day 4",
        title: "Satpara Lake and departure",
        body: "Take a short morning visit to Satpara Lake or Skardu bazaar, then transfer to the airport with a flexible buffer for flight timing."
      }
    ],
    included: ["Airport pickup and drop-off", "Private car with local driver", "Hotel booking assistance", "Route planning support", "Basic sightseeing guidance"],
    excluded: ["Air tickets", "Meals unless requested", "Entry tickets", "Personal shopping", "Travel insurance"],
    keywords: ["Katapana Desert tour", "Skardu tour package", "Skardu family tour", "Kachura lakes", "Shigar Fort"]
  },
  {
    slug: "deosai-sheosar-lake-4x4-adventure",
    title: "Deosai Plains and Sheosar Lake 4x4 Adventure",
    duration: "5 days / 4 nights",
    category: "Adventure and wildlife",
    region: "Skardu, Satpara, Deosai and Sheosar Lake",
    difficulty: "Moderate",
    bestSeason: "June to September",
    priceFrom: "Custom quote",
    image: "/images/places/deosai-plains.jpg",
    badge: "Summer route",
    overview:
      "A high-altitude jeep plan for travelers who want the vast Deosai plateau, Sheosar Lake, wildflower season, and clear mountain horizons while keeping Skardu as a comfortable base.",
    destinationOverview:
      "Deosai National Park is one of Pakistan's most dramatic summer landscapes. The road usually opens after snowmelt, and weather can change fast across the plateau, so local 4x4 planning matters.",
    activities: ["4x4 safari", "High plateau photography", "Lake picnic", "Wildlife-aware travel"],
    highlights: [
      "Full-day Deosai route with Satpara, Bara Pani, Kala Pani, and Sheosar Lake",
      "Experienced local driver for rough tracks and changing weather",
      "Flexible order with Kachura or Shigar as backup routes",
      "High-altitude packing and timing guidance before departure"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrive in Skardu",
        body: "Airport pickup, hotel check-in, light local sightseeing, and a route briefing for altitude, weather, and 4x4 timing."
      },
      {
        day: "Day 2",
        title: "Katapana and Kachura acclimatization",
        body: "Keep the first full day lower in elevation with Katapana Desert, Shangrila, Upper Kachura, and early rest for the next day's long drive."
      },
      {
        day: "Day 3",
        title: "Deosai National Park and Sheosar Lake",
        body: "Start early by 4x4 through Satpara and Deosai Top. Continue across the plains to Sheosar Lake if conditions allow, then return to Skardu."
      },
      {
        day: "Day 4",
        title: "Shigar Valley recovery day",
        body: "Use a softer day for Shigar Fort, Sarfaranga views, local food, and valley photography after the high plateau journey."
      },
      {
        day: "Day 5",
        title: "Departure buffer",
        body: "Transfer to airport or add a city market stop. If weather changed the Deosai day, this buffer can help protect the experience."
      }
    ],
    included: ["4x4 vehicle for Deosai day", "Local driver", "Hotel coordination", "Airport transfers", "Route condition checks"],
    excluded: ["Park fees", "Meals and snacks", "Flights", "Guide for specialist wildlife work", "Personal gear"],
    keywords: ["Deosai National Park tour", "Sheosar Lake", "Skardu 4x4 tour", "Deosai Plains", "Satpara Lake"]
  },
  {
    slug: "hunza-skardu-grand-northern-tour",
    title: "Hunza and Skardu Grand Northern Tour",
    duration: "8 days / 7 nights",
    category: "Road trip and culture",
    region: "Skardu, Shigar, Khaplu, Hunza and Gilgit",
    difficulty: "Moderate",
    bestSeason: "May to October",
    priceFrom: "Custom quote",
    image: "/images/places/hunza-valley.jpg",
    badge: "Grand tour",
    overview:
      "A wider Gilgit Baltistan road journey joining Skardu's deserts and lakes with Hunza's forts, viewpoints, glaciers, and Karakoram Highway scenery.",
    destinationOverview:
      "Skardu and Hunza give two different faces of northern Pakistan: Skardu is spacious, raw, and expedition-linked; Hunza is terraced, cultural, and shaped by the Karakoram Highway.",
    activities: ["Karakoram Highway drive", "Fort visits", "Lake and glacier viewpoints", "Cultural tourism"],
    highlights: [
      "Katapana Desert, Kachura lakes, Shigar Fort, and Khaplu Palace route options",
      "Hunza Valley, Karimabad, Baltit or Altit Fort, Passu Cones, and Attabad Lake",
      "Private vehicle planning for families, couples, and overseas Pakistanis",
      "Balanced pacing with fewer late-night mountain drives"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrive in Skardu",
        body: "Airport transfer, hotel check-in, and Katapana Desert sunset if timing and weather are favorable."
      },
      {
        day: "Day 2",
        title: "Kachura lakes and Skardu viewpoints",
        body: "Visit Shangrila Lake, Upper Kachura, local viewpoints, and Skardu bazaar with time for meals and photography."
      },
      {
        day: "Day 3",
        title: "Shigar and Sarfaranga",
        body: "Drive to Shigar Fort, explore valley gardens, and add Sarfaranga Cold Desert for open desert scenery."
      },
      {
        day: "Day 4",
        title: "Khaplu or Deosai seasonal choice",
        body: "Choose Khaplu Palace and Ghanche Valley for culture, or Deosai if the plateau road is open and the group prefers adventure."
      },
      {
        day: "Day 5",
        title: "Skardu to Hunza road journey",
        body: "Drive toward Gilgit and Hunza with river, mountain, and Karakoram Highway stops. Overnight in Hunza or Gilgit depending on timing."
      },
      {
        day: "Day 6",
        title: "Karimabad forts and Eagle's Nest",
        body: "Explore Hunza's heritage core, Baltit or Altit Fort, Karimabad bazaar, and sunset from a high viewpoint."
      },
      {
        day: "Day 7",
        title: "Attabad Lake and Passu Cones",
        body: "Visit Attabad Lake, Hussaini Bridge area, Passu Cones viewpoints, and return to Hunza for the night."
      },
      {
        day: "Day 8",
        title: "Departure or onward road transfer",
        body: "Transfer to Gilgit Airport, continue by road, or add a custom extension based on flight and route status."
      }
    ],
    included: ["Private vehicle", "Driver and fuel plan", "Hotel booking assistance", "Airport or road transfer support", "Custom day order"],
    excluded: ["Domestic flights", "Meals", "Fort tickets", "Boating fees", "Personal expenses"],
    keywords: ["Hunza Skardu tour", "Gilgit Baltistan tour", "Karakoram Highway trip", "Hunza Valley", "Skardu package"]
  },
  {
    slug: "k2-base-camp-concordia-trek-planning",
    title: "K2 Base Camp and Concordia Trek Planning",
    duration: "18 to 21 days",
    category: "Trekking expedition",
    region: "Skardu, Askole, Baltoro Glacier, Concordia and K2 Base Camp",
    difficulty: "Challenging",
    bestSeason: "June to August",
    priceFrom: "Custom expedition quote",
    image: "/images/places/k2-base-camp.jpg",
    badge: "Trek support",
    overview:
      "A serious Karakoram trekking plan for experienced hikers who need pre-trek Skardu logistics, Askole jeep coordination, licensed guiding, porter planning, food systems, and buffer days.",
    destinationOverview:
      "K2 Base Camp is reached through the Baltoro Glacier and Concordia, one of the world's most renowned mountain amphitheaters. This is not a casual sightseeing package; it requires fitness, permits, gear, and experienced mountain staff.",
    activities: ["Glacier trekking", "Expedition logistics", "Camping", "Mountain photography"],
    highlights: [
      "Skardu acclimatization and gear check before the trek",
      "Askole jeep route planning through Shigar and Braldu Valley",
      "Baltoro Glacier, Concordia, Broad Peak views, and K2 Base Camp objective",
      "Porter, guide, cook, camping, permit, and buffer-day planning"
    ],
    itinerary: [
      {
        day: "Days 1-2",
        title: "Arrive in Skardu and prepare",
        body: "Meet the team, review equipment, complete route checks, and use Skardu for acclimatization and supplies."
      },
      {
        day: "Day 3",
        title: "Jeep to Askole",
        body: "Drive through Shigar and Braldu Valley to Askole or the closest safe roadhead based on current track conditions."
      },
      {
        day: "Days 4-9",
        title: "Approach the Baltoro Glacier",
        body: "Trek through classic camps toward Paiju, Khoburtse, Urdukas, and Goro with gradual acclimatization."
      },
      {
        day: "Days 10-13",
        title: "Concordia and K2 Base Camp objective",
        body: "Reach Concordia, attempt the K2 Base Camp day if conditions and group strength allow, and keep safety as the main decision point."
      },
      {
        day: "Days 14-18",
        title: "Return trek and drive back",
        body: "Retrace the route to Askole, drive back to Skardu, and use buffer days for weather, rest, or flight timing."
      }
    ],
    included: ["Licensed guide coordination", "Porter and camp planning", "Jeep transfer planning", "Permit guidance", "Pre-trek hotel support"],
    excluded: ["International and domestic flights", "Personal trekking gear", "Rescue insurance", "Visa fees", "Tips and personal extras"],
    keywords: ["K2 Base Camp trek", "Concordia trek", "Baltoro Glacier", "Askole trek", "Skardu trekking"]
  },
  {
    slug: "khaplu-shigar-cultural-heritage-tour",
    title: "Khaplu, Shigar and Balti Heritage Tour",
    duration: "6 days / 5 nights",
    category: "Culture and heritage",
    region: "Skardu, Shigar, Khaplu and Ghanche",
    difficulty: "Easy to moderate",
    bestSeason: "April to October",
    priceFrom: "Custom quote",
    image: "/images/places/khaplu-palace.jpg",
    badge: "Cultural route",
    overview:
      "A slower cultural route focused on forts, palaces, mosques, village life, Balti food, river valleys, and respectful travel across Skardu's heritage corridors.",
    destinationOverview:
      "Shigar and Khaplu preserve some of Baltistan's most graceful architecture. Forts, palace hotels, old mosques, apricot orchards, and river landscapes make this route ideal for travelers who value culture as much as scenery.",
    activities: ["Fort and palace visits", "Village walks", "Balti food", "Soft photography"],
    highlights: [
      "Shigar Fort, Shigar bazaar, and Sarfaranga desert add-on",
      "Khaplu Palace, Chaqchan Mosque, and Shyok River viewpoints",
      "Gentle pacing for families, couples, seniors, and culture travelers",
      "Local etiquette guidance for villages, mosques, and photography"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival and Katapana Desert",
        body: "Land in Skardu, settle into the hotel, and visit Katapana Desert for an easy first evening."
      },
      {
        day: "Day 2",
        title: "Shigar Fort and Sarfaranga",
        body: "Spend the day in Shigar with fort architecture, valley roads, cafes, gardens, and an optional Sarfaranga sunset."
      },
      {
        day: "Day 3",
        title: "Drive to Khaplu",
        body: "Follow the Shyok River toward Khaplu with viewpoints and photo stops before checking into the selected hotel."
      },
      {
        day: "Day 4",
        title: "Khaplu Palace and cultural sites",
        body: "Visit Khaplu Palace, Chaqchan Mosque, local lanes, river viewpoints, and seasonal village scenery."
      },
      {
        day: "Day 5",
        title: "Return to Skardu",
        body: "Drive back with flexible stops. Add Satpara Lake, Kharpocho viewpoint, or bazaar time if the group wants a lighter day."
      },
      {
        day: "Day 6",
        title: "Departure",
        body: "Airport transfer or onward journey with a practical buffer for mountain flight changes."
      }
    ],
    included: ["Private transport", "Driver support", "Hotel booking help", "Route customization", "Cultural etiquette guidance"],
    excluded: ["Meals", "Heritage entry tickets", "Flights", "Personal shopping", "Professional guide unless requested"],
    keywords: ["Khaplu Palace tour", "Shigar Fort", "Balti culture", "Skardu heritage tour", "Ghanche Valley"]
  },
  {
    slug: "nanga-parbat-astore-deosai-side-trip",
    title: "Astore, Rama and Nanga Parbat Viewpoint Side Trip",
    duration: "7 days / 6 nights",
    category: "Adventure road trip",
    region: "Skardu, Deosai, Astore, Rama and Nanga Parbat viewpoints",
    difficulty: "Moderate",
    bestSeason: "June to September",
    priceFrom: "Custom quote",
    image: "/images/places/astore-rama-meadows.jpg",
    badge: "Extended route",
    overview:
      "A flexible side-trip for travelers who want to connect Skardu with Astore, Rama Meadows, Deosai, and Nanga Parbat view areas when routes and local access are favorable.",
    destinationOverview:
      "Astore links high meadows, forested valleys, and dramatic Nanga Parbat views with Skardu's desert and lake landscapes. The route depends heavily on road condition, weather, and local access updates.",
    activities: ["Mountain road trip", "Meadow walks", "Viewpoint photography", "Seasonal 4x4 travel"],
    highlights: [
      "Skardu acclimatization with Katapana and Kachura before the longer route",
      "Deosai crossing when open, or Gilgit-side connection as an alternate",
      "Rama Meadows and Astore Valley scenery",
      "Optional Nanga Parbat viewpoint planning with local route checks"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrive in Skardu",
        body: "Airport pickup, hotel check-in, and an easy Katapana Desert or city viewpoint visit."
      },
      {
        day: "Day 2",
        title: "Kachura and Shigar warm-up",
        body: "Cover lake and desert highlights while checking weather and road information for the extended route."
      },
      {
        day: "Day 3",
        title: "Skardu to Astore via seasonal route",
        body: "Cross Deosai if open and safe, or use the practical road connection based on current conditions. Overnight in Astore area."
      },
      {
        day: "Day 4",
        title: "Rama Meadows",
        body: "Explore Rama area, meadows, forest scenery, and local viewpoints with a careful pace for altitude and road conditions."
      },
      {
        day: "Day 5",
        title: "Nanga Parbat viewpoint option",
        body: "Use local advice to plan the best accessible viewpoint or valley extension, keeping safety and route permission first."
      },
      {
        day: "Day 6",
        title: "Return toward Skardu or Gilgit",
        body: "Drive back with buffer time, or connect toward Gilgit/Hunza if the wider itinerary continues."
      },
      {
        day: "Day 7",
        title: "Departure buffer",
        body: "Transfer to airport or continue onward after a final route and timing check."
      }
    ],
    included: ["Private transport planning", "Driver support", "Route condition checks", "Hotel coordination", "Flexible day order"],
    excluded: ["Flights", "Meals", "Permits where required", "Specialist trekking guide", "Personal gear"],
    keywords: ["Astore Valley tour", "Rama Meadows", "Nanga Parbat viewpoint", "Deosai to Astore", "Skardu side trip"]
  },
  {
    slug: "k2-trek-packages",
    title: "K2 Base Camp Trek Packages from Skardu",
    duration: "18 to 21 days",
    category: "Trekking expedition",
    region: "Skardu, Askole, Baltoro Glacier, Concordia and K2 Base Camp",
    difficulty: "Challenging",
    bestSeason: "June to August",
    priceFrom: "Custom expedition quote",
    image: "/images/places/k2-base-camp.jpg",
    badge: "K2 trek",
    primaryKeyword: "K2 base camp trek packages",
    metaTitle: "K2 Base Camp Trek Packages | Katpana Desert Tour",
    metaDescription: "K2 base camp trek packages from Skardu with permits, porters, Askole jeeps, camps and buffers. Plan now.",
    canonicalPath: "/tours/k2-trek-packages",
    schemaType: "TouristTrip",
    imageAlt: "K2 base camp trek packages on Baltoro Glacier Karakoram Pakistan",
    imageTitle: "K2 base camp trek packages from Skardu to Concordia",
    overview:
      "K2 base camp trek packages need careful Skardu logistics, restricted-area permit guidance, Askole jeep timing, porter systems, glacier camps, food planning, and realistic weather buffers across the Karakoram.",
    destinationOverview:
      "The K2 route starts in Skardu, moves through Shigar and Askole, then follows the Baltoro Glacier to Concordia and K2 Base Camp at about 5,150m. It is a serious expedition trek, not a casual sightseeing tour.",
    activities: ["Glacier trekking", "Camping", "Porter coordination", "Permit guidance", "Altitude acclimatization"],
    highlights: [
      "18 to 21 day K2 base camp trek package planning from Islamabad or Skardu",
      "Askole jeep route, Baltoro Glacier camps, Concordia and K2 Base Camp objective",
      "Porter, cook, guide, camping, food, and permit coordination guidance",
      "Weather buffer planning for Skardu flights, road access, and high camps"
    ],
    itinerary: [
      {
        day: "Days 1-2",
        title: "Islamabad or Skardu arrival and trek briefing",
        body: "Confirm flights, hotels, guide team, permit documents, personal gear, porter loads, and altitude planning before leaving Skardu."
      },
      {
        day: "Day 3",
        title: "Skardu to Askole by jeep",
        body: "Drive through Shigar and Braldu Valley to Askole or the safest available roadhead, based on current track and bridge conditions."
      },
      {
        day: "Days 4-9",
        title: "Askole to Urdukas and Goro camps",
        body: "Walk through Paiju, Khoburtse, Urdukas, and glacier camps with steady altitude gain, camp routines, and porter-supported trekking."
      },
      {
        day: "Days 10-13",
        title: "Concordia and K2 Base Camp",
        body: "Reach Concordia, assess weather and fitness, then attempt the K2 Base Camp day if conditions remain safe."
      },
      {
        day: "Days 14-21",
        title: "Return trek, Skardu buffer, and departure",
        body: "Retrace the route to Askole and Skardu, keeping buffer days for weather, road delays, rest, and onward flights."
      }
    ],
    included: ["Local trek planning", "Guide and porter coordination guidance", "Askole jeep planning", "Permit guidance", "Pre-trek Skardu hotel support"],
    excluded: ["Flights", "Personal gear", "Rescue insurance", "Visa fees", "Tips", "Unlisted meals"],
    keywords: ["K2 base camp trek packages", "K2 base camp trek", "Baltoro Glacier", "Concordia Pakistan", "Skardu trekking"],
    faqs: [
      {
        question: "Is a permit required for K2 base camp?",
        answer:
          "Yes, foreign trekkers normally need restricted-area trekking permits for K2 base camp. A local operator helps prepare documents, guide lists, porter details, and route paperwork. Requirements can change, so confirm permits before flights, hotel deposits, or expedition dates are locked."
      },
      {
        question: "How many days are needed for K2 base camp trek packages?",
        answer:
          "Most K2 base camp trek packages need 18 to 21 days from Islamabad, including Skardu preparation, Askole jeep travel, Baltoro Glacier camps, Concordia, K2 Base Camp, return days, and weather buffers. Strong teams should still avoid removing buffer days."
      },
      {
        question: "What is included in K2 base camp trek packages?",
        answer:
          "A well-planned package can include guide coordination, porter systems, cook team, tents, meals on trek, Askole jeeps, permit guidance, and Skardu hotel support. Always compare the exact inclusion list because cheaper quotes may remove food quality, staff strength, or safety buffers."
      },
      {
        question: "How difficult is the K2 base camp trek?",
        answer:
          "The K2 base camp trek is challenging because it is long, remote, high, and mostly camping-based. Trekkers should train with loaded hikes, prepare for glacier walking, and understand altitude symptoms. It is not technical climbing, but it needs serious endurance."
      },
      {
        question: "What is the best month for the K2 base camp trek?",
        answer:
          "June to August is the main K2 base camp trek window. July often gives the most active trekking season, while late June and August can be quieter. Weather still changes fast in the Karakoram, so keep flexible Skardu flight and road buffers."
      }
    ],
    author: "Katpana Desert Tour Local Planning Team",
    lastUpdated: "May 2026",
    relatedLinks: [
      { label: "K2 base camp trek", href: "/treks/k2-base-camp/" },
      { label: "Baltoro Glacier expedition", href: "/treks/baltoro-glacier/" },
      { label: "best trekking in Pakistan", href: "/pakistan-trekking-guide/" }
    ]
  },
  {
    slug: "jeep-safari-skardu",
    title: "Skardu Jeep Safari Guide and 4x4 Tour",
    duration: "3 to 6 days",
    category: "Jeep safari",
    region: "Skardu, Deosai, Basho, Shigar, Sarfaranga and Satpara",
    difficulty: "Moderate",
    bestSeason: "June to September for high routes, April to October for lower valleys",
    priceFrom: "Custom 4x4 quote",
    image: "/images/places/deosai-plains.jpg",
    badge: "4x4 safari",
    primaryKeyword: "Skardu jeep safari guide",
    metaTitle: "Skardu Jeep Safari Guide | Katpana Desert Tour",
    metaDescription: "Skardu jeep safari guide for Deosai, Basho, Shigar, Satpara and cold desert 4x4 routes. Book now.",
    canonicalPath: "/tours/jeep-safari-skardu",
    schemaType: "TouristTrip",
    imageAlt: "Skardu jeep safari guide across Deosai National Park plateau Pakistan",
    imageTitle: "Skardu jeep safari guide for Deosai Basho and cold desert routes",
    overview:
      "This Skardu jeep safari guide covers 4x4 routes for Deosai, Basho Valley, Sarfaranga Cold Desert, Satpara Lake, Shigar, and seasonal high tracks where regular cars are not the right choice.",
    destinationOverview:
      "Skardu jeep routes combine alpine lakes, cold desert, high plateau roads, river valleys, and mountain village tracks. Route safety depends on weather, driver experience, vehicle condition, and realistic daily timing.",
    activities: ["4x4 safari", "High plateau photography", "Cold desert drive", "Mountain village stops", "Lake viewpoints"],
    highlights: [
      "Deosai National Park safari with Satpara, Bara Pani, Kala Pani and Sheosar Lake",
      "Basho Valley and rough meadow tracks when local conditions are favorable",
      "Shigar, Sarfaranga Cold Desert, and cultural valley add-ons",
      "Driver, fuel, timing, road condition, and backup-route planning"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Skardu arrival and Katpana Desert",
        body: "Start with an easy airport pickup, hotel check-in, vehicle briefing, and Katpana Desert sunset route."
      },
      {
        day: "Day 2",
        title: "Deosai National Park 4x4 safari",
        body: "Drive through Satpara toward Deosai, Bara Pani, Kala Pani, and Sheosar Lake if the road and weather allow."
      },
      {
        day: "Day 3",
        title: "Shigar and Sarfaranga Cold Desert",
        body: "Use a lower-altitude 4x4 day for Shigar Fort, valley stops, and Sarfaranga sand views."
      },
      {
        day: "Days 4-6",
        title: "Basho Valley or custom extension",
        body: "Add Basho, Khaplu, or Astore-side routes depending on season, group comfort, and current track reports."
      }
    ],
    included: ["4x4 route planning", "Local driver coordination", "Airport and hotel pickup planning", "Road condition checks", "Backup route advice"],
    excluded: ["Flights", "Meals", "Park fees", "Personal gear", "Travel insurance"],
    keywords: ["Skardu jeep safari guide", "Skardu 4x4 tour", "Deosai safari", "Basho Valley jeep", "Sarfaranga Cold Desert"],
    faqs: [
      {
        question: "Do I need a jeep for Deosai National Park?",
        answer:
          "Yes, a jeep or strong 4x4 is recommended for Deosai National Park because the road includes rough sections, water crossings, and fast weather changes. A local driver understands safe timing, plateau conditions, and when to turn back."
      },
      {
        question: "What is the best time for a Skardu jeep safari?",
        answer:
          "June to September is best for Deosai, Basho, and higher jeep routes. April to October works for lower routes like Katpana, Shigar, Sarfaranga, Satpara, and Kachura. Always confirm road status close to departure."
      },
      {
        question: "Can families do a Skardu jeep safari?",
        answer:
          "Families can enjoy Skardu jeep safaris when the route is chosen carefully. Kachura, Shigar, Katpana, and Satpara are easier. Deosai and Basho need longer rough-road tolerance, warm layers, snacks, and flexible timing."
      },
      {
        question: "How long should a Skardu 4x4 tour be?",
        answer:
          "A short Skardu 4x4 tour can take 3 days for Katpana, Deosai, and Shigar. A better plan uses 5 to 6 days, adding recovery time, weather buffers, Kachura Lakes, Sarfaranga, Basho, or Khaplu without rushing every route."
      },
      {
        question: "What should I carry on a Skardu jeep safari?",
        answer:
          "Carry warm layers, water, snacks, sunglasses, sunscreen, cash, camera protection, personal medicine, and a power bank. High routes can feel cold even in summer, and phone coverage may drop outside Skardu city."
      }
    ],
    author: "Katpana Desert Tour Local Planning Team",
    lastUpdated: "May 2026",
    relatedLinks: [
      { label: "Deosai National Park safari", href: "/destinations/deosai-national-park/" },
      { label: "Skardu travel guide", href: "/skardu-travel-guide/" },
      { label: "things to do in Skardu in summer", href: "/blog/things-to-do-skardu-summer/" }
    ]
  }
];

export function getTourBySlug(slug: string) {
  return tourPackages.find((tour) => tour.slug === slug);
}

export function getRelatedTours(tour: TourPackage, limit = 3) {
  return tourPackages.filter((item) => item.slug !== tour.slug && item.category !== tour.category).slice(0, limit);
}
