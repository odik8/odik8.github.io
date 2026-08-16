import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/classes";
import styles from "./Card.module.css";

interface CardProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  interactive?: boolean;
  padding?: string;
  tone?: "raised" | "sunken";
  className?: string;
  style?: CSSProperties;
}

/** Raised surface. The default container for anything that isn't a full-bleed section. */
export function Card({
  eyebrow,
  title,
  children,
  footer,
  interactive = false,
  padding = "var(--space-6)",
  tone = "raised",
  className,
  style,
}: CardProps) {
  return (
    <div
      className={cx(styles.card, styles[tone], interactive && styles.interactive, className)}
      style={{ "--card-padding": padding, ...style } as CSSProperties}
    >
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      {title && <h3 className={styles.title}>{title}</h3>}
      {children && <div className={styles.body}>{children}</div>}
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
