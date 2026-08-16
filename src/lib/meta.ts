import { useEffect } from "react";
import type { Locale } from "@/content";
import { pageHead } from "./head";

/** Теги, которые ставит сборка и обновляет этот модуль. Всё остальное в
 *  <head> — иконки, стили, скрипты — не трогаем. */
const MANAGED = "[data-head]";

/**
 * Приводит <head> в соответствие языку страницы.
 *
 * Разметку берём из того же pageHead, что раскладывает статические ru/index.html
 * и en/index.html на сборке, — title, описание, canonical, hreflang, Open Graph
 * и schema.org описаны один раз. При первой загрузке теги уже верные и просто
 * переставляются; работа начинается при переключении языка на клиенте.
 */
export function applyHead(locale: Locale): void {
  document.documentElement.lang = locale;

  const parsed = new DOMParser().parseFromString(
    `<head>${pageHead(locale)}</head>`,
    "text/html",
  ).head;

  for (const node of Array.from(document.head.querySelectorAll(MANAGED))) {
    node.remove();
  }
  for (const node of Array.from(parsed.children)) {
    document.head.append(document.importNode(node, true));
  }
}

export function useHead(locale: Locale): void {
  useEffect(() => {
    applyHead(locale);
  }, [locale]);
}
