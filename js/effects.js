/**
 * PaneTrans landing — visual effects.
 *
 * Two pieces, both vanilla, both opt-in via DOM hooks so secondary pages
 * (legal, pricing) can share the same script harmlessly:
 *
 *   1. Particle field — mounts on #particles <canvas>. Floating dots
 *      with mouse-aware connecting lines. Caps at 60fps via rAF, sleeps
 *      when the canvas scrolls offscreen (IntersectionObserver), and
 *      respects prefers-reduced-motion.
 *
 *   2. Scroll reveal — any element with [data-reveal] starts hidden +
 *      translated, fades + slides into place when it enters the
 *      viewport. Stagger via [data-reveal-delay] (ms).
 *
 * Single concession to size: no minification, no bundler. ~5 KB raw.
 */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // 1. Scroll reveal — runs even with reduced motion (it just snaps in)
  // -------------------------------------------------------------------------
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-revealed'));
    } else {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
          if (delay > 0) {
            entry.target.style.transitionDelay = `${delay}ms`;
          }
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach((el) => io.observe(el));
    }
  }

  // -------------------------------------------------------------------------
  // 2. Particle field
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('particles');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // State
  let w = 0, h = 0;
  let particles = [];
  const mouse = { x: -1e6, y: -1e6, active: false };
  let running = true;
  let rafId = 0;

  const COLORS = {
    dot:  'rgba(78, 205, 196, 0.55)',   // teal
    line: 'rgba(78, 205, 196, 0.18)',
    glow: 'rgba(68, 176, 158, 0.95)',
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuild();
  }

  function rebuild() {
    // Density scales with area but caps so big screens don't get expensive.
    const target = Math.min(72, Math.max(24, Math.round((w * h) / 14000)));
    particles = [];
    for (let i = 0; i < target; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.1 + Math.random() * 1.7,
      });
    }
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    // Update + draw dots
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      // Wrap softly around edges
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Mouse repulsion within ~120 px
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 120) * 0.6;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
      // Damping so the field doesn't accumulate runaway momentum
      p.vx *= 0.985;
      p.vy *= 0.985;
      // Tiny baseline drift so things never freeze
      const driftMag = Math.hypot(p.vx, p.vy);
      if (driftMag < 0.05) {
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;
      }

      ctx.beginPath();
      ctx.fillStyle = COLORS.dot;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connecting lines for nearby pairs (O(n^2) but n is small)
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 1;
    const LIM = 110;
    const LIM2 = LIM * LIM;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LIM2) {
          const alpha = 1 - d2 / LIM2;
          ctx.globalAlpha = alpha * 0.55;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Glow trail on the cursor when active — gives the field a focal point
    if (mouse.active) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
      grad.addColorStop(0, 'rgba(78, 205, 196, 0.18)');
      grad.addColorStop(1, 'rgba(78, 205, 196, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(mouse.x - 90, mouse.y - 90, 180, 180);
    }

    rafId = requestAnimationFrame(step);
  }

  // Mount
  resize();
  step();

  // Listeners
  window.addEventListener('resize', () => { resize(); }, { passive: true });

  // Mouse events fire on the hero parent (canvas itself is pointer-events:
  // none so it doesn't block text selection / button clicks). We translate
  // event coords into canvas-local space.
  const heroEl = canvas.closest('.hero') || canvas.parentElement;
  if (heroEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }, { passive: true });

    heroEl.addEventListener('mouseleave', () => { mouse.active = false; });
  }

  // Sleep when offscreen — keeps idle scroll cheap.
  if ('IntersectionObserver' in window) {
    const sleeper = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting;
      if (visible && !running) {
        running = true;
        step();
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    }, { threshold: 0 });
    sleeper.observe(canvas);
  }
})();
