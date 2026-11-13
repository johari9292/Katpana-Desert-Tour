import { en, type Messages } from "./en";
import { ur } from "./messages/ur";
import { ar } from "./messages/ar";
import { hi } from "./messages/hi";
import { zh } from "./messages/zh";
import { es } from "./messages/es";
import { fr } from "./messages/fr";
import { de } from "./messages/de";
import { it } from "./messages/it";
import { pt } from "./messages/pt";
import { ru } from "./messages/ru";
import { ja } from "./messages/ja";
import { ko } from "./messages/ko";
import { tr } from "./messages/tr";
import { fa } from "./messages/fa";
import { bn } from "./messages/bn";
import { id } from "./messages/id";
import { ms } from "./messages/ms";
import { th } from "./messages/th";
import { vi } from "./messages/vi";
import type { Locale } from "./config";

export * from "./config";
export type { Messages } from "./en";

const messages: Record<Locale, Messages> = {
  en: en as unknown as Messages,
  ur, ar, hi, zh, es, fr, de, it, pt, ru, ja, ko, tr, fa, bn, id, ms, th, vi,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
