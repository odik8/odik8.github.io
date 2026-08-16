import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Loader.module.css";

/** The "Welcome" sheet that covers the page for the first 1.8s.
 *
 *  Set SHOW_LOADER to false to drop it: it delays first contentful paint by
 *  roughly its own duration, which is the price of the intro. */
const SHOW_LOADER = true;
const LIFETIME_MS = 1800;

export function Loader({ label }: { label: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // The stylesheet already hides the sheet under reduced motion; a zero-delay
    // timer just takes it out of the tree on the same path as a normal run.
    const delay = !SHOW_LOADER || prefersReducedMotion() ? 0 : LIFETIME_MS;
    const timer = window.setTimeout(() => setGone(true), delay);
    return () => window.clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div className={styles.sheet} aria-hidden="true">
      <span className={styles.word}>{label}</span>
    </div>
  );
}
