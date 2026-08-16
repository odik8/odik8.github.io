import type { CSSProperties } from "react";
import { cx } from "@/lib/classes";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  items: string[];
  separator?: string;
  /** Loop duration in seconds. */
  speed?: number;
  size?: string;
  tone?: "outline" | "solid";
  reverse?: boolean;
}

/** Edge-to-edge scrolling type band. Duplicates its items so the loop is seamless.
 *  The only perpetual motion in the system — it stops under prefers-reduced-motion. */
export function Marquee({
  items,
  separator = "—",
  speed = 28,
  size = "3rem",
  tone = "outline",
  reverse = false,
}: MarqueeProps) {
  const run = [...items, ...items];

  return (
    <div
      className={styles.band}
      aria-hidden="true"
      style={
        {
          "--marquee-speed": `${speed}s`,
          "--marquee-size": size,
        } as CSSProperties
      }
    >
      <div className={cx(styles.track, reverse && styles.reverse)}>
        {run.map((item, i) => (
          <span className={styles.item} key={`${item}-${i}`}>
            <span className={tone === "solid" ? styles.solid : styles.outline}>{item}</span>
            <span className={styles.separator}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
