/**
 * PaneTrans landing — visual effects.
 *
 * Two pieces, both vanilla, both opt-in via DOM hooks so secondary pages
 * (legal, pricing) can share the same script harmlessly:
 *
 *   1. Particle field — mounts on #particles <canvas>. Dense glowing
 *      network with mouse-aware connecting lines, a comet trail tracking
 *      the cursor, and click-to-burst spawn. Caps at 60 fps via rAF,
 *      sleeps when offscreen, and respects prefers-reduced-motion.
 *
 *   2. Scroll reveal — any element with [data-reveal] starts hidden +
 *      translated, fades + slides into place when it enters the
 *      viewport. Stagger via [data-reveal-delay] (ms).
 *
 * Single concession to size: no minification, no bundler. ~7 KB raw.
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
  // 2. Particle field — demo-style: dense, glowing, click-to-burst
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('particles');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // State
  let w = 0, h = 0;
  let particles = [];
  let bursts   = [];          // short-lived radial burst particles spawned on click
  let trail    = [];          // cursor comet trail samples
  const mouse = { x: -1e6, y: -1e6, prevX: -1e6, prevY: -1e6, active: false };
  let running = true;
  let rafId = 0;

  // Visual tuning — bumped from the v1 "subtle" pass to a real demo feel.
  const TUNING = {
    densityDivisor: 6500,   // smaller → more particles per area
    densityCap: 180,
    connectDist: 140,
    glowBlur: 10,
    trailMax: 24,
  };

  const COLORS = {
    dot:    'rgba(120, 235, 220, 0.95)',
    dotDim: 'rgba(78, 205, 196, 0.55)',
    line:   '78, 205, 196',           // joined with alpha at draw time
    burst:  'rgba(180, 245, 235, 1)',
    glow:   '#7FE4D7',
  };

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuild();
  }

  function rebuild() {
    // Density scales with hero area but caps so big screens stay cheap.
    const target = Math.min(
      TUNING.densityCap,
      Math.max(50, Math.round((w * h) / TUNING.densityDivisor)),
    );
    particles = [];
    for (let i = 0; i < target; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        r: rand(1.0, 2.6),
        // pulse phase so particle radius shimmers slightly
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function spawnBurst(x, y, n = 28) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.1, 0.1);
      const speed = rand(2.4, 5.5);
      bursts.push({
        x, y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        r: rand(1.2, 2.8),
        life: 1,                 // 1 → 0 over ~1 s
      });
    }
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    // ---- Cursor comet trail -----------------------------------------------
    if (mouse.active) {
      trail.push({ x: mouse.x, y: mouse.y, life: 1 });
      if (trail.length > TUNING.trailMax) trail.shift();
    }
    for (let i = trail.length - 1; i >= 0; i--) {
      const t = trail[i];
      t.life -= 0.045;
      if (t.life <= 0) { trail.splice(i, 1); continue; }
      const r = (1 - t.life) * 26 + 4;
      const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
      grad.addColorStop(0, `rgba(127, 228, 215, ${0.32 * t.life})`);
      grad.addColorStop(1, 'rgba(127, 228, 215, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(t.x - r, t.y - r, r * 2, r * 2);
    }

    // ---- Update + draw connecting lines first (under the dots) ------------
    ctx.lineWidth = 1;
    const LIM2 = TUNING.connectDist * TUNING.connectDist;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      // physics
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < -10) a.x = w + 10;
      if (a.x > w + 10) a.x = -10;
      if (a.y < -10) a.y = h + 10;
      if (a.y > h + 10) a.y = -10;

      // mouse repulsion (stronger than v1)
      if (mouse.active) {
        const dx = a.x - mouse.x;
        const dy = a.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {                 // ~150 px reach
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / 150) * 1.15;
          a.vx += (dx / d) * f;
          a.vy += (dy / d) * f;
        }
      }
      a.vx *= 0.97;
      a.vy *= 0.97;
      const speed = Math.hypot(a.vx, a.vy);
      if (speed < 0.1) {                  // baseline jitter so nothing freezes
        a.vx += rand(-0.05, 0.05);
        a.vy += rand(-0.05, 0.05);
      }

      // draw lines from this particle to later ones (i<j)
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LIM2) {
          const t = 1 - d2 / LIM2;          // 0..1, 1 = closest
          ctx.strokeStyle = `rgba(${COLORS.line}, ${t * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // ---- Draw dots with glow on top --------------------------------------
    ctx.shadowBlur = TUNING.glowBlur;
    ctx.shadowColor = COLORS.glow;
    for (const p of particles) {
      p.phase += 0.04;
      const r = p.r + Math.sin(p.phase) * 0.35;
      ctx.beginPath();
      ctx.fillStyle = COLORS.dot;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // ---- Burst particles (decay quickly) ---------------------------------
    if (bursts.length) {
      ctx.shadowBlur = 14;
      ctx.shadowColor = COLORS.glow;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.93;
        b.vy *= 0.93;
        b.life -= 0.022;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(180, 245, 235, ${b.life})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    rafId = requestAnimationFrame(step);
  }

  // Mount
  resize();
  step();

  // ---- Listeners ---------------------------------------------------------
  window.addEventListener('resize', () => { resize(); }, { passive: true });

  // Mouse events fire on the hero parent because canvas is pointer-events:
  // none (so it doesn't block the buttons).
  const heroEl = canvas.closest('.hero') || canvas.parentElement;
  if (heroEl) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }, { passive: true });

    heroEl.addEventListener('mouseleave', () => { mouse.active = false; });

    // Click to burst — listen on the hero parent so the canvas stays
    // pointer-events: none. Translate the click to canvas-local coords.
    heroEl.addEventListener('click', (e) => {
      // Only burst on clicks that land on bare hero space, not on buttons
      // / links / images — those should stay clickable.
      const tag = e.target.tagName;
      if (tag === 'A' || tag === 'BUTTON' || tag === 'IMG' || e.target.closest('a, button')) return;
      const rect = canvas.getBoundingClientRect();
      spawnBurst(e.clientX - rect.left, e.clientY - rect.top);
    });

    // Touch — single tap = burst at tap point
    heroEl.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      spawnBurst(t.clientX - rect.left, t.clientY - rect.top, 18);
    }, { passive: true });
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
