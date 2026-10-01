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
  // 2. Hero demo — draw rect ONCE, then cycle content inside it
  // -------------------------------------------------------------------------
  // Behaviour mirrors the real product: user drags a rectangle on the page,
  // and from that point on the popup re-translates whatever text appears
  // inside that rectangle. The rectangle itself doesn't move.
  //
  // Cycle:
  //   1. Cursor glides to top-left of the targeted region.
  //   2. Cursor drags to bottom-right; rectangle grows from 0 to full size.
  //   3. Cursor fades out (drag ended).
  //   4. Popup fades in with the first scene's translation.
  //   5. Forever loop: every ~2.8 s, fade the current target line + popup
  //      contents out, swap to the next scene's text, fade them back in.
  //   6. Every full pass through SCENES, reset and replay from step 1 so
  //      visitors who scroll back up see the gesture again.
  const demo = document.querySelector('.hero-demo');
  if (!demo) return;

  const cursor   = demo.querySelector('.demo-cursor');
  const rect     = demo.querySelector('.demo-rect');
  const popup    = demo.querySelector('.demo-popup');
  const popupSrc = demo.querySelector('.demo-popup-orig');
  const popupTgt = demo.querySelector('.demo-popup-trans');
  const target   = demo.querySelector('.demo-target');
  const targetLines = demo.querySelectorAll('.demo-target-line');
  if (!cursor || !rect || !popup || !target || !targetLines.length) return;

  const SCENES = [
    { orig: 'Künstliche Intelligenz revolutioniert die Übersetzung.', trans: 'AI is revolutionizing translation.' },
    { orig: '人工知能がブラウザ翻訳を変える時代が来た。',                   trans: 'AI is changing in-browser translation.' },
    { orig: 'Traducción local sin nube, en tu navegador.',           trans: 'Local translation, no cloud, in your browser.' },
    { orig: '번역이 로컬에서 실시간으로 작동합니다.',                          trans: 'Translation works locally, in real time.' },
  ];

  // Reduced motion: paint a static frame and bail.
  if (reduceMotion) {
    drawStatic();
    return;
  }

  let isVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0 }).observe(demo);
  }

  function targetBox() {
    const dr = demo.getBoundingClientRect();
    const tr = target.getBoundingClientRect();
    const PAD = 8;
    return {
      left: tr.left - dr.left - PAD,
      top:  tr.top  - dr.top  - PAD,
      width:  tr.width  + 2 * PAD,
      height: tr.height + 2 * PAD,
    };
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
    if (props.scale != null) popup.style.transform = `scale(${props.scale})`;
  }

  function showLine(idx) {
    targetLines.forEach((el, i) => {
      el.classList.toggle('is-active', i === idx);
    });
  }

  function setPopupText(scene) {
    popupSrc.textContent = scene.orig;
    popupTgt.textContent = scene.trans;
  }

  function drawStatic() {
    const b = targetBox();
    rect.style.transition = 'none';
    rect.style.left = b.left + 'px';
    rect.style.top = b.top + 'px';
    rect.style.width = b.width + 'px';
    rect.style.height = b.height + 'px';
    rect.style.opacity = '1';
    rect.classList.add('is-shown');
    setPopupText(SCENES[0]);
    showLine(0);
    popup.style.transition = 'none';
    popup.style.opacity = '1';
    popup.style.left = b.left + 'px';
    popup.style.top = (b.top + b.height + 14) + 'px';
    popup.classList.add('is-shown');
  }

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

  // Phase 1: cursor enters, drags rect, leaves. Popup pops in with scene 0.
  async function drawRectAndOpenPopup() {
    const b = targetBox();
    showLine(0);

    // Cursor approach
    setCursor(b.left - 4, b.top - 4, 750);
    cursor.classList.add('is-shown');
    await sleep(750);

    // Drag
    setRect({ left: b.left, top: b.top, width: 0, height: 0, opacity: 1 }, 0);
    rect.classList.add('is-shown');
    await sleep(20);
    setRect({ width: b.width, height: b.height }, 950);
    setCursor(b.left + b.width - 4, b.top + b.height - 4, 950);
    await sleep(950);

    // Cursor leaves (drag released)
    cursor.classList.remove('is-shown');
    await sleep(220);

    // Popup pops in with the first scene
    const popupLeft = b.left;
    const popupTop  = b.top + b.height + 14;
    setPopupText(SCENES[0]);
    setPopup({ left: popupLeft, top: popupTop, opacity: 0, scale: 0.92 }, 0);
    popup.classList.add('is-shown');
    await sleep(20);
    setPopup({ opacity: 1, scale: 1 }, 320);
    await sleep(320);
  }

  // Phase 2: cycle text inside the locked rectangle. Rect doesn't move; the
  // line under it changes. Popup re-translates with each swap.
  async function cycleScenes() {
    let idx = 0;
    // We've already shown scene 0; iterate from scene 1 forward.
    for (let i = 1; i < SCENES.length; i++) {
      await sleep(2400);
      idx = i;

      // Old line + popup contents fade
      target.classList.add('is-translating');
      popup.classList.add('is-translating');
      await sleep(260);

      // Swap content
      setPopupText(SCENES[idx]);
      showLine(idx);

      // Fade back in
      target.classList.remove('is-translating');
      popup.classList.remove('is-translating');
      await sleep(280);
    }
    await sleep(2400);
  }

  // Phase 3: tear down for the next loop.
  async function teardown() {
    setPopup({ opacity: 0, scale: 0.94 }, 360);
    setRect({ opacity: 0 }, 360);
    await sleep(360);
    rect.classList.remove('is-shown');
    popup.classList.remove('is-shown');
    targetLines.forEach((el) => el.classList.remove('is-active'));
    await sleep(500);
  }

  async function loop() {
    cursor.style.transform = `translate(${demo.clientWidth - 28}px, ${demo.clientHeight - 28}px)`;
    while (true) {
      await drawRectAndOpenPopup();
      await cycleScenes();
      await teardown();
    }
  }

  // Wait two frames for layout to settle (so getBoundingClientRect is correct).
  requestAnimationFrame(() => requestAnimationFrame(loop));
})();
