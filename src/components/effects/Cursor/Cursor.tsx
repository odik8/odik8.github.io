import { useEffect, useRef } from "react";
import { toggleClass } from "@/lib/classes";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import styles from "./Cursor.module.css";

const FOLLOW = 0.16;
const INTERACTIVE = "a, button, [role='button']";

/** A ring that trails the pointer and swells over anything clickable.
 *  Skipped entirely on touch and under prefers-reduced-motion. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: pointer.x, y: pointer.y };
    let seen = false;
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!seen) {
        seen = true;
        current.x = pointer.x;
        current.y = pointer.y;
        dot.style.opacity = "1";
      }
      const target = event.target as Element | null;
      const over = Boolean(target?.closest?.(INTERACTIVE));
      toggleClass(dot, styles.over, over);
    };

    const onLeave = () => {
      dot.style.opacity = "0";
    };
    const onEnter = () => {
      if (seen) dot.style.opacity = "1";
    };

    const tick = () => {
      current.x += (pointer.x - current.x) * FOLLOW;
      current.y += (pointer.y - current.y) * FOLLOW;
      dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return <div ref={dotRef} className={styles.cursor} aria-hidden="true" />;
}
