// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

// CI passes SITE_URL / SITE_BASE from the GitHub Pages settings (see .github/workflows/deploy.yml);
// for this user site they are https://pelican0126.github.io and ''.
const site = process.env.SITE_URL || 'https://pelican0126.github.io';
const base = process.env.SITE_BASE || '/';
const withBase = (/** @type {string} */ path) => base.replace(/\/$/, '') + path;

// Old URLs that stores, payment providers or search engines may still hold, and where each
// one lives now under the one-folder-per-product rule.
const legacy = {
  // A stale copy of the PaneTrans site used to sit at the root; the real one is /panetrans/.
  '/pricing.html': '/panetrans/pricing.html',
  '/privacy.html': '/panetrans/privacy.html',
  '/refund.html': '/panetrans/refund.html',
  '/support.html': '/panetrans/support.html',
  '/terms.html': '/panetrans/terms.html',
  // FernBudget was called Spendlytics; its pages were English-first.
  '/spendlytics/': '/en/fernbudget/',
  '/spendlytics/privacy.html': '/en/fernbudget/privacy/',
  '/spendlytics/support.html': '/en/fernbudget/support/',
  // X Bot Blocker's hand-made page became a generated one; its policy was Chinese-first.
  '/x-block/privacy.html': '/x-block/privacy/',
};

/**
 * GitHub Pages can't send real redirects, so write a small forwarding page at each old path.
 * (Astro's own `redirects` would put '/privacy.html' at '/privacy.html/index.html'.)
 * @param {Record<string, string>} map
 * @returns {import('astro').AstroIntegration}
 */
function legacyRedirects(map) {
  return {
    name: 'legacy-redirects',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        for (const [from, rawTo] of Object.entries(map)) {
          const to = withBase(rawTo);
          const file = new URL('.' + (from.endsWith('/') ? from + 'index.html' : from), dir);
          if (existsSync(file)) throw new Error(`legacy redirect ${from} would overwrite a real page`);
          await mkdir(new URL('.', file), { recursive: true });
          await writeFile(
            file,
            `<!doctype html><meta charset="utf-8"><title>Moved</title><meta name="robots" content="noindex">` +
              `<link rel="canonical" href="${new URL(to, site)}"><meta http-equiv="refresh" content="0;url=${to}">` +
              `<p>This page moved to <a href="${to}">${to}</a>.</p>\n`,
          );
        }
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'zh', locales: { zh: 'zh-CN', en: 'en' } },
    }),
    legacyRedirects(legacy),
  ],
});
