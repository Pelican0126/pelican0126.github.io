/* PaneTrans landing site — runtime i18n.
 *
 * Translatable strings live in `window.PANETRANS_I18N` (loaded from dict.js
 * before this script). Each element that should be translated carries one of:
 *
 *   data-i18n="key"           → set element.textContent = tr(key)
 *   data-i18n-html="key"      → set element.innerHTML = tr(key)
 *                               (used for fragments with inline <strong> /
 *                                <a> / <code> / <em> — see dict.js)
 *   data-i18n-attr="attr:key" → set element.setAttribute(attr, tr(key))
 *                               (used for <meta name=description>, alt text,
 *                                title attributes, ...)
 *
 * Lang resolution order:
 *   localStorage('panetrans-lang') > navigator.language prefix > 'en'
 *
 * The choice persists across pages because localStorage is shared per origin.
 * Switching language re-runs apply() with no page reload.
 */
(function () {
  const SUPPORTED = ['en', 'zh', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru', 'it'];
  const FALLBACK = 'en';
  const STORAGE_KEY = 'panetrans-lang';
  // Map navigator.language prefixes to our codes. Order matters — we check
  // longer prefixes first ('zh-tw' before 'zh') so Hong Kong / Taiwan users
  // land on traditional Chinese instead of simplified.
  const NAV_HINTS = [
    ['zh-tw', 'zh-TW'], ['zh-hk', 'zh-TW'], ['zh-mo', 'zh-TW'],
    ['zh',    'zh'],
    ['ja',    'ja'],
    ['ko',    'ko'],
    ['es',    'es'],
    ['fr',    'fr'],
    ['de',    'de'],
    ['pt',    'pt'],
    ['ru',    'ru'],
    ['it',    'it'],
  ];

  function detectInitialLang() {
    // URL `?lang=xx` wins — that's how the legal pages' "view English version"
    // link gets you back to en even when localStorage says zh / ja.
    try {
      const q = new URLSearchParams(window.location.search).get('lang');
      if (q && SUPPORTED.includes(q)) return q;
    } catch (_) {}
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (_) { /* private mode etc. */ }
    const nav = (navigator.language || '').toLowerCase();
    for (const [prefix, code] of NAV_HINTS) {
      if (nav.startsWith(prefix)) return code;
    }
    return FALLBACK;
  }

  function tr(key, lang) {
    const dict = (window.PANETRANS_I18N || {});
    const langDict = dict[lang] || {};
    if (langDict[key] !== undefined) return langDict[key];
    const fbDict = dict[FALLBACK] || {};
    return fbDict[key] !== undefined ? fbDict[key] : key;
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = FALLBACK;

    // Set <html lang="..."> for accessibility + SEO. Map our internal codes to
    // IETF subtags where the regional flavour matters.
    const HTML_LANG = {
      'en':    'en', 'zh':    'zh-CN', 'zh-TW': 'zh-TW', 'ja': 'ja-JP',
      'ko':    'ko', 'es':    'es',    'fr':    'fr',    'de': 'de',
      'pt':    'pt-BR', 'ru': 'ru',    'it':    'it',
    };
    document.documentElement.lang = HTML_LANG[lang] || lang;

    // Text-content translations.
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = tr(key, lang);
      // <title> uses textContent too, so this handles it without a branch.
      el.textContent = value;
    });

    // innerHTML translations — for snippets with inline markup.
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = tr(key, lang);
    });

    // Attribute translations: data-i18n-attr="attr:key" (comma-separated for
    // multiple, e.g. "alt:foo,title:bar").
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':');
        if (attr && key) el.setAttribute(attr.trim(), tr(key.trim(), lang));
      });
    });

    // Reflect choice in the switcher (both legacy button group and the new
    // `<select>` variant get updated so either UI works without code changes).
    document.querySelectorAll('.lang-switcher [data-lang]').forEach((b) => {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    document.querySelectorAll('.lang-switcher select').forEach((s) => {
      if (s.value !== lang) s.value = lang;
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function wireSwitcher() {
    // Legacy button variant.
    document.querySelectorAll('.lang-switcher [data-lang]').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        applyLang(b.getAttribute('data-lang'));
      });
    });
    // New `<select>` variant (used everywhere now — buttons supported only
    // for back-compat if anyone embeds the switcher in a custom widget).
    document.querySelectorAll('.lang-switcher select').forEach((s) => {
      s.addEventListener('change', () => applyLang(s.value));
    });
  }

  function init() {
    wireSwitcher();
    applyLang(detectInitialLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging — `window.PaneTransI18n.apply('ja')` swaps live.
  window.PaneTransI18n = { apply: applyLang, supported: SUPPORTED };
})();
