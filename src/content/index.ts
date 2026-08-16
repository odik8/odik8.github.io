import { en } from "./en";
import { ru } from "./ru";
import type { Locale, SiteContent } from "./types";

const dictionaries: Record<Locale, SiteContent> = { ru, en };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}

export * from "./types";
export { links } from "./links";
export { siteUrl } from "./site";
