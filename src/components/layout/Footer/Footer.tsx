import styles from "./Footer.module.css";

export function Footer({ text }: { text: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.line}>{text}</span>
      </div>
    </footer>
  );
}
