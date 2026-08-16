import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { pageHead, robotsTxt, sitemapXml } from "./src/lib/head";
import { defaultLocale, locales, type Locale } from "./src/content/types";

/** Место, куда плагин подставляет <head> локали. В dev-режиме маркер просто
 *  остаётся комментарием, а теги на лету проставляет src/lib/meta.ts. */
const HEAD_MARKER = "<!--%HEAD%-->";

/**
 * Раскладывает собранный SPA по статическим адресам локалей.
 *
 * Next отдавал /ru и /en маршрутами, а редирект с корня делал middleware.
 * GitHub Pages умеет только отдавать файлы, поэтому из одной оболочки
 * получаются ru/index.html и en/index.html — прямая ссылка на /ru открывается
 * сразу, без фолбэка через 404.html, и в <head> уже лежат нужные метатеги,
 * так что превью в мессенджерах и поисковики видят их без JavaScript.
 */
function localePages(): Plugin {
  const render = (shell: string, locale: Locale): string =>
    shell
      .replace(/<html lang="[^"]*"/, `<html lang="${locale}"`)
      // Замена функцией: в тексте может встретиться "$", а он в строке-замене
      // имеет специальный смысл. Отступ маркера съедаем — свой у pageHead.
      .replace(new RegExp(`[ \\t]*${HEAD_MARKER}`), () => pageHead(locale));

  return {
    name: "odyssey:locale-pages",
    apply: "build",
    enforce: "post",

    generateBundle(_options, bundle) {
      const shellAsset = bundle["index.html"];
      if (!shellAsset || shellAsset.type !== "asset") {
        // this.error бросает исключение — сборка остановится здесь.
        this.error("index.html не найден в сборке — раскладывать по локалям нечего");
      }

      const shell = String(shellAsset.source);

      // Корень: словарь локали по умолчанию, но canonical ведёт на /ru —
      // приложение при старте само заменит адрес на языковой.
      shellAsset.source = render(shell, defaultLocale);

      for (const locale of locales) {
        this.emitFile({
          type: "asset",
          fileName: `${locale}/index.html`,
          source: render(shell, locale),
        });
      }

      // GitHub Pages отдаёт этот файл на любой несуществующий адрес.
      // Оболочка та же, так что вместо стандартной ошибки открывается сайт.
      this.emitFile({
        type: "asset",
        fileName: "404.html",
        source: render(shell, defaultLocale),
      });

      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemapXml() });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robotsTxt() });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localePages()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2022",
  },
});
