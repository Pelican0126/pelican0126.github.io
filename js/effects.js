/**
 * PaneTrans landing — visual effects.
 *
 * Three pieces, all vanilla:
 *
 *   1. Cursor trail — site-wide. A fixed canvas overlay listens to
 *      document mousemove and emits small teal particles that drift +
 *      fade. Pointer-events: none so it never blocks clicks. Mounts on
 *      <canvas id="cursor-trail">, which the script inserts itself if
 *      the page didn't include it.
 *
 *   2. Hero demo — index page only. Fake-browser card animating the
 *      signature drag-to-translate gesture on a multilingual page.
 *      Pure DOM + CSS transitions, the JS is just a state machine.
 *
 *   3. Scroll reveal — any element with [data-reveal] starts hidden +
 *      translated, fades + slides into place when it enters the
 *      viewport. Stagger via [data-reveal-delay] (ms).
 *
 * All three respect prefers-reduced-motion.
 */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // 0. Site-wide cursor particle trail
  // -------------------------------------------------------------------------
  // Goal: subtle, ambient glow that follows the cursor on every page. Cheap
  // (max ~80 live particles), full-viewport, never blocks input. Sleeps when
  // the cursor is idle for 600 ms.
  if (!reduceMotion) {
    let canvas = document.getElementById('cursor-trail');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'cursor-trail';
      document.body.appendChild(canvas);
    }
    Object.assign(canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9999',
    });

    const tctx = canvas.getContext('2d', { alpha: true });
    const tdpr = Math.min(window.devicePixelRatio || 1, 2);
    let tw = 0, th = 0;
    const tparts = [];
    const TMAX = 80;
    let lastMoveAt = 0;
    let trafId = 0;
    let trailRunning = false;

    function tresize() {
      tw = window.innerWidth;
      th = window.innerHeight;
      canvas.width  = Math.floor(tw * tdpr);
      canvas.height = Math.floor(th * tdpr);
      tctx.setTransform(tdpr, 0, 0, tdpr, 0, 0);
    }
    tresize();
    window.addEventListener('resize', tresize, { passive: true });

    function emit(x, y) {
      // 1-2 particles per emit, small random offset, slight outward drift.
      const n = 1 + (Math.random() < 0.4 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        if (tparts.length >= TMAX) tparts.shift();
        const a = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.7;
        tparts.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 0.2,           // gentle upward bias
          life: 1,
          decay: 0.012 + Math.random() * 0.008,
          r: 1.4 + Math.random() * 1.6,
        });
      }
    }

    function tstep() {
      if (!trailRunning) return;
      tctx.clearRect(0, 0, tw, th);

      // Halt when nothing has happened for a while AND the field is empty.
      const now = performance.now();
      if (tparts.length === 0 && now - lastMoveAt > 600) {
        trailRunning = false;
        return;
      }

      tctx.shadowBlur = 8;
      tctx.shadowColor = '#7FE4D7';
      for (let i = tparts.length - 1; i >= 0; i--) {
        const p = tparts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= p.decay;
        if (p.life <= 0) { tparts.splice(i, 1); continue; }
        tctx.fillStyle = `rgba(127, 228, 215, ${p.life * 0.85})`;
        tctx.beginPath();
        tctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        tctx.fill();
      }
      tctx.shadowBlur = 0;

      trafId = requestAnimationFrame(tstep);
    }

    function startTrail() {
      if (trailRunning) return;
      trailRunning = true;
      trafId = requestAnimationFrame(tstep);
    }

    document.addEventListener('mousemove', (e) => {
      lastMoveAt = performance.now();
      emit(e.clientX, e.clientY);
      startTrail();
    }, { passive: true });

    // Hide the canvas when the tab is hidden — cheap idle.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trailRunning = false;
        cancelAnimationFrame(trafId);
        tparts.length = 0;
      }
    });
  }

  // -------------------------------------------------------------------------
  // 1. Scroll reveal
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
          if (delay > 0) entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach((el) => io.observe(el));
    }
  }

  // -------------------------------------------------------------------------
  // 2. Hero demo — drag-to-translate state machine
  // -------------------------------------------------------------------------
  const demo = document.querySelector('.hero-demo');
  if (!demo) return;

  const cursor   = demo.querySelector('.demo-cursor');
  const rect     = demo.querySelector('.demo-rect');
  const popup    = demo.querySelector('.demo-popup');
  const popupSrc = demo.querySelector('.demo-popup-orig');
  const popupTgt = demo.querySelector('.demo-popup-trans');
  const lines    = demo.querySelectorAll('.demo-line');
  if (!cursor || !rect || !popup || !lines.length) return;

  // Each scene = which line to highlight + the translation to show. The
  // `pad` shrinks the selection rectangle inside the line's bbox so it
  // looks like a deliberate drag, not a click that happens to cover the
  // whole line.
  const SCENES = [
    {
      lineIndex: 0,
      pad: { x: 4, y: 6 },
      orig: 'Künstliche Intelligenz',
      trans: 'Artificial intelligence',
    },
    {
      lineIndex: 1,
      pad: { x: 4, y: 6 },
      orig: '人工知能がブラウザ翻訳を変える',
      trans: 'AI is changing in-browser translation',
    },
    {
      lineIndex: 2,
      pad: { x: 4, y: 6 },
      orig: 'Traducción local sin nube',
      trans: 'Local translation, no cloud',
    },
  ];

  // Reduced motion: paint scene 0 statically and bail out.
  if (reduceMotion) {
    drawStatic(SCENES[0]);
    return;
  }

  // Time budget for one scene (ms). Sums to 5 200 + 800 inter-scene gap.
  const T = {
    cursorTo: 700,
    drag:     900,
    popupIn:  300,
    hold:     2400,
    fadeOut:  500,
    gap:      400,
  };

  let sceneIdx = 0;
  let isVisible = true;

  // Auto-pause when off screen so the loop doesn't burn CPU on scrolled-out hero.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0 }).observe(demo);
  }

  function lineRectFor(scene) {
    const line = lines[scene.lineIndex];
    const dr = demo.getBoundingClientRect();
    const lr = line.getBoundingClientRect();
    return {
      left: lr.left - dr.left + scene.pad.x,
      top:  lr.top  - dr.top  + scene.pad.y,
      width:  Math.max(40, lr.width  - 2 * scene.pad.x),
      height: Math.max(14, lr.height - 2 * scene.pad.y),
    };
  }

  function drawStatic(scene) {
    const r = lineRectFor(scene);
    rect.style.transition = 'none';
    rect.style.opacity = '1';
    rect.style.left   = r.left + 'px';
    rect.style.top    = r.top + 'px';
    rect.style.width  = r.width + 'px';
    rect.style.height = r.height + 'px';
    rect.classList.add('is-shown');
    popup.style.transition = 'none';
    popup.style.opacity = '1';
    popupSrc.textContent = scene.orig;
    popupTgt.textContent = scene.trans;
    popup.style.left = (r.left + r.width + 14) + 'px';
    popup.style.top  = Math.max(8, r.top - 6) + 'px';
    popup.classList.add('is-shown');
    cursor.style.transition = 'none';
    cursor.style.transform = `translate(${r.left + r.width - 4}px, ${r.top + r.height - 4}px)`;
    cursor.classList.add('is-shown');
    lines[scene.lineIndex].classList.add('is-targeted');
  }

  function setCursor(x, y, dur) {
    cursor.style.transition = `transform ${dur}ms cubic-bezier(0.4, 0.1, 0.2, 1)`;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }

  function setRect(props, dur) {
    rect.style.transition = dur === 0 ? 'none' :
      `left ${dur}ms ease-out, top ${dur}ms ease-out, width ${dur}ms ease-out, height ${dur}ms ease-out, opacity ${dur}ms ease-out`;
    if (props.left   != null) rect.style.left   = props.left + 'px';
    if (props.top    != null) rect.style.top    = props.top + 'px';
    if (props.width  != null) rect.style.width  = props.width + 'px';
    if (props.height != null) rect.style.height = props.height + 'px';
    if (props.opacity != null) rect.style.opacity = props.opacity;
  }

  function setPopup(props, dur) {
    popup.style.transition = dur === 0 ? 'none' :
      `opacity ${dur}ms ease, transform ${dur}ms cubic-bezier(0.2, 0.7, 0.2, 1)`;
    if (props.left != null) popup.style.left = props.left + 'px';
    if (props.top  != null) popup.style.top  = props.top + 'px';
    if (props.opacity != null) popup.style.opacity = props.opacity;
    if (props.scale   != null) popup.style.transform = `scale(${props.scale})`;
  }

  // Promise that resolves after `ms`, but yields if the demo is offscreen.
  function sleep(ms) {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = () => {
        if (!isVisible) { setTimeout(tick, 200); return; }
        const elapsed = performance.now() - start;
        if (elapsed >= ms) resolve();
        else setTimeout(tick, ms - elapsed);
      };
      tick();
    });
  }

  async function playScene(scene) {
    const r = lineRectFor(scene);
    const startX = r.left;
    const startY = r.top;
    const endX   = r.left + r.width;
    const endY   = r.top  + r.height;

    // 1. Cursor enters at top-left of selection.
    setCursor(startX - 4, startY - 4, T.cursorTo);
    cursor.classList.add('is-shown');
    lines[scene.lineIndex].classList.add('is-targeted');
    await sleep(T.cursorTo);

    // 2. Rect appears at start point with zero size, then drag.
    setRect({ left: startX, top: startY, width: 0, height: 0, opacity: 1 }, 0);
    rect.classList.add('is-shown');
    // Force a frame so the 0×0 rect commits before we transition.
    await sleep(20);
    setRect({ width: r.width, height: r.height }, T.drag);
    setCursor(endX - 4, endY - 4, T.drag);
    await sleep(T.drag);

    // 3. Popup emerges to the right of the rect (or below, if there's
    //    not enough horizontal room).
    const popupLeft = (r.left + r.width + 14 + 240 < demo.clientWidth)
      ? r.left + r.width + 14
      : Math.max(8, r.left);
    const popupTop = (r.left + r.width + 14 + 240 < demo.clientWidth)
      ? Math.max(8, r.top - 6)
      : r.top + r.height + 12;
    popupSrc.textContent = scene.orig;
    popupTgt.textContent = scene.trans;
    setPopup({ left: popupLeft, top: popupTop, opacity: 0, scale: 0.92 }, 0);
    popup.classList.add('is-shown');
    await sleep(20);
    setPopup({ opacity: 1, scale: 1 }, T.popupIn);
    await sleep(T.popupIn);

    // 4. Hold while the user "reads" it.
    await sleep(T.hold);

    // 5. Fade everything out together.
    setPopup({ opacity: 0, scale: 0.96 }, T.fadeOut);
    setRect({ opacity: 0 }, T.fadeOut);
    await sleep(T.fadeOut);
    rect.classList.remove('is-shown');
    popup.classList.remove('is-shown');
    lines[scene.lineIndex].classList.remove('is-targeted');

    // 6. Brief gap between scenes — cursor stays put.
    await sleep(T.gap);
  }

  async function loop() {
    // Initial cursor position: bottom-right of the demo, ready to glide in.
    cursor.style.transform = `translate(${demo.clientWidth - 28}px, ${demo.clientHeight - 28}px)`;
    cursor.classList.add('is-shown');
    while (true) {
      await playScene(SCENES[sceneIdx]);
      sceneIdx = (sceneIdx + 1) % SCENES.length;
    }
  }

  // Wait one frame for layout to settle (so getBoundingClientRect is correct).
  requestAnimationFrame(() => requestAnimationFrame(loop));

  // Recompute on resize — the in-flight scene will use stale coords for
  // the rest of its frame, but the next scene picks the new layout up.
  let resizeT = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { /* loop reads sizes per-scene */ }, 200);
  }, { passive: true });
})();
