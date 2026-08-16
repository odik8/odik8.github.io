import { IndexRow, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/effects/Reveal/Reveal";
import type { SiteContent } from "@/content/types";
import styles from "./Work.module.css";

export function Work({ work }: { work: SiteContent["work"] }) {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <SectionHeader
        index={work.index}
        eyebrow={work.eyebrow}
        title={work.title}
        size="h2"
        titleId="work-title"
      />
      <Reveal kind="slide-x" className={styles.list}>
        {work.rows.map((row) => (
          <IndexRow
            key={row.index}
            index={row.index}
            title={row.title}
            meta={row.meta}
            year={row.year}
            href={row.href}
            external={!row.href.startsWith("#")}
          />
        ))}
      </Reveal>
      <p className={styles.note}>{work.note}</p>
    </section>
  );
}
