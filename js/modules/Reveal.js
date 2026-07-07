import { Component } from './Component.js';

/**
 * [data-js="reveal"] — fades/slides the element in the first time it
 * scrolls into view. The hidden state is applied from JS, so content
 * stays visible when scripts don't run; reduced motion skips the effect.
 */
export class Reveal extends Component {
  static observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

  init() {
    if (Component.reducedMotion || !('IntersectionObserver' in window)) return;
    this.prepare();
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) this.show();
    }, Reveal.observerOptions);
    this.observer.observe(this.root);
  }

  prepare() {
    this.root.classList.add('reveal');
  }

  show() {
    this.observer.disconnect();
    this.root.classList.add('reveal--visible');
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
  }
}
