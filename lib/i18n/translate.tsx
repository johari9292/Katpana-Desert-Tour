import { cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";
import { localePath, type Locale } from "./config";

export type Dictionary = Record<string, string>;
export interface Translation {
  locale: Locale;
  dictionary: Dictionary;
  paths: string[];
  complete?: boolean;
}
export const textKey = (text: string) => text.replace(/\s+/g, " ").trim();
export function translateText(text: string, translation: Translation): string {
  const key = textKey(text);
  const value = translation.dictionary[key];
  return value ? text.replace(/\S[\s\S]*\S|\S/, value) : text;
}
export function translateHref(href: string, translation: Translation): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const pathname = href.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
  return translation.paths.includes(pathname) ? localePath(translation.locale, href) : href;
}
const textAttributes = new Set(["alt", "title", "placeholder", "aria-label", "label"]);
export function translateElementProps(props: Record<string, unknown>, translation: Translation) {
  return Object.fromEntries(Object.entries(props).map(([key, value]) => [key,
    typeof value === "string" && textAttributes.has(key) ? translateText(value, translation) :
    typeof value === "string" && ["href", "customizeHref"].includes(key) ? translateHref(value, translation) : value
  ]));
}
// Also used after interactive components render, so state updates keep translated labels.
export function translateClientTree(node: ReactNode, translation?: Translation): ReactNode {
  if (!translation) return node;
  if (typeof node === "string") return translateText(node, translation);
  if (Array.isArray(node)) return node.map((child) => translateClientTree(child, translation));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  return cloneElement(element, {
    ...translateElementProps(element.props, translation),
    ...(element.props.children !== undefined ? { children: translateClientTree(element.props.children as ReactNode, translation) } : {})
  });
}
