import type { ReactNode } from "react";
import { cx } from "@/lib/classes";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "primary" | "secondary" | "success" | "danger";

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

/** Small mono status marker. Read-only — use Tag for anything clickable. */
export function Badge({ tone = "neutral", dot = false, children, className }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], className)}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
