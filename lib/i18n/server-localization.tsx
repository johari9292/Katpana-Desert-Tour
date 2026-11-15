import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TourInquiryForm from "@/components/TourInquiryForm";
import SiteSearch from "@/components/SiteSearch";
import MobileBookingBar from "@/components/MobileBookingBar";
import { SITE_URL } from "@/constants/brand";
import { getMessages } from "./index";
import { type Locale, localePath } from "./config";
import { textKey, translateText, translateElementProps, translateHref, type Translation } from "./translate";

export { loadTranslation } from "./dictionaries";
const dataTextKeys = new Set(["title", "name", "label", "summary", "overview", "description", "duration", "region", "bestSeason", "type", "heading", "body", "question", "answer", "excerpt"]);
export function translateData(value: unknown, translation: Translation, key = ""): unknown {
  if (typeof value === "string") {
    if (key === "href") return translateHref(value, translation);
    if (key === "searchText") return value;
    return dataTextKeys.has(key) ? translateText(value, translation) : value;
  }
  if (Array.isArray(value)) return value.map((item) => translateData(item, translation, key));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, translateData(item, translation, name)]));
  return value;
}
export function translateSchema(value: unknown, translation: Translation, key = ""): unknown {
  if (typeof value === "string") {
    if (["url", "@id", "item", "mainEntityOfPage"].includes(key) && value.startsWith(SITE_URL + "/")) {
      const suffix = value.slice(SITE_URL.length);
      // Organization and website identities are shared by all translations.
      if (/^\/#(organization|website)$/.test(suffix)) return value;
      return SITE_URL + translateHref(suffix, translation);
    }
    return ["name", "description", "headline", "text", "articleSection", "touristType"].includes(key) ? translateText(value, translation) : value;
  }
  if (Array.isArray(value)) return value.map((item) => translateSchema(item, translation, key));
  if (value && typeof value === "object") {
    const result = Object.fromEntries(Object.entries(value).map(([name, item]) => [name, translateSchema(item, translation, name)]));
    if (["WebPage", "Article", "TouristTrip", "TouristDestination"].includes(String(result["@type"]))) result.inLanguage = translation.locale;
    return result;
  }
  return value;
}

export async function translateServerTree(node: ReactNode, translation: Translation, clientDictionary = translation.dictionary): Promise<ReactNode> {
  if (typeof node === "string") return translateText(node, translation);
  if (Array.isArray(node)) return Promise.all(node.map((child) => translateServerTree(child, translation, clientDictionary)));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  const type = element.type;
  if (type === Nav) return <Nav locale={translation.locale} messages={getMessages(translation.locale)} />;
  if (type === Footer) return <Footer locale={translation.locale} />;
  let props = translateElementProps(element.props, translation);
  if ([TourInquiryForm, SiteSearch, MobileBookingBar].includes(type as never)) {
    props = { ...props, ...translateData(props, translation) as object, translation: { ...translation, dictionary: clientDictionary } };
  }
  if (type === "script" && props.type === "application/ld+json") {
    const raw = (props.dangerouslySetInnerHTML as { __html: string }).__html;
    props.dangerouslySetInnerHTML = { __html: JSON.stringify(translateSchema(JSON.parse(raw), translation)).replace(/</g, "\\u003c") };
  } else if (props.children !== undefined) props.children = await translateServerTree(props.children as ReactNode, translation, clientDictionary);
  // Resolve only server functions; Next's client references and built-in primitives remain boundaries.
  if (typeof type === "function" && type !== Link && type !== Image && !(type as { $$typeof?: symbol }).$$typeof) {
    return translateServerTree(await (type as (props: Record<string, unknown>) => ReactNode)(props), translation, clientDictionary);
  }
  return cloneElement(element, props);
}
