/** Статические <head> для каждой локали, sitemap и robots.
 *
 *  Модуль читает те же словари, что и приложение, и работает без DOM: его
 *  импортирует vite.config.ts, чтобы разложить готовые ru/index.html и
 *  en/index.html на этапе сборки. В Next это делали generateMetadata,
 *  sitemap.ts и robots.ts — здесь одна сборка строк.
 *
 *  Импорты нарочно относительные: конфиг Vite собирается esbuild'ом, алиас
 *  "@/" там не действует. */
import { getContent } from "../content/index";
import { links } from "../content/links";
import { siteUrl } from "../content/site";
import { defaultLocale, locales, type Locale } from "../content/types";

const escapeAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** JSON-LD внутри <script>: закрывающий тег в данных разорвал бы блок. */
const escapeJson = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c");

const localeUrl = (locale: Locale): string => `${siteUrl}/${locale}`;

const ogLocale = (locale: Locale): string => (locale === "ru" ? "ru_RU" : "en_US");

function personSchema(locale: Locale) {
  const content = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: locale === "ru" ? "Одиссей" : "Odyssey",
    jobTitle: locale === "ru" ? "Фронтенд-разработчик" : "Front-end developer",
    description: content.meta.description,
    url: localeUrl(locale),
    email: `mailto:${links.email}`,
    knowsAbout: ["React", "TypeScript", "Vite", "SCSS", "CSS Modules", "Git"],
    sameAs: [links.github, links.telegram],
  };
}

/** Разметка <head> для одной локали. `canonical` отличается от адреса страницы
 *  только на корне: "/" каноничен как "/ru", иначе поисковик увидит дубль. */
export function pageHead(locale: Locale): string {
  const content = getContent(locale);
  const url = localeUrl(locale);
  const image = `${siteUrl}/og-${locale}.png`;

  const tags = [
    `<title data-head>${escapeAttr(content.meta.title)}</title>`,
    `<meta data-head name="description" content="${escapeAttr(content.meta.description)}" />`,
    `<meta data-head name="robots" content="index, follow" />`,
    `<link data-head rel="canonical" href="${url}" />`,
    ...locales.map(
      (alt) => `<link data-head rel="alternate" hreflang="${alt}" href="${localeUrl(alt)}" />`,
    ),
    `<link data-head rel="alternate" hreflang="x-default" href="${localeUrl(defaultLocale)}" />`,
    `<meta data-head property="og:type" content="website" />`,
    `<meta data-head property="og:site_name" content="Odyssey" />`,
    `<meta data-head property="og:locale" content="${ogLocale(locale)}" />`,
    `<meta data-head property="og:url" content="${url}" />`,
    `<meta data-head property="og:title" content="${escapeAttr(content.meta.title)}" />`,
    `<meta data-head property="og:description" content="${escapeAttr(content.meta.description)}" />`,
    `<meta data-head property="og:image" content="${image}" />`,
    `<meta data-head property="og:image:width" content="1200" />`,
    `<meta data-head property="og:image:height" content="630" />`,
    `<meta data-head property="og:image:alt" content="${escapeAttr(content.meta.ogAlt)}" />`,
    `<meta data-head name="twitter:card" content="summary_large_image" />`,
    `<meta data-head name="twitter:title" content="${escapeAttr(content.meta.title)}" />`,
    `<meta data-head name="twitter:description" content="${escapeAttr(content.meta.description)}" />`,
    `<meta data-head name="twitter:image" content="${image}" />`,
    `<script data-head type="application/ld+json">${escapeJson(personSchema(locale))}</script>`,
  ];

  return tags.map((tag) => `    ${tag}`).join("\n");
}

export function sitemapXml(): string {
  const entries = locales
    .map((locale) => {
      const alternates = locales
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${alt}" href="${localeUrl(alt)}" />`,
        )
        .join("\n");
      return [
        "  <url>",
        `    <loc>${localeUrl(locale)}</loc>`,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${localeUrl(defaultLocale)}" />`,
        "    <changefreq>monthly</changefreq>",
        `    <priority>${locale === defaultLocale ? "1.0" : "0.8"}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}

export function robotsTxt(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Host: ${siteUrl}`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}
