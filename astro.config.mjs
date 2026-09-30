// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// CI passes SITE_URL / SITE_BASE from GitHub Pages (see .github/workflows/deploy.yml):
// with the custom domain bound they resolve to https://julineshang.top and '',
// without it to the pelican0126.github.io/<repo> project URL.
const site = process.env.SITE_URL || 'https://julineshang.top';
const base = process.env.SITE_BASE || '/';
const withBase = (/** @type {string} */ path) => base.replace(/\/$/, '') + path;

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  redirects: {
    // FernBudget used to be called Pebble; keep the old links alive.
    '/work/pebble/': withBase('/work/fernbudget/'),
    '/en/work/pebble/': withBase('/en/work/fernbudget/'),
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'zh', locales: { zh: 'zh-CN', en: 'en' } },
    }),
  ],
});
