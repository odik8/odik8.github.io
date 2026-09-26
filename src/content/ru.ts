import { links } from "./links";
import type { SiteContent } from "./types";

export const ru: SiteContent = {
  meta: {
    title: "Одиссей — фронтенд-разработчик",
    description:
      "Фронтенд-разработчик, React и TypeScript. Кабинет клиента для юрфирмы, два года вёрстки в команде. Ищу постоянную работу.",
    ogAlt: "Одиссей — фронтенд-разработчик",
  },

  loader: "Welcome",

  nav: {
    items: [
      { href: "#stack", label: "Стек" },
      { href: "#work", label: "Проекты" },
      { href: "#team", label: "Команда" },
      { href: "#contact", label: "Контакты" },
    ],
    cta: "Написать",
    langLabel: "Язык интерфейса",
  },

  hero: {
    index: "00",
    eyebrow: "Фронтенд-разработчик · React + TypeScript",
    titleLines: ["Одиссей", "frontend", "разработчик"],
    lede:
      "Меня зовут Одиссей, 21 год. Пишу интерфейсы на React и TypeScript. Последний проект — кабинет клиента для юрфирмы. До этого два года верстал в команде с менеджером, дизайнером и сеошниками.",
    ctaPrimary: "Смотреть проекты",
    ctaSecondary: "Телеграм",
    photoAlt: "Одиссей",
    facts: ["21 год", "СКФУ — программная инженерия", "Готов к переезду"],
  },

  marquee: ["React", "TypeScript", "Vite", "SCSS", "Git"],

  stack: {
    index: "01",
    eyebrow: "Стек",
    title: "Технологии",
    cards: [
      {
        index: "01",
        title: "Фронтенд",
        tags: [
          "React 19",
          "TypeScript",
          "Vite",
          "CSS-модули",
          "SCSS",
          "Адаптивная вёрстка",
        ],
      },
      {
        index: "02",
        title: "Процесс",
        tags: ["Git", "npm", "eslint", "Тесты", "Figma → вёрстка"],
      },
    ],
  },

  work: {
    index: "02",
    eyebrow: "Проекты",
    title: "Репозитории",
    rows: [
      {
        index: "01",
        title: "Право на Защиту",
        meta: ["React 19", "TypeScript", "Vite"],
        year: "2026",
        href: links.repoPravo,
      },
      {
        index: "02",
        title: "Todo",
        meta: ["React", "Vite", "SCSS", "json-server"],
        year: "2025",
        href: links.repoTodo,
      },
    ],
    note: "Todo — учебный проект: React, Vite, SCSS, данные из db.json5.",
  },

  team: {
    index: "03",
    eyebrow: "Команда",
    title: "Работа в команде",
    lede:
      "Верстал в команде с менеджером, дизайнером и сеошниками. Как было устроено взаимодействие.",
    cards: [
      {
        index: "01",
        title: "Дизайнер",
        body: "Уточнял у дизайнера состояния, которых не было в макете: ховеры, пустые списки, длинные строки.",
      },
      {
        index: "02",
        title: "SEO",
        body: "Сеошники задавали требования к разметке: порядок заголовков, alt, семантика. Правки приходили списком и вносились в вёрстку.",
      },
      {
        index: "03",
        title: "Менеджер",
        body: "Менеджеру отдавал статус задач: сделано, ждёт ответа, не начато.",
      },
    ],
  },

  contact: {
    eyebrow: "04 — Сейчас",
    title: "Ищу работу",
    lede:
      "Ищу постоянную работу фронтенд-разработчиком, в том числе джуниор-позиции. React и TypeScript. Полный день, возможен переезд.",
    badges: [
      { tone: "success", dot: true, label: "Открыт к предложениям" },
      { tone: "neutral", label: "Релокация" },
      { tone: "neutral", label: "Полный день" },
    ],
    cardLabel: "Контакты",
    ctaTelegram: "Написать в Телеграм",
    ctaEmail: "Почта",
  },

  footer: "© 2026 Одиссей · фронтенд-разработчик",
};
