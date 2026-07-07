import { Reveal } from './Reveal.js';

/**
 * [data-js="reveal-group"] — reveals the element's children with a
 * stagger once the group scrolls into view. Step defaults to 80ms,
 * override per group with data-reveal-stagger="40".
 */
export class RevealGroup extends Reveal {
  prepare() {
    const step = Number(this.root.dataset.revealStagger) || 80;
    this.items = [...this.root.children];
    this.items.forEach((item, index) => {
      item.classList.add('reveal');
      item.style.setProperty('--reveal-delay', `${index * step}ms`);
    });
  }

  show() {
    this.observer.disconnect();
    for (const item of this.items) item.classList.add('reveal--visible');
  }
}
