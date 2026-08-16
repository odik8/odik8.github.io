import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cx, setClass } from "@/lib/classes";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Reveal.module.css";

type RevealKind = "up" | "slide-x";

interface RevealProps {
  children: ReactNode;
  /** "up" lifts each child 22px; "slide-x" brings them in from the left. */
  kind?: RevealKind;
  as?: ElementType;
  className?: string;
  /** Stagger step between children, in ms. Capped at six children. */
  step?: number;
}

/** Reveals its direct children as the block scrolls into view.
 *
 *  The server renders everything visible, so the page is complete without JS.
 *  The hidden state is a class this effect adds on the client, and only to
 *  blocks still below the fold at mount — nothing already painted is hidden
 *  retroactively. Driving the class directly keeps this to zero re-renders. */
export function Reveal({
  children,
  kind = "up",
  as: Tag = "div",
  className,
  step = 80,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setClass(node, styles.armed, true);
    const show = () => setClass(node, styles.armed, false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);

    // Belt and braces: never leave content hidden if the observer never fires.
    const failsafe = window.setTimeout(show, 6000);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={cx(styles.reveal, styles[kind === "slide-x" ? "slideX" : "up"], className)}
      style={{ "--reveal-step": `${step}ms` }}
    >
      {children}
    </Tag>
  );
}
