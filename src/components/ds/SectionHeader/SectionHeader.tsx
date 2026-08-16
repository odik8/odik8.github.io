import type { ReactNode } from "react";
import { cx } from "@/lib/classes";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: string;
  size?: "display" | "h1" | "h2";
  rule?: boolean;
  /** Id for the heading, so a section can be labelled by it. */
  titleId?: string;
}

/** Eyebrow + oversized statement. The one layout device every Odyssey section starts with. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  size = "h1",
  rule = true,
  titleId,
}: SectionHeaderProps) {
  return (
    <header className={cx(styles.header, rule && styles.ruled)}>
      {(eyebrow || index) && (
        <div className={styles.eyebrow}>
          {index && <span className={styles.index}>{index}</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}
      <h2 id={titleId} className={cx(styles.title, styles[size])}>
        {title}
      </h2>
      {lede && <p className={styles.lede}>{lede}</p>}
    </header>
  );
}
