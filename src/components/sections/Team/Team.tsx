import { Card, SectionHeader } from "@/components/ds";
import { Reveal } from "@/components/effects/Reveal/Reveal";
import type { SiteContent } from "@/content/types";
import styles from "./Team.module.css";

export function Team({ team }: { team: SiteContent["team"] }) {
  return (
    <section id="team" className={styles.section} aria-labelledby="team-title">
      <SectionHeader
        index={team.index}
        eyebrow={team.eyebrow}
        title={team.title}
        lede={team.lede}
        size="h2"
        titleId="team-title"
      />
      <Reveal kind="up" className={styles.grid}>
        {team.cards.map((card) => (
          <Card key={card.index} eyebrow={card.index} title={card.title}>
            <p>{card.body}</p>
          </Card>
        ))}
      </Reveal>
    </section>
  );
}
