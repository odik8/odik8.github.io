import type { CSSProperties } from "react";
import { cx } from "@/lib/classes";
import styles from "./Wordmark.module.css";

interface WordmarkProps {
  /** Cap height in px. The mark is type, so this is its font-size. */
  size?: number;
  accent?: boolean;
  mono?: boolean;
  className?: string;
}

/** The Odyssey wordmark. Type only — no logo mark exists. */
export function Wordmark({ size = 20, accent = true, mono = false, className }: WordmarkProps) {
  return (
    <span
      className={cx(styles.mark, mono && styles.mono, className)}
      style={{ "--wordmark-size": `${size}px` } as CSSProperties}
    >
      Odyssey
      {accent && <span className={styles.dot}>.</span>}
    </span>
  );
}
