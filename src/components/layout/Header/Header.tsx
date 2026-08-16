import { useEffect, useRef, useState } from "react";
import { Button, Icon, Wordmark } from "@/components/ds";
import { cx } from "@/lib/classes";
import { LangSwitch } from "../LangSwitch/LangSwitch";
import { links } from "@/content/links";
import type { Locale, SiteContent } from "@/content/types";
import styles from "./Header.module.css";

interface HeaderProps {
  nav: SiteContent["nav"];
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

/** The one fixed element in the system: a 72px sticky island.
 *  It contracts past 24px of scroll and retracts entirely when the reader is
 *  scrolling down through the body of the page. */
export function Header({ nav, locale, onLocaleChange }: HeaderProps) {
  const [lifted, setLifted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setLifted(y > 24);
      setHidden((wasHidden) => {
        if (menuOpen) return false;
        if (y > 280 && y > lastY.current + 4) return true;
        if (y < lastY.current - 4) return false;
        return wasHidden;
      });
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Close the panel on Escape, and lock the page behind it while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cx(styles.header, hidden && styles.hidden)}
      >
        <div className={cx(styles.island, lifted && styles.lifted)}>
          <a href="#top" className={styles.brand} aria-label="Odyssey">
            <Wordmark size={20} />
          </a>

          <nav className={styles.nav} aria-label={nav.langLabel}>
            {nav.items.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <LangSwitch current={locale} label={nav.langLabel} onChange={onLocaleChange} />
            <Button
              as="a"
              href={links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="sm"
              iconRight="arrow-up-right"
              className={styles.cta}
            >
              {nav.cta}
            </Button>
            <button
              type="button"
              className={styles.burger}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <Icon name={menuOpen ? "x" : "menu"} size={20} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        className={cx(styles.panel, menuOpen && styles.panelOpen)}
        hidden={!menuOpen}
      >
        <nav className={styles.panelNav}>
          {nav.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.panelLink}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button
          as="a"
          href={links.telegram}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          iconRight="arrow-up-right"
          onClick={() => setMenuOpen(false)}
        >
          {nav.cta}
        </Button>
      </div>
    </>
  );
}
