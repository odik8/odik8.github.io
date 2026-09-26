import { Marquee } from "@/components/ds";
import { Cursor } from "@/components/effects/Cursor/Cursor";
import { Loader } from "@/components/effects/Loader/Loader";
import { SmoothScroll } from "@/components/effects/SmoothScroll/SmoothScroll";
import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { Contact, Hero, Stack, Team, Work } from "@/components/sections";
import { getContent } from "@/content";
import { useHead } from "@/lib/meta";
import { useLocale } from "@/lib/router";
import styles from "./App.module.css";

export function App() {
  const [locale, setLocale] = useLocale();

  // title, описание, canonical, hreflang, Open Graph и schema.org —
  // на сборке лежат в статическом <head>, здесь обновляются при смене языка.
  useHead(locale);

  const content = getContent(locale);

  return (
    <>
      <Loader label={content.loader} />
      <Cursor />
      <SmoothScroll />

      <Header nav={content.nav} locale={locale} onLocaleChange={setLocale} />

      <main id="top">
        <Hero hero={content.hero} />

        <div className={styles.band}>
          <Marquee items={content.marquee} size="clamp(2rem, 4vw, 3.5rem)" />
        </div>

        <Stack stack={content.stack} />
        <Work work={content.work} />
        <Team team={content.team} />
        <Contact contact={content.contact} />
      </main>

      <Footer text={content.footer} />
    </>
  );
}
