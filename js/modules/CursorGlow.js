import { Component } from './Component.js';

/**
 * [data-js="cursor-glow"] — white circle blended with mix-blend-mode:
 * difference that follows the cursor inside its parent surface. It grows
 * to full size over [data-js="glow-target"] text (hero headline / lead)
 * and shrinks elsewhere; interactive elements opt out.
 */
export class CursorGlow extends Component {
  init() {
    if (Component.reducedMotion || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }
    this.host = this.root.parentElement;
    this.onMove = (e) => this.move(e);
    window.addEventListener('mousemove', this.onMove);
  }

  move(e) {
    const rect = this.host.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    const overText = e.target instanceof Element
      && e.target.closest('[data-js="glow-target"]')
      && !e.target.closest('a, button, input');

    this.root.style.opacity = inside && overText ? '1' : '0';
    if (inside) {
      this.root.style.transform = `translate(${x}px, ${y}px) scale(${overText ? 1 : 0.4})`;
    }
  }

  destroy() {
    if (this.onMove) window.removeEventListener('mousemove', this.onMove);
  }
}
