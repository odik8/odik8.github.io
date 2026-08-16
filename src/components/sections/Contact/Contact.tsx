import { Badge, Button, Card } from "@/components/ds";
import { links } from "@/content/links";
import type { SiteContent } from "@/content/types";
import styles from "./Contact.module.css";

export function Contact({ contact }: { contact: SiteContent["contact"] }) {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.grid}>
        <div className={styles.statement}>
          <span className={styles.eyebrow}>{contact.eyebrow}</span>
          {/* A real heading rather than the mock's styled span, so the section
              keeps its place in the document outline. */}
          <h2 id="contact-title" className={styles.title}>
            {contact.title}
          </h2>
          <p className={styles.lede}>{contact.lede}</p>
          <div className={styles.badges}>
            {contact.badges.map((badge) => (
              <Badge key={badge.label} tone={badge.tone} dot={badge.dot}>
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>

        <Card tone="sunken" padding="var(--space-8)">
          <span className={styles.cardLabel}>{contact.cardLabel}</span>
          <div className={styles.links}>
            <a
              href={links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Telegram — {links.telegramHandle}
            </a>
            <a href={`mailto:${links.email}`} className={styles.link}>
              {links.email}
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {links.githubHandle}
            </a>
          </div>
          <div className={styles.actions}>
            <Button
              as="a"
              href={links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              iconRight="arrow-up-right"
            >
              {contact.ctaTelegram}
            </Button>
            <Button as="a" href={`mailto:${links.email}`} variant="ghost" icon="mail">
              {contact.ctaEmail}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
