/* PaneTrans landing — animated demo of the region-translate flow.
 *
 * Self-contained state machine that drives the "see it work" panel in the
 * hero section. Renders inside `#demo-stage`. The animation loops every
 * ~17 seconds. No external assets. Respects prefers-reduced-motion.
 */
(function () {
  // ---- The chat scenes the popup will translate ----
  // Each scene is an array of { user, text } chat lines. The animation walks
  // through three scenes (initial, then two updates) to demonstrate that the
  // popup keeps watching as the underlying content changes.
  const SCENES = [
    // Scene 0 — initial chat content (frozen behind the rectangle on load)
    [
      { user: 'aki_2049',  text: 'Just landed in Tokyo, the weather is amazing.' },
      { user: 'mike',      text: 'Lucky! Send pics from Shibuya tonight.' },
      { user: 'sara_qa',   text: 'How long is your trip this time?' },
    ],
    // Scene 1 — chat moves on; popup must keep up
    [
      { user: 'aki_2049',  text: 'Two weeks. Mostly Tokyo and Kyoto.' },
      { user: 'mike',      text: 'Hit the Fushimi Inari shrine for me.' },
      { user: 'sara_qa',   text: 'Which neighborhood are you staying in?' },
    ],
    // Scene 2 — another change
    [
      { user: 'aki_2049',  text: 'Shimokitazawa — cheap and full of vintage shops.' },
      { user: 'mike',      text: 'Perfect for you. Have fun!' },
      { user: 'sara_qa',   text: 'Take notes, I want recommendations.' },
    ],
  ];

  // Per-line translations for each supported UI language. Keys 'l0..l8' map
  // to the chat lines in order: scene0[0], scene0[1], scene0[2], scene1[0]…
  // Falls back to English when a language isn't listed.
  const TRANS = {
    en: { l0:'Just landed in Tokyo, the weather is amazing.', l1:"Lucky! Send pics from Shibuya tonight.", l2:'How long is your trip this time?',
          l3:'Two weeks. Mostly Tokyo and Kyoto.', l4:'Hit the Fushimi Inari shrine for me.', l5:'Which neighborhood are you staying in?',
          l6:'Shimokitazawa — cheap and full of vintage shops.', l7:'Perfect for you. Have fun!', l8:'Take notes, I want recommendations.' },
    zh: { l0:'刚到东京，天气好得离谱。', l1:'真羡慕！晚上记得发涩谷的照片。', l2:'你这趟要待多久？',
          l3:'两周。主要在东京和京都。', l4:'帮我去伏见稻荷神社打个卡。', l5:'你住哪个街区？',
          l6:'下北泽 —— 便宜还遍地复古小店。', l7:'太适合你了。玩得开心！', l8:'好好做笔记，我等你推荐。' },
    'zh-TW': { l0:'剛到東京，天氣好得誇張。', l1:'真羨慕！晚上記得發澀谷的照片。', l2:'你這趟要待多久？',
          l3:'兩週。主要在東京和京都。', l4:'幫我去伏見稻荷神社打個卡。', l5:'你住哪一帶？',
          l6:'下北澤 —— 便宜還遍地復古小店。', l7:'太適合你了。玩得開心！', l8:'好好做筆記，我等你推薦。' },
    ja: { l0:'いま東京着、天気がやばいくらい良い。', l1:'いいなあ！夜、渋谷の写真送って。', l2:'今回はどれくらい滞在？',
          l3:'2 週間。主に東京と京都。', l4:'伏見稲荷、俺の代わりに行ってきて。', l5:'どのあたりに泊まってるの？',
          l6:'下北沢 —— 安いし古着屋だらけ。', l7:'まさにきみ向きじゃん。楽しんで！', l8:'メモして、おすすめ教えて。' },
    ko: { l0:'방금 도쿄 도착, 날씨가 미쳤다.', l1:'부럽다! 밤에 시부야 사진 좀 보내줘.', l2:'이번엔 얼마나 있을 거야?',
          l3:'2주. 주로 도쿄랑 교토.', l4:'후시미 이나리 신사 대신 다녀와줘.', l5:'어느 동네에 머무는 거야?',
          l6:'시모키타자와 — 싸고 빈티지 가게가 가득해.', l7:'딱 너 스타일이네. 잘 다녀와!', l8:'메모해놔, 나중에 추천받을게.' },
    es: { l0:'Acabo de aterrizar en Tokio, el clima está increíble.', l1:'¡Qué suerte! Mándame fotos de Shibuya esta noche.', l2:'¿Cuánto te quedas esta vez?',
          l3:'Dos semanas. Sobre todo Tokio y Kioto.', l4:'Visita el santuario Fushimi Inari por mí.', l5:'¿En qué barrio te alojas?',
          l6:'Shimokitazawa — barato y lleno de tiendas vintage.', l7:'Perfecto para ti. ¡Diviértete!', l8:'Toma notas, quiero recomendaciones.' },
    fr: { l0:"Je viens d'atterrir à Tokyo, le temps est magnifique.", l1:'Chanceux ! Envoie des photos de Shibuya ce soir.', l2:'Tu restes combien de temps cette fois ?',
          l3:'Deux semaines. Surtout Tokyo et Kyoto.', l4:'Passe au sanctuaire Fushimi Inari pour moi.', l5:'Tu loges dans quel quartier ?',
          l6:'Shimokitazawa — pas cher et plein de friperies.', l7:'Parfait pour toi. Amuse-toi bien !', l8:'Prends des notes, je veux des recos.' },
    de: { l0:'Gerade in Tokio gelandet, das Wetter ist der Wahnsinn.', l1:'Glück gehabt! Schick mir heute Abend Fotos aus Shibuya.', l2:'Wie lange bleibst du diesmal?',
          l3:'Zwei Wochen. Vor allem Tokio und Kyoto.', l4:'Geh für mich zum Fushimi-Inari-Schrein.', l5:'In welchem Viertel wohnst du?',
          l6:'Shimokitazawa — günstig und voller Vintage-Läden.', l7:'Perfekt für dich. Viel Spaß!', l8:'Mach Notizen, ich will Empfehlungen.' },
    pt: { l0:'Acabei de chegar em Tóquio, o tempo está incrível.', l1:'Que sorte! Manda fotos de Shibuya hoje à noite.', l2:'Quanto tempo vai ficar dessa vez?',
          l3:'Duas semanas. Principalmente Tóquio e Quioto.', l4:'Passa no santuário Fushimi Inari por mim.', l5:'Em que bairro está hospedado?',
          l6:'Shimokitazawa — barato e cheio de lojas vintage.', l7:'Perfeito pra você. Aproveita!', l8:'Anota tudo, quero recomendações.' },
    ru: { l0:'Только что приземлился в Токио, погода невероятная.', l1:'Везунчик! Скинь фоток из Сибуи вечером.', l2:'Надолго в этот раз?',
          l3:'На две недели. В основном Токио и Киото.', l4:'Сходи в храм Фусими Инари за меня.', l5:'В каком районе остановился?',
          l6:'Симокитадзава — дёшево и полно винтажных магазинов.', l7:'Идеально для тебя. Развлекайся!', l8:'Записывай, мне нужны рекомендации.' },
    it: { l0:'Appena atterrato a Tokyo, il tempo è pazzesco.', l1:'Beato te! Stasera mandami foto di Shibuya.', l2:'Quanto ti fermi stavolta?',
          l3:'Due settimane. Soprattutto Tokyo e Kyoto.', l4:'Passa al santuario Fushimi Inari per me.', l5:'In che quartiere alloggi?',
          l6:'Shimokitazawa — economico e pieno di negozi vintage.', l7:'Perfetto per te. Divertiti!', l8:'Prendi appunti, voglio dei consigli.' },
  };

  // ---- Animation timeline ----
  // Each step's `at` is the cumulative offset (ms) from the start of one loop.
  const TIMELINE_MS = 19000;
  // Timeline notes:
  //   * Chat changes lead popup updates by ~750 ms — this delay is the demo's
  //     whole point. The live dot pulses in that window so the user reads it
  //     as "the popup is catching up to the new content" rather than as lag.
  //   * Rectangle stays final / pulsing through the chat updates so it's
  //     clear the same region is being monitored across scene changes.
  const STEPS = [
    { at:     0, fn: reset },
    { at:   500, fn: cursorVisible },
    { at:  1400, fn: cursorToTarget },
    { at:  2500, fn: rightClickFlash },
    { at:  2800, fn: showContextMenu },
    { at:  4300, fn: hideContextMenuStartDrag },
    { at:  4500, fn: rectStartGrow },
    { at:  5500, fn: rectFinalize },
    { at:  5500, fn: cursorPark },
    { at:  6000, fn: popupAppear },
    { at:  6300, fn: renderPopup(0) },
    { at:  9000, fn: setChat(1) },
    { at:  9750, fn: renderPopup(1) },
    { at: 12500, fn: setChat(2) },
    { at: 13250, fn: renderPopup(2) },
    { at: 17500, fn: fadeOut },
  ];

  // ---- DOM refs (filled in init) ----
  let stage, cursor, ctx, rect, popup, popupBody, chatEl, liveDot;
  let currentScene = 0;
  let timers = [];

  function $(id) { return document.getElementById(id); }

  function pickLang() {
    const raw = (document.documentElement.lang || 'en');
    const lower = raw.toLowerCase();
    // Match common IETF subtags. Order matters: longer / region-specific
    // checks first so zh-TW / zh-HK / zh-MO don't collapse to simplified.
    if (lower === 'zh-tw' || lower === 'zh-hk' || lower === 'zh-mo') return 'zh-TW';
    // Then exact (case-insensitive) match against our dict keys.
    for (const k of Object.keys(TRANS)) {
      if (k.toLowerCase() === lower) return k;
    }
    // Fall back to language prefix (zh-CN → zh, pt-BR → pt, etc).
    const short = lower.split('-')[0];
    for (const k of Object.keys(TRANS)) {
      if (k.toLowerCase() === short) return k;
    }
    return 'en';
  }

  // ---- Step implementations ----
  function reset() {
    currentScene = 0;
    setChat(0)();
    if (cursor) cursor.className = 'demo-cursor';
    if (ctx)    ctx.className = 'demo-context';
    if (rect) {
      // Reset rectangle without animating back through the shrink — the
      // user is about to watch the next loop draw it fresh, so we want
      // the rect to disappear instantly on reset.
      rect.style.transition = 'none';
      rect.className = 'demo-rect';
      void rect.offsetWidth; // force reflow so the no-transition takes effect
      rect.style.transition = '';
    }
    if (popup)  popup.className = 'demo-popup';
    if (popupBody) popupBody.innerHTML = '';
  }
  function cursorVisible()   { if (cursor) cursor.classList.add('is-visible'); }
  function cursorToTarget()  { if (cursor) cursor.classList.add('is-on-target'); }
  function rightClickFlash() { if (cursor) cursor.classList.add('is-clicking'); }
  function showContextMenu() {
    if (cursor) cursor.classList.remove('is-clicking');
    if (ctx) ctx.classList.add('is-visible');
  }
  function hideContextMenuStartDrag() {
    if (ctx) ctx.classList.remove('is-visible');
    if (cursor) cursor.classList.add('is-dragging');
  }
  function rectStartGrow() { if (rect) rect.className = 'demo-rect is-growing'; }
  function rectFinalize() {
    // Single className assignment so the rect never momentarily holds just
    // `.demo-rect`. Two separate classList ops created a one-microtask gap
    // where transform: scale(0.05) re-applied and the running transition
    // immediately reversed direction — leaving the rect stuck at 5% size.
    if (rect) rect.className = 'demo-rect is-final';
  }
  function cursorPark() {
    if (cursor) {
      // Same atomic-className trick to avoid an in-between visual flicker.
      cursor.className = 'demo-cursor is-visible is-parked';
    }
  }
  function popupAppear() {
    if (popup) popup.classList.add('is-visible');
  }
  function setChat(idx) {
    return function () {
      currentScene = idx;
      if (!chatEl) return;
      const lines = SCENES[idx];
      // Cross-fade: render new lines with the "is-new" class then drop it on
      // next frame to trigger a fade-in.
      chatEl.innerHTML = lines.map((m, i) =>
        `<div class="demo-chat-line is-new" data-idx="${idx * 3 + i}">
           <span class="demo-chat-user">${m.user}</span>
           <span class="demo-chat-text">${m.text}</span>
         </div>`
      ).join('');
      // Flash the live dot whenever new chat content lands.
      if (liveDot && idx > 0) {
        liveDot.classList.remove('is-pulsing');
        // force reflow so the animation restarts
        void liveDot.offsetWidth;
        liveDot.classList.add('is-pulsing');
      }
      requestAnimationFrame(() => {
        chatEl.querySelectorAll('.is-new').forEach((el) => el.classList.remove('is-new'));
      });
    };
  }
  function renderPopup(idx) {
    return function () {
      if (!popupBody) return;
      const lang = pickLang();
      const transDict = TRANS[lang] || TRANS.en;
      const lines = SCENES[idx];
      // Build two bilingual pairs (skip the third chat line so the popup
      // stays compact and visually balanced).
      popupBody.innerHTML = lines.slice(0, 2).map((m, i) => {
        const tkey = `l${idx * 3 + i}`;
        const t = transDict[tkey] || TRANS.en[tkey] || '';
        return `<div class="demo-pair">
                  <div class="demo-pair-orig">${escapeHTML(m.text)}</div>
                  <div class="demo-pair-trans">${escapeHTML(t)}</div>
                </div>`;
      }).join('');
    };
  }
  function fadeOut() {
    if (popup)  popup.classList.remove('is-visible');
    if (rect)   { rect.classList.remove('is-final'); rect.classList.add('is-fading'); }
    if (cursor) cursor.classList.remove('is-visible', 'is-on-target', 'is-dragging', 'is-parked');
    if (chatEl) chatEl.style.opacity = '0.55';
    setTimeout(() => {
      if (rect) rect.classList.remove('is-fading');
      if (chatEl) chatEl.style.opacity = '';
    }, 600);
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  // ---- Loop driver ----
  function runLoop() {
    // Clear any pending timers from a prior loop or page hide.
    timers.forEach(clearTimeout);
    timers = STEPS.map((step) => setTimeout(step.fn, step.at));
    timers.push(setTimeout(runLoop, TIMELINE_MS));
  }

  function init() {
    stage     = $('demo-stage');
    if (!stage) return;
    cursor    = $('demo-cursor');
    ctx       = $('demo-context');
    rect      = $('demo-rect');
    popup     = $('demo-popup');
    popupBody = $('demo-popup-body');
    chatEl    = $('demo-chat');
    liveDot   = stage.querySelector('.demo-popup-dot');

    // Honour the user's accessibility preference.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      // Render the final-state frame statically: chat scene 0, popup visible
      // with bilingual pairs, no movement.
      reset();
      setChat(0)();
      rect.classList.add('is-final');
      popup.classList.add('is-visible');
      renderPopup(0)();
      cursor.classList.add('is-parked', 'is-visible');
      return;
    }

    // Pause only when the tab is hidden (background tab / minimized window).
    // We don't use IntersectionObserver here — earlier experience showed it
    // misbehaves under headless / backgrounded chrome where the first
    // intersection callback can fire before layout settles, leaving the loop
    // stuck. The animation is cheap (a handful of setTimeouts driving CSS
    // class swaps), so just let it run in the background while the tab is
    // active and the user can scroll into it at any time.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        timers.forEach(clearTimeout);
      } else {
        runLoop();
      }
    });

    // Re-translate the popup if the user changes language mid-animation.
    document.querySelectorAll('.lang-switcher [data-lang], .lang-switcher select').forEach((el) => {
      const evt = el.tagName === 'SELECT' ? 'change' : 'click';
      el.addEventListener(evt, () => {
        // Wait a frame so i18n.js has updated <html lang> first.
        requestAnimationFrame(() => renderPopup(currentScene)());
      });
    });

    runLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
