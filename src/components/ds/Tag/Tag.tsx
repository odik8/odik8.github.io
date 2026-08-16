import type { ReactNode } from "react";
import { cx } from "@/lib/classes";
import styles from "./Tag.module.css";

interface TagProps {
  children: ReactNode;
  selected?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/** Filter chip. Used here as a read-only stack marker, so it renders as a span. */
export function Tag({ children, selected = false, size = "md", className }: TagProps) {
  return (
    <span
      className={cx(styles.tag, styles[size], selected && styles.selected, className)}
    >
      {children}
    </span>
  );
}
