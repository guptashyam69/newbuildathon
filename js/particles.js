/* ============================================================
   BUILDATHON — MATRIX / CODE RAIN PARTICLE SYSTEM
   ============================================================ */

class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?~`/\\BUILDATHONAI01';
    this.fontSize = 13;
    this.drops = [];
    this.running = true;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.cols = Math.floor(this.canvas.width / this.fontSize);
    this.drops = new Array(this.cols).fill(1).map(() => Math.random() * -100);
  }

  draw() {
    const ctx = this.ctx;
    // Fading trail
    ctx.fillStyle = 'rgba(3, 3, 8, 0.05)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Color gradient: bright head, fading trail
      const brightness = Math.random();
      if (brightness > 0.98) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f5ff';
      } else if (brightness > 0.9) {
        ctx.fillStyle = '#00f5ff';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00f5ff';
      } else if (brightness > 0.5) {
        ctx.fillStyle = 'rgba(0, 245, 255, 0.6)';
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      } else {
        ctx.fillStyle = 'rgba(123, 47, 247, 0.35)';
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }

      ctx.font = `${this.fontSize}px JetBrains Mono, monospace`;
      ctx.fillText(char, x, y);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i] += 0.5;
    }
  }

  animate() {
    if (!this.running) return;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  stop() { this.running = false; }
  start() { this.running = true; this.animate(); }
}

/* ── Floating Particles ─────────────────────────────────── */
class ParticleField {
  constructor(containerId, count = 60) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.particles = [];
    this.count = count;
    this.createParticles();
  }

  createParticles() {
    const colors = ['#00f5ff', '#7b2ff7', '#39ff14', '#ff2d78'];
    for (let i = 0; i < this.count; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = 5 + Math.random() * 15;

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        box-shadow: 0 0 ${size * 4}px ${color};
        animation: particle-float-${i} ${duration}s ${delay}s ease-in-out infinite;
        pointer-events: none;
        opacity: ${0.3 + Math.random() * 0.5};
      `;

      // Create keyframes dynamically
      const dx = (Math.random() - 0.5) * 80;
      const dy = (Math.random() - 0.5) * 80;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes particle-float-${i} {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(${dx * 0.5}px, ${dy * 0.5}px); }
          66% { transform: translate(${dx}px, ${dy}px); }
        }
      `;
      document.head.appendChild(style);
      this.container.appendChild(el);
      this.particles.push(el);
    }
  }
}

/* ── 3D Tilt Effect ─────────────────────────────────────── */
class TiltEffect {
  constructor(selector, options = {}) {
    this.elements = document.querySelectorAll(selector);
    this.options = {
      maxTilt: options.maxTilt || 10,
      scale: options.scale || 1.02,
      speed: options.speed || 400,
      glare: options.glare || true,
      ...options
    };
    this.init();
  }

  init() {
    this.elements.forEach(el => {
      if (this.options.glare) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.cssText = `
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%);
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
          z-index: 1;
        `;
        el.style.position = 'relative';
        el.appendChild(glare);
      }

      el.addEventListener('mousemove', (e) => this.handleMove(e, el));
      el.addEventListener('mouseleave', (e) => this.handleLeave(e, el));
      el.addEventListener('mouseenter', (e) => this.handleEnter(e, el));
    });
  }

  handleMove(e, el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const tiltX = -dy * this.options.maxTilt;
    const tiltY = dx * this.options.maxTilt;
    el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${this.options.scale})`;
    el.style.transition = 'transform 0.1s ease';

    const glare = el.querySelector('.tilt-glare');
    if (glare) {
      glare.style.opacity = '1';
      const glareX = (dx + 1) / 2 * 100;
      const glareY = (dy + 1) / 2 * 100;
      glare.style.background = `radial-gradient(ellipse at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, transparent 70%)`;
    }
  }

  handleLeave(e, el) {
    el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    el.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    const glare = el.querySelector('.tilt-glare');
    if (glare) glare.style.opacity = '0';
  }

  handleEnter(e, el) {
    el.style.transition = 'transform 0.05s ease';
  }
}

window.MatrixRain = MatrixRain;
window.ParticleField = ParticleField;
window.TiltEffect = TiltEffect;
