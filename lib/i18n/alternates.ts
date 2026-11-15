import { SITE_URL } from "@/constants/brand";
import { locales, localePath } from "./config";

export function pageLanguageAlternates(path: string) {
  return {
    ...Object.fromEntries(locales.map(({ code }) => [code, SITE_URL + localePath(code, path)])),
    "x-default": SITE_URL + localePath("en", path)
  };
}
