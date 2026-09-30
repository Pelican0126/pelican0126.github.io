// Locale + base-path aware helpers.
// Every page lives once under src/pages/[...lang]/ and is rendered for each language:
// zh at the root, en under /en/. Build internal links with href() so they respect
// both the current language and the GitHub Pages base path.

export const LANGS = ['zh', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'zh';

/** A string in every language. */
export type L = Record<Lang, string>;

export const HTML_LANG: Record<Lang, string> = { zh: 'zh-CN', en: 'en' };

// BASE_URL is '/' or '/<repo>' (with or without a trailing slash) — normalize to one.
const BASE = import.meta.env.BASE_URL.replace(/\/*$/, '/');

/** The `lang` route param for a language: the default language has no prefix. */
export function langParam(lang: Lang): string | undefined {
  return lang === DEFAULT_LANG ? undefined : lang;
}

/** getStaticPaths for a page under src/pages/[...lang]/ that has no other params. */
export function langPaths() {
  return LANGS.map((lang) => ({ params: { lang: langParam(lang) }, props: { lang } }));
}

/** Localized, base-aware link. `path` is route-relative: '' (home), 'work/moti', 'rss.xml'. */
export function href(path: string, lang: Lang): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const joined = [langParam(lang), clean].filter(Boolean).join('/');
  if (!joined) return BASE;
  // Files (rss.xml) keep their name; pages get a trailing slash.
  return BASE + joined + (/\.[a-z0-9]+$/i.test(joined) ? '' : '/');
}

/** A file in /public, base-aware: asset('media/x.jpg'). */
export function asset(path: string): string {
  return BASE + path.replace(/^\/+/, '');
}

export function otherLang(lang: Lang): Lang {
  return lang === 'zh' ? 'en' : 'zh';
}

const DATE_LOCALE: Record<Lang, string> = { zh: 'zh-CN', en: 'en-US' };

/** '2026年9月30日' / 'September 30, 2026' */
export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(DATE_LOCALE[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** '2026-09-30' — for <time datetime> and the mono date column. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
