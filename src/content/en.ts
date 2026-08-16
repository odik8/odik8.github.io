import { links } from "./links";
import type { SiteContent } from "./types";

export const en: SiteContent = {
  meta: {
    title: "Odyssey — front-end developer",
    description:
      "Front-end developer working in React and TypeScript. A client portal for a law firm, two years of markup work in a team. Looking for a permanent position.",
    ogAlt: "Odyssey — front-end developer",
  },

  loader: "Welcome",

  nav: {
    items: [
      { href: "#stack", label: "Stack" },
      { href: "#work", label: "Work" },
      { href: "#team", label: "Team" },
      { href: "#contact", label: "Contact" },
    ],
    cta: "Message me",
    langLabel: "Interface language",
  },

  hero: {
    index: "00",
    eyebrow: "Front-end developer · React + TypeScript",
    titleLines: ["Odyssey", "front-end", "developer"],
    lede:
      "My name is Odyssey, 21. I build interfaces in React and TypeScript. Latest project: a client portal for a law firm. Before that, two years of markup work in a team with a manager, a designer and SEO specialists.",
    ctaPrimary: "See the work",
    ctaSecondary: "Telegram",
    photoAlt: "Odyssey",
    facts: ["21 years old", "NCFU — software engineering", "Ready to relocate"],
  },

  marquee: ["React", "TypeScript", "Vite", "SCSS", "Git"],

  stack: {
    index: "01",
    eyebrow: "Stack",
    title: "Technologies",
    cards: [
      {
        index: "01",
        title: "Front end",
        tags: [
          "React 19",
          "TypeScript",
          "Vite",
          "CSS modules",
          "SCSS",
          "Responsive markup",
        ],
      },
      {
        index: "02",
        title: "Process",
        tags: ["Git", "npm", "eslint", "Tests", "Figma to markup"],
      },
    ],
  },

  work: {
    index: "02",
    eyebrow: "Work",
    title: "Repositories",
    rows: [
      {
        index: "01",
        title: "Pravo na Zaschitu",
        meta: ["React 19", "TypeScript", "Vite"],
        year: "2026",
        href: "#case",
      },
      {
        index: "02",
        title: "Todo",
        meta: ["React", "Vite", "SCSS", "json-server"],
        year: "2025",
        href: links.repoTodo,
      },
    ],
    note: "Todo is a study project: React, Vite, SCSS, data from db.json5. The portal below is described in detail.",
  },

  caseStudy: {
    index: "03",
    eyebrow: "Case study",
    title: "Pravo na Zaschitu",
    lede:
      "A client portal for a personal-bankruptcy law firm. The screens and fields come from a live site that had static markup and no logic; I built a working portal underneath it.",
    mediaPlaceholder: "Interface screenshots — no files supplied yet",
    facts: [
      { label: "Role", value: "Front end, solo" },
      { label: "Stack", value: "React 19 · TypeScript · Vite · CSS modules" },
      { label: "Status", value: "Complete, on a study server" },
    ],
    repoLabel: "Code",
    metrics: [
      { value: "6", label: "sections, from case stages to chat" },
      { value: "27", label: "questionnaire fields kept as a draft" },
    ],
    blocks: [
      {
        title: "The problem",
        paragraphs: [
          "The firm had screens and no logic: a client could not see the stage of their case, send the questionnaire, upload documents, sign the contract or look at the instalment schedule. All of it had to fit the markup that already existed, without changing the set of fields.",
        ],
      },
      {
        title: "What I built",
        paragraphs: [
          "Login by code, the whole portal fetched in one bootstrap request, a questionnaire kept as a draft, document upload and removal, contract signing, chat with the lawyer and the manager, payments with the instalment schedule, and notifications.",
          "One Vite application: routes, state and requests sit next to each other, and the response types are written once and used by both the forms and the screens. A study server on express reads and writes the data.",
        ],
      },
      {
        title: "What deliberately does not work",
        paragraphs: [
          "The server is a study one: the token is fake and there are no real text messages — the confirmation code appears on screen. Payment is not real either: a provider needs a company and a contract. Chat has no realtime — messages arrive on reload. There is no staff panel in the project: this is the client portal and nothing else.",
        ],
      },
    ],
    cta: "Read the code",
  },

  team: {
    index: "04",
    eyebrow: "Team",
    title: "Working in a team",
    lede:
      "Two years of markup work in a team with a manager, a designer and SEO specialists. How the hand-offs worked.",
    cards: [
      {
        index: "01",
        title: "Designer",
        body: "Uncovered the states missing from the file — hover, empty list, long strings — with the designer before building them.",
      },
      {
        index: "02",
        title: "SEO",
        body: "SEO set the markup requirements: heading order, alt text, semantics. Their edits came as a list and went into the markup.",
      },
      {
        index: "03",
        title: "Manager",
        body: "Reported task status to the manager: done, waiting on an answer, not started.",
      },
    ],
  },

  contact: {
    eyebrow: "05 — Now",
    title: "Looking for work",
    lede:
      "Looking for a permanent front-end position, junior level included. React and TypeScript. Full time, relocation possible.",
    badges: [
      { tone: "success", dot: true, label: "Open to offers" },
      { tone: "neutral", label: "Relocation" },
      { tone: "neutral", label: "Full time" },
    ],
    cardLabel: "Contacts",
    ctaTelegram: "Message on Telegram",
    ctaEmail: "Email",
  },

  footer: "© 2026 Odyssey · Front-end developer",
};
