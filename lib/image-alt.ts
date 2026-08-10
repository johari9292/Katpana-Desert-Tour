const IMAGE_ALT_BY_PATH: Record<string, string> = {
  "/images/katpana-skardu-hero.jpg":
    "Golden sand dunes with a parked 4x4 below snow-covered mountains near Skardu",
  "/images/places/katapana-desert.jpg":
    "Golden dunes at Katpana Cold Desert below barren mountains and poplar trees",
  "/images/places/deosai-plains.jpg":
    "Yaks grazing among wildflowers on the green Deosai Plains beneath storm clouds",
  "/images/places/kachura-lakes.jpg":
    "A visitor beside clear Upper Kachura Lake with trees and rocky mountains reflected in the water",
  "/images/places/shigar-fort-valley.jpg":
    "Stone, timber and plaster courtyard buildings at Shigar Fort under a blue sky",
  "/images/places/khaplu-palace.jpg":
    "White and timber facade of Khaplu Palace against a rocky mountain slope",
  "/images/places/k2-base-camp.jpg":
    "Snow-covered K2 above a glacier and expedition tents",
  "/images/places/hunza-valley.jpg":
    "Turquoise river below steep rocky mountains and autumn trees in Hunza Valley",
  "/images/places/astore-rama-meadows.jpg":
    "A stream winding through green Rama Meadows toward pine forest and snow-covered mountains"
};

export function imageAltFor(source: string, fallback = "Mountain landscape in northern Pakistan") {
  let pathname = source.split(/[?#]/, 1)[0];

  if (/^https?:\/\//i.test(pathname)) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      return fallback;
    }
  }

  return IMAGE_ALT_BY_PATH[pathname] ?? fallback;
}
