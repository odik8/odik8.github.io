# Odyssey — портфолио

Одностраничный сайт-портфолио фронтенд-разработчика. Русская и английская
версии, тёмная редакционная вёрстка, собран по дизайн-системе Odyssey.

**Стек:** React 19 · TypeScript · Vite 8 · CSS Modules.
Без UI-библиотек и CSS-фреймворков — все компоненты свои.

Раньше сайт был собран на Next.js. Здесь та же вёрстка, те же тексты и тот же
дизайн, а серверные возможности заменены статическими.

---

## Запуск

```bash
npm install
npm run dev          # http://localhost:5173
```

| Команда | Что делает |
| --- | --- |
| `npm run dev` | Дев-сервер с горячей перезагрузкой |
| `npm run build` | Продакшен-сборка в `dist/` |
| `npm run preview` | Отдаёт собранный `dist/` локально |
| `npm run lint` | oxlint |
| `npm run typecheck` | Проверка типов без сборки |
| `npm run og` | Перерисовывает картинки превью в `public/` |

`npm run og` нужен только после правки текстов в hero — картинки лежат в
репозитории готовыми, сборка их не трогает.

---

## Где что лежит

```
index.html              Оболочка. <!--%HEAD%--> — место для метатегов локали
public/                 Файлы как есть: фавиконка, og-ru.png, og-en.png
scripts/
├── og.mjs              Рисует картинки превью (satori + resvg)
├── load-module.mjs     Импорт .ts-словарей из обычного скрипта Node
└── fonts/              Manrope в ttf — satori читает только его
src/
├── App.tsx             Сборка страницы из секций
├── main.tsx            Точка входа, подключение шрифтов и стилей
├── assets/             Портрет
├── components/
│   ├── ds/             Дизайн-система: Button, Card, Badge, Tag, Marquee…
│   ├── effects/        Курсор, лоадер, появление при скролле, плавный скролл
│   ├── layout/         Шапка, подвал, переключатель языка
│   └── sections/       Hero, Stack, Work, CaseStudy, Team, Contact
├── content/            Тексты: ru.ts, en.ts, links.ts, site.ts
├── lib/
│   ├── head.ts         Метатеги, sitemap, robots — один источник
│   ├── meta.ts         Обновление <head> при смене языка
│   ├── router.ts       Локаль в адресе, History API
│   ├── classes.ts      cx / toggleClass
│   └── motion.ts       prefers-reduced-motion, тип указателя
└── styles/             Токены дизайн-системы и базовые стили
```

Адрес сайта задан в `src/content/site.ts` — одна строка на весь проект.
При переезде на свой домен меняется только она.

---

## Как устроены языки

У каждого языка свой адрес: `/ru` и `/en`. Сборка раскладывает одну оболочку
по двум папкам (`vite.config.ts`, плагин `localePages`), поэтому прямая ссылка
на `/en` открывается сразу, а в `<head>` уже лежат нужные title, описание,
canonical, hreflang и Open Graph — превью в мессенджерах и поисковики видят их
без JavaScript.

Корень `/` определяет язык по `navigator.languages` и подменяет адрес на
языковой. Переключатель RU/EN — обычные ссылки: клик меняет язык без
перезагрузки, Ctrl+клик открывает вторую версию в новой вкладке.

---

## Что изменилось при переезде с Next.js

| Было в Next | Стало здесь |
| --- | --- |
| Маршруты `app/[locale]` | Статические `ru/index.html` и `en/index.html` из плагина в `vite.config.ts` |
| `proxy.ts` — редирект по `Accept-Language` | `negotiate()` в `src/lib/router.ts` по `navigator.languages` |
| `generateMetadata` | `src/lib/head.ts` на сборке + `src/lib/meta.ts` при смене языка |
| `sitemap.ts`, `robots.ts` | Тот же `head.ts`; файлы кладутся в `dist/` при сборке |
| `opengraph-image.tsx` — картинка рисовалась на каждый запрос | `npm run og` рисует её один раз в `public/` |
| `icon.tsx` | `public/favicon.svg` и `public/apple-touch-icon.png` |
| `next/font` | Пакеты `@fontsource-variable` — те же Manrope и JetBrains Mono с кириллицей |
| `next/image` | `<img>` с явными размерами и `fetchPriority="high"` |
| `"use client"` | Не нужно: в Vite весь код клиентский |

Вёрстка, CSS-модули, токены дизайн-системы и тексты перенесены без правок.

---

## Деплой

Сайт живёт в репозитории `odik8/odik8.github.io` и публикуется автоматически.

Ветка `main` — только исходники, ветка `gh-pages` — только собранная статика,
её и раздаёт GitHub Pages. На каждый push в `main` GitHub Actions
(`.github/workflows/deploy.yml`) ставит зависимости, выполняет `npm run build`
и выкладывает `dist/` в `gh-pages`. Руками в `gh-pages` пушить не надо —
следующая сборка всё равно перезапишет ветку.

То есть выложить правку — это `git push`:

```bash
git add .
git commit -m "Что изменилось"
git push
```

Через пару минут изменения на https://odik8.github.io. Ход сборки виден во
вкладке Actions репозитория.
