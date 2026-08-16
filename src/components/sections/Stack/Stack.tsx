import { Card, SectionHeader, Tag } from "@/components/ds";
import { Reveal } from "@/components/effects/Reveal/Reveal";
import type { SiteContent } from "@/content/types";
import styles from "./Stack.module.css";

export function Stack({ stack }: { stack: SiteContent["stack"] }) {
  return (
    <section id="stack" className={styles.section} aria-labelledby="stack-title">
      <SectionHeader
        index={stack.index}
        eyebrow={stack.eyebrow}
        title={stack.title}
        size="h2"
        titleId="stack-title"
      />
      <Reveal kind="up" className={styles.grid}>
        {stack.cards.map((card) => (
          <Card key={card.index} eyebrow={card.index} title={card.title}>
            <div className={styles.tags}>
              {card.tags.map((tag) => (
                <Tag key={tag} size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>
        ))}
      </Reveal>
    </section>
  );
}
