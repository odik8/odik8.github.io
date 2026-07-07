import { CanvasEffect } from './CanvasEffect.js';

const GAP = 30;
const SPOTLIGHT_RADIUS = 300;

/**
 * [data-js="dot-grid"] — dark dot-grid page background with a soft
 * spotlight that smoothly follows the cursor.
 */
export class DotGrid extends CanvasEffect {
  setup() {
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.smoothX = -9999;
    this.smoothY = -9999;
  }

  bindPointer() {
    this.onMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) * this.dpr;
      this.mouseY = (e.clientY - rect.top) * this.dpr;
    };
    this.onLeave = () => {
      this.mouseX = -9999;
      this.mouseY = -9999;
    };
    window.addEventListener('mousemove', this.onMove);
    document.documentElement.addEventListener('mouseleave', this.onLeave);
  }

  unbindPointer() {
    if (!this.onMove) return;
    window.removeEventListener('mousemove', this.onMove);
    document.documentElement.removeEventListener('mouseleave', this.onLeave);
  }

  draw() {
    const { ctx, dpr } = this;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const gap = GAP * dpr;
    const radius = SPOTLIGHT_RADIUS * dpr;

    if (this.smoothX < -999) {
      this.smoothX = this.mouseX;
      this.smoothY = this.mouseY;
    }
    this.smoothX += (this.mouseX - this.smoothX) * 0.12;
    this.smoothY += (this.mouseY - this.smoothY) * 0.12;

    ctx.fillStyle = '#1d2027';
    ctx.fillRect(0, 0, w, h);

    if (this.mouseX > -999) {
      const halo = ctx.createRadialGradient(
        this.smoothX, this.smoothY, 0,
        this.smoothX, this.smoothY, radius * 1.4
      );
      halo.addColorStop(0, 'rgba(80, 120, 220, 0.05)');
      halo.addColorStop(1, 'rgba(80, 120, 220, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
    }

    const x0 = (w % gap) / 2;
    const y0 = (h % gap) / 2;
    for (let y = y0; y <= h; y += gap) {
      for (let x = x0; x <= w; x += gap) {
        const dx = x - this.smoothX;
        const dy = y - this.smoothY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let alpha = 0.14;
        let size = 1.1 * dpr;
        let lit = 0;
        if (dist < radius) {
          lit = 1 - dist / radius;
          lit *= lit;
          alpha = 0.14 + lit * 0.38;
          size = (1.1 + lit * 0.7) * dpr;
        }
        ctx.fillStyle = lit > 0.02
          ? `rgba(${Math.round(170 + lit * 30)}, ${Math.round(190 + lit * 25)}, 255, ${alpha.toFixed(3)})`
          : `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 6.2832);
        ctx.fill();
      }
    }
  }
}
