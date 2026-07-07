import { Component } from './Component.js';

/** Keep the loader on screen at least this long so it doesn't just flash. */
const MIN_VISIBLE_MS = 600;
/** Safety net if `transitionend` never fires (e.g. reduced motion). */
const FADE_FALLBACK_MS = 700;

/**
 * [data-js="loader"] — full-screen splash shown until the page has
 * finished loading. The markup renders it from first paint (no JS
 * needed to show it); this component only handles hiding it once
 * `window.load` fires, then removes it from the flow.
 */
export class Loader extends Component {
  init() {
    this.startedAt = performance.now();
    document.documentElement.classList.add('is-loading');

    if (document.readyState === 'complete') {
      this.scheduleHide();
    } else {
      this.onLoad = () => this.scheduleHide();
      window.addEventListener('load', this.onLoad, { once: true });
    }
  }

  scheduleHide() {
    const elapsed = performance.now() - this.startedAt;
    this.hideTimer = window.setTimeout(
      () => this.hide(),
      Math.max(0, MIN_VISIBLE_MS - elapsed)
    );
  }

  hide() {
    document.documentElement.classList.remove('is-loading');
    this.root.classList.add('loader--hidden');

    this.finish = () => {
      this.root.hidden = true;
      this.root.removeEventListener('transitionend', this.finish);
    };
    this.root.addEventListener('transitionend', this.finish);
    this.fadeFallback = window.setTimeout(this.finish, FADE_FALLBACK_MS);
  }

  destroy() {
    if (this.onLoad) window.removeEventListener('load', this.onLoad);
    if (this.hideTimer) clearTimeout(this.hideTimer);
    if (this.fadeFallback) clearTimeout(this.fadeFallback);
    document.documentElement.classList.remove('is-loading');
  }
}
