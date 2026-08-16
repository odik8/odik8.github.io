import { Button } from "@/components/ds";
import { cx } from "@/lib/classes";
import { links } from "@/content/links";
import type { SiteContent } from "@/content/types";
import portrait from "@/assets/portrait.jpg";
import styles from "./Hero.module.css";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const [first, second, third] = hero.titleLines;

  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>
        <span className={styles.index}>{hero.index}</span>
        <span>{hero.eyebrow}</span>
      </div>

      {/* Each line is its own clipped block so it can rise independently, which
          leaves nothing between the words. The trailing spaces are therefore
          load-bearing — do not "tidy" them away: without them the heading reads
          as one run-on word to screen readers and to anything parsing text.
          The label is derived from the same array, so it cannot drift, and it
          keeps the accessible name correct even if a formatter eats a space. */}
      <h1 className={styles.title} aria-label={hero.titleLines.join(" ")}>
        <span className={styles.lineMask}>
          <span className={cx(styles.line, styles.rise1)}>{first} </span>
        </span>
        <span className={styles.lineMask}>
          <span className={cx(styles.line, styles.rise2)}>{second} </span>
        </span>
        <span className={styles.lineMask}>
          <span className={cx(styles.line, styles.gradient, styles.slide)}>{third}</span>
        </span>
      </h1>

      <div className={styles.body}>
        <div className={styles.copy}>
          <p className={styles.lede}>{hero.lede}</p>
          <div className={styles.actions}>
            <Button as="a" href="#work" variant="primary" size="lg" iconRight="arrow-up-right">
              {hero.ctaPrimary}
            </Button>
            <Button
              as="a"
              href={links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="lg"
            >
              {hero.ctaSecondary}
            </Button>
          </div>
        </div>

        {/* Портрет в первом экране: грузим сразу и с высоким приоритетом.
            Размеры проставлены явно — без них строка сначала схлопывается,
            а потом прыгает, когда картинка доезжает. */}
        <img
          src={portrait}
          alt={hero.photoAlt}
          className={styles.portrait}
          width={640}
          height={640}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className={styles.facts}>
        {hero.facts.map((fact) => (
          <span key={fact}>{fact}</span>
        ))}
      </div>
    </section>
  );
}
