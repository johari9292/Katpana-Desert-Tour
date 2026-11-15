import fs from "node:fs";
import path from "node:path";
import source from "@/data/translations/source.json";
import type { Locale } from "./config";
import type { Translation, Dictionary } from "./translate";

const cache = new Map<Locale, { dictionary: Dictionary; complete: boolean }>();
export function loadTranslation(locale: Locale, paths: string[]): Translation {
  if (!cache.has(locale)) {
    const filename = path.join(process.cwd(), "data", "translations", `${locale}.json`);
    const dictionary: Dictionary = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, "utf8")) : {};
    cache.set(locale, { dictionary, complete: source.every((text) => Object.hasOwn(dictionary, text) && !!dictionary[text]?.trim()) });
  }
  return { locale, paths, ...cache.get(locale)! };
}
