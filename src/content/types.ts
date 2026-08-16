export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export interface LabelledValue {
  label: string;
  value: string;
}

export interface StackCard {
  index: string;
  title: string;
  tags: string[];
}

export interface WorkRow {
  index: string;
  title: string;
  meta: string[];
  year: string;
  href: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface ProseBlock {
  title: string;
  paragraphs: string[];
}

export interface TeamCard {
  index: string;
  title: string;
  body: string;
}

export interface Badge {
  tone: "neutral" | "success";
  dot?: boolean;
  label: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  loader: string;
  nav: {
    items: { href: string; label: string }[];
    cta: string;
    langLabel: string;
  };
  hero: {
    index: string;
    eyebrow: string;
    titleLines: [string, string, string];
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    photoAlt: string;
    facts: string[];
  };
  marquee: string[];
  stack: {
    index: string;
    eyebrow: string;
    title: string;
    cards: StackCard[];
  };
  work: {
    index: string;
    eyebrow: string;
    title: string;
    rows: WorkRow[];
    note: string;
  };
  caseStudy: {
    index: string;
    eyebrow: string;
    title: string;
    lede: string;
    mediaPlaceholder: string;
    facts: LabelledValue[];
    repoLabel: string;
    metrics: Metric[];
    blocks: ProseBlock[];
    cta: string;
  };
  team: {
    index: string;
    eyebrow: string;
    title: string;
    lede: string;
    cards: TeamCard[];
  };
  contact: {
    eyebrow: string;
    title: string;
    lede: string;
    badges: Badge[];
    cardLabel: string;
    ctaTelegram: string;
    ctaEmail: string;
  };
  footer: string;
}
