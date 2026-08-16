import { Icon } from "../Icon/Icon";
import styles from "./IndexRow.module.css";

interface IndexRowProps {
  index: string;
  title: string;
  meta?: string[];
  year?: string;
  href: string;
  /** External links get the usual new-tab treatment. */
  external?: boolean;
}

/** Numbered editorial list row — the primary way Odyssey presents work.
 *  This brand lists work; it does not grid it. */
export function IndexRow({ index, title, meta = [], year, href, external = false }: IndexRowProps) {
  return (
    <a
      href={href}
      className={styles.row}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className={styles.index}>{index}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.meta}>
        {meta.map((m) => (
          <span key={m}>{m}</span>
        ))}
        {year && <span>{year}</span>}
      </span>
      <Icon name="arrow-up-right" size={22} className={styles.arrow} />
    </a>
  );
}
