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
  const SUPPORTED = ['en', 'zh', 'ja'];
  const FALLBACK = 'en';
  const STORAGE_KEY = 'panetrans-lang';

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
    if (nav.startsWith('zh')) return 'zh';
    if (nav.startsWith('ja')) return 'ja';
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

    // Set <html lang="..."> for accessibility + SEO.
    const htmlLangAttr = lang === 'zh' ? 'zh-CN' : (lang === 'ja' ? 'ja-JP' : 'en');
    document.documentElement.lang = htmlLangAttr;

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

    // Reflect choice in the switcher buttons (visual active state).
    document.querySelectorAll('.lang-switcher [data-lang]').forEach((b) => {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function wireSwitcher() {
    document.querySelectorAll('.lang-switcher [data-lang]').forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        applyLang(b.getAttribute('data-lang'));
      });
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
