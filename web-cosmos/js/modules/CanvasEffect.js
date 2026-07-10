import { Component } from './Component.js';

/**
 * Shared plumbing for full-size canvas backgrounds: creates the canvas,
 * keeps it sized to the root via ResizeObserver (device-pixel aware),
 * and runs a requestAnimationFrame loop. With prefers-reduced-motion
 * a single static frame is drawn instead of the loop.
 */
export class CanvasEffect extends Component {
  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'width:100%;height:100%;display:block;';
    this.root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.rafId = null;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.root);
    this.resize();

    this.setup();

    if (Component.reducedMotion) {
      this.draw();
    } else {
      this.bindPointer();
      const loop = () => {
        this.rafId = requestAnimationFrame(loop);
        this.resize();
        this.draw();
      };
      loop();
    }
  }

  /** One-time state setup before the first frame. */
  setup() {}

  /** Pointer listeners, only attached when animation runs. */
  bindPointer() {}

  unbindPointer() {}

  /** Renders one frame. */
  draw() {}

  resize() {
    const w = Math.max(1, Math.round(this.root.clientWidth * this.dpr));
    const h = Math.max(1, Math.round(this.root.clientHeight * this.dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.unbindPointer();
    this.canvas.remove();
  }
}
