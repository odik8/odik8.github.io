import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Distance the sticky header covers, so an anchored section clears it. */
const HEADER_OFFSET = 96;

/** Wheel smoothing (scroll hijacking) is deliberately OFF.
 *
 *  The mock's script implemented it, but the design system's own readme rules it
 *  out — "no bounce, no spring, no parallax, no scroll-jacking". Hijacking the
 *  wheel also breaks trackpad momentum and assistive scrolling. Anchor easing
 *  below is unaffected. */
const SMOOTH_WHEEL = false;

export function SmoothScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      const to = Math.max(
        0,
        window.scrollY + target.getBoundingClientRect().top - HEADER_OFFSET,
      );

      if (prefersReducedMotion()) {
        window.scrollTo(0, to);
        history.pushState(null, "", href);
        return;
      }

      const from = window.scrollY;
      const distance = to - from;
      if (Math.abs(distance) < 2) return;

      // The stylesheet sets scroll-behavior: smooth for the no-JS case. Turn it
      // off while we drive the scroll ourselves, or the two ease against each other.
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";

      const duration = Math.min(1100, Math.max(450, Math.abs(distance) * 0.5));
      const start = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, from + distance * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          root.style.scrollBehavior = previous;
          history.pushState(null, "", href);
        }
      };
      requestAnimationFrame(step);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!SMOOTH_WHEEL) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let target = window.scrollY;
    let animating = false;

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const tick = () => {
      const current = window.scrollY;
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        window.scrollTo(0, target);
        animating = false;
        return;
      }
      window.scrollTo(0, current + diff * 0.12);
      requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented) return;
      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;
      const next = Math.min(maxScroll(), Math.max(0, target + delta));
      if (
        (next === 0 && window.scrollY === 0 && delta < 0) ||
        (next === maxScroll() && window.scrollY >= maxScroll() && delta > 0)
      ) {
        return;
      }
      event.preventDefault();
      target = next;
      if (!animating) {
        animating = true;
        requestAnimationFrame(tick);
      }
    };

    const sync = () => {
      if (!animating) target = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", sync);
    };
  }, []);

  return null;
}
