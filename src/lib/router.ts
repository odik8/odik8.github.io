import { useCallback, useEffect, useState } from "react";
import { defaultLocale, isLocale, type Locale } from "@/content";

/** Каталог, в котором опубликован сайт (BASE_URL Vite), без слэша на конце.
 *  Для корня домена это пустая строка. */
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

export function localeHref(locale: Locale): string {
  return `${base}/${locale}`;
}

/** Локаль из адреса: /ru, /en — или null, если открыт корень. */
function localeFromPath(): Locale | null {
  const path = window.location.pathname.slice(base.length);
  const segment = path.split("/").filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : null;
}

/** Выбор языка по списку браузера. В Next это делал middleware, разбирая
 *  заголовок Accept-Language; navigator.languages — тот же список, уже
 *  отсортированный по приоритету, поэтому достаточно взять первое совпадение. */
export function negotiate(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const short = tag.toLowerCase().split("-")[0];
    if (short && isLocale(short)) return short;
  }
  return defaultLocale;
}

/**
 * Язык страницы плюс переключатель.
 *
 * Каждый язык — свой адрес (/ru, /en), как и в Next-версии: ссылку можно
 * отправить, а поисковик разведёт версии по hreflang. Переключение идёт через
 * History API, без перезагрузки, поэтому «назад» в браузере работает.
 */
export function useLocale(): readonly [Locale, (next: Locale) => void] {
  const [locale, setLocale] = useState<Locale>(
    () => localeFromPath() ?? negotiate(navigator.languages),
  );

  useEffect(() => {
    // Корень нормализуем в языковой адрес — тем же правилом, что и редирект
    // middleware, только без обращения к серверу. Якорь сохраняем: по ссылке
    // вида "/#contact" читатель должен попасть в тот же раздел.
    if (!localeFromPath()) {
      window.history.replaceState(null, "", localeHref(locale) + window.location.hash);
    }
  }, [locale]);

  useEffect(() => {
    const onPopState = () =>
      setLocale(localeFromPath() ?? negotiate(navigator.languages));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const go = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      window.history.pushState(null, "", localeHref(next) + window.location.hash);
      setLocale(next);
    },
    [locale],
  );

  return [locale, go] as const;
}
