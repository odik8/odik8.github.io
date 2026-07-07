import { Component } from './Component.js';

/** Keep the loader up long enough for the logo-reveal animation to play out. */
const MIN_VISIBLE_MS = 1800;
/** Duration of the mark's flight from centre to its header slot. */
const FLY_MS = 800;
/** Safety net if `transitionend` never fires (e.g. reduced motion). */
const FADE_FALLBACK_MS = 900;

/**
 * [data-js="loader"] — full-screen splash shown until the page has
 * finished loading. The markup renders it from first paint (no JS
 * needed to show it). Once the reveal has played and `window.load`
 * has fired, the drawn logo mark flies (FLIP-style) into the exact
 * position/scale of the header logo, the backdrop dissolves, and the
 * real header mark takes over — a seamless handoff.
 */
export class Loader extends Component {
  init() {
    this.startedAt = performance.now();
    document.documentElement.classList.add('is-loading');

    if (document.readyState === 'complete') {
      this.scheduleDismiss();
    } else {
      this.onLoad = () => this.scheduleDismiss();
      window.addEventListener('load', this.onLoad, { once: true });
    }
  }

  scheduleDismiss() {
    const elapsed = performance.now() - this.startedAt;
    this.dismissTimer = window.setTimeout(
      () => this.dismiss(),
      Math.max(0, MIN_VISIBLE_MS - elapsed)
    );
  }

  dismiss() {
    const logo = this.find('loader-logo');
    const headerMark = document.querySelector('.header__logo .logo__mark');

    if (Component.reducedMotion || !logo || !headerMark) {
      return this.simpleHide();
    }

    const from = logo.getBoundingClientRect();
    const to = headerMark.getBoundingClientRect();
    if (!to.width || !to.height) return this.simpleHide();

    // FLIP: translate + scale the drawn mark onto the header mark's box.
    const scale = to.width / from.width;
    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);

    // Dissolve backdrop, glow and caption while the mark travels.
    this.root.classList.add('loader--dismiss');

    logo.style.transition = `transform ${FLY_MS}ms cubic-bezier(0.7, 0, 0.2, 1)`;
    logo.getBoundingClientRect(); // flush the starting frame so the transition runs
    logo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

    logo.addEventListener('transitionend', this.reveal, { once: true });
    this.flyFallback = window.setTimeout(this.reveal, FLY_MS + 150);
  }

  simpleHide() {
    this.root.classList.add('loader--hidden');
    document.documentElement.classList.remove('is-loading');
    this.fadeFallback = window.setTimeout(this.reveal, FADE_FALLBACK_MS);
    this.root.addEventListener('transitionend', this.reveal, { once: true });
  }

  /** Hand the mark back to the real header logo, then drop the splash. */
  reveal = () => {
    if (this.done) return;
    this.done = true;
    if (this.flyFallback) clearTimeout(this.flyFallback);
    if (this.fadeFallback) clearTimeout(this.fadeFallback);
    document.documentElement.classList.remove('is-loading');
    this.root.hidden = true;
  };

  destroy() {
    if (this.onLoad) window.removeEventListener('load', this.onLoad);
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
    if (this.flyFallback) clearTimeout(this.flyFallback);
    if (this.fadeFallback) clearTimeout(this.fadeFallback);
    document.documentElement.classList.remove('is-loading');
  }
}
