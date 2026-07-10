import { CanvasEffect } from './CanvasEffect.js';

const POINT_COUNT = 80;
const LINK_DISTANCE = 0.11;

/**
 * [data-js="constellation"] — floating particle network in the hero;
 * particles link to each other and to the cursor when close enough.
 */
export class Constellation extends CanvasEffect {
  setup() {
    this.points = Array.from({ length: POINT_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 1.2 + Math.random() * 2.2,
    }));
    this.mouseX = -1;
    this.mouseY = -1;
  }

  bindPointer() {
    this.onMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / rect.width;
      this.mouseY = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', this.onMove);
  }

  unbindPointer() {
    if (this.onMove) window.removeEventListener('mousemove', this.onMove);
  }

  draw() {
    const { ctx, dpr, points } = this;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DISTANCE) {
          const alpha = (1 - dist / LINK_DISTANCE) * 0.22;
          ctx.strokeStyle = `rgba(42, 99, 212, ${alpha.toFixed(3)})`;
          ctx.lineWidth = dpr;
          ctx.beginPath();
          ctx.moveTo(points[i].x * w, points[i].y * h);
          ctx.lineTo(points[j].x * w, points[j].y * h);
          ctx.stroke();
        }
      }

      if (this.mouseX >= 0) {
        const reach = LINK_DISTANCE * 1.6;
        const dx = points[i].x - this.mouseX;
        const dy = points[i].y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < reach) {
          const alpha = (1 - dist / reach) * 0.35;
          ctx.strokeStyle = `rgba(42, 99, 212, ${alpha.toFixed(3)})`;
          ctx.lineWidth = dpr;
          ctx.beginPath();
          ctx.moveTo(points[i].x * w, points[i].y * h);
          ctx.lineTo(this.mouseX * w, this.mouseY * h);
          ctx.stroke();
        }
      }
    }

    for (const p of points) {
      ctx.fillStyle = 'rgba(42, 99, 212, 0.55)';
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r * dpr, 0, 6.2832);
      ctx.fill();
    }
  }
}
