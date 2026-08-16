import { Button, Card, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/effects/Reveal/Reveal";
import { links } from "@/content/links";
import type { SiteContent } from "@/content/types";
import styles from "./CaseStudy.module.css";

export function CaseStudy({ caseStudy }: { caseStudy: SiteContent["caseStudy"] }) {
  const [opening, ...rest] = caseStudy.blocks;

  return (
    <section id="case" className={styles.section} aria-labelledby="case-title">
      <SectionHeader
        index={caseStudy.index}
        eyebrow={caseStudy.eyebrow}
        title={caseStudy.title}
        lede={caseStudy.lede}
        size="h2"
        titleId="case-title"
      />

      {/* No screenshots were supplied, so the media slot is a labelled placeholder
          rather than invented imagery. */}
      <div className={styles.media}>
        <div className={styles.mediaFade} />
        <span className={styles.mediaLabel}>{caseStudy.mediaPlaceholder}</span>
      </div>

      <div className={styles.body}>
        <Reveal as="aside" kind="slide-x" className={styles.aside}>
          {caseStudy.facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <span className={styles.factLabel}>{fact.label}</span>
              <span className={styles.factValue}>{fact.value}</span>
            </div>
          ))}
          <div className={styles.fact}>
            <span className={styles.factLabel}>{caseStudy.repoLabel}</span>
            <a
              href={links.repoPravo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repo}
            >
              {links.repoPravoHandle}
            </a>
          </div>
        </Reveal>

        <Reveal as="article" kind="up" className={styles.article}>
          {opening && (
            <div className={styles.block}>
              <h3 className={styles.blockTitle}>{opening.title}</h3>
              {opening.paragraphs.map((text) => (
                <p key={text} className={styles.paragraph}>
                  {text}
                </p>
              ))}
            </div>
          )}

          <div className={styles.metrics}>
            {caseStudy.metrics.map((metric) => (
              <Card key={metric.value} tone="sunken" padding="var(--space-6)">
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </Card>
            ))}
          </div>

          {rest.map((block) => (
            <div key={block.title} className={styles.block}>
              <h3 className={styles.blockTitle}>{block.title}</h3>
              {block.paragraphs.map((text) => (
                <p key={text} className={styles.paragraph}>
                  {text}
                </p>
              ))}
            </div>
          ))}

          <div className={styles.cta}>
            <Button
              as="a"
              href={links.repoPravo}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              iconRight="arrow-up-right"
            >
              {caseStudy.cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
