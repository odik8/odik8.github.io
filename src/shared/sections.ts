export const SECTIONS = [
  { id: 'about', name: 'About' },
  { id: 'skills', name: 'Skills' },
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'contact', name: 'Contacts' },
] as const

export type SectionId = typeof SECTIONS[number]['id']
