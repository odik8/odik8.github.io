/**
 * Картинки для превью ссылок и иконка для iOS.
 *
 * В Next это был маршрут opengraph-image.tsx: Next рисовал карточку на лету при
 * каждом запросе. GitHub Pages исполнять код не умеет, поэтому те же картинки
 * рисуются здесь один раз и кладутся в public/ как обычные файлы.
 *
 *   npm run og
 *
 * Тексты берутся из словарей сайта, так что карточка не разойдётся с главной
 * страницей. Шрифт — приложенный Manrope: satori читает только ttf, системного
 * начертания 800 нет, и без файла строки заголовка наезжают друг на друга.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { loadModule } from "./load-module.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const outDir = join(root, "public");

const INK = "#f4f4f5";
const MUTED = "#b8b8bd";
const ACCENT = "#ffd84d";
const PAPER = "#0a0a0d";

/** Мини-аналог JSX: satori принимает те же объекты, что отдаёт React. */
const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length > 1 ? children : children[0] },
});

const row = (style, ...children) => h("div", { style: { display: "flex", ...style } }, ...children);

/** Тёмная редакторская карточка: линейка, моноширинный надзаголовок, крупное
 *  утверждение. Один в один с Next-версией. */
function card(content) {
  const [first, second, third] = content.hero.titleLines;

  return row(
    {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
      background: PAPER,
      color: INK,
      padding: "72px",
      fontFamily: "Manrope",
    },
    row(
      {
        gap: 20,
        fontSize: 22,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: MUTED,
      },
      h("span", { style: { color: ACCENT } }, content.hero.index),
      h("span", {}, content.hero.eyebrow),
    ),
    row(
      {
        flexDirection: "column",
        fontSize: 108,
        fontWeight: 800,
        letterSpacing: "-0.045em",
        textTransform: "uppercase",
        lineHeight: 1,
      },
      h("span", {}, first),
      h("span", {}, second),
      h("span", { style: { color: ACCENT } }, third),
    ),
    row(
      {
        justifyContent: "space-between",
        borderTop: "1px solid rgba(255,255,255,0.14)",
        paddingTop: 28,
        fontSize: 24,
        color: MUTED,
      },
      h("span", {}, content.hero.facts.join("  ·  ")),
      row(
        { color: INK, fontWeight: 800 },
        h("span", {}, "Odyssey"),
        h("span", { style: { color: ACCENT } }, "."),
      ),
    ),
  );
}

/** Иконка для домашнего экрана: тот же знак, что и в favicon.svg. */
function appIcon() {
  return row(
    {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      background: PAPER,
      color: INK,
      fontFamily: "Manrope",
      fontSize: 120,
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },
    h("span", {}, "O"),
    h("span", { style: { color: ACCENT } }, "."),
  );
}

async function png(element, width, height, fonts) {
  const svg = await satori(element, { width, height, fonts });
  const image = new Resvg(svg, { fitTo: { mode: "width", value: width } })
    .render()
    .asPng();
  return image;
}

const fontDir = join(here, "fonts");
const [extraBold, regular] = await Promise.all([
  readFile(join(fontDir, "Manrope-ExtraBold.ttf")),
  readFile(join(fontDir, "Manrope-Regular.ttf")),
]);
const fonts = [
  { name: "Manrope", data: extraBold, weight: 800, style: "normal" },
  { name: "Manrope", data: regular, weight: 400, style: "normal" },
];

const { getContent, locales } = await loadModule(join(root, "src/content/index.ts"));

await mkdir(outDir, { recursive: true });

for (const locale of locales) {
  const file = join(outDir, `og-${locale}.png`);
  await writeFile(file, await png(card(getContent(locale)), 1200, 630, fonts));
  console.log(`og-${locale}.png — 1200×630`);
}

await writeFile(join(outDir, "apple-touch-icon.png"), await png(appIcon(), 180, 180, fonts));
console.log("apple-touch-icon.png — 180×180");
