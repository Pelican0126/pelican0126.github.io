import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { asset, href, type Lang } from '../i18n';
import { projects, type Project } from '../data/projects';

// Top-level paths the site itself uses — a product slug may not take one of them.
const RESERVED = ['work', 'notes', 'about', 'en', 'media', '_astro', 'rss.xml', 'spendlytics'];

// Enforce the URL rule from data/projects.ts at build time, so a broken structure fails
// the build instead of shipping a dead or duplicated product page.
for (const p of projects) {
  if (RESERVED.includes(p.slug)) throw new Error(`project "${p.slug}": slug is a reserved top-level path`);
  if (p.ownSite && p.intro) throw new Error(`project "${p.slug}": has both ownSite and intro — pick one home page`);
  if (p.ownSite && !existsSync(join(process.cwd(), 'public', p.slug, 'index.html'))) {
    throw new Error(`project "${p.slug}": ownSite is set but public/${p.slug}/index.html is missing`);
  }
  // An old sync script would drop files at the repo root, where they'd never be published.
  if (existsSync(join(process.cwd(), p.slug))) {
    throw new Error(`found ${p.slug}/ at the repo root — product sites belong in public/${p.slug}/`);
  }
}

/** Where a project's link goes, or undefined when it has nowhere public to go. */
export function projectLink(p: Project, lang: Lang): { href: string; external?: boolean } | undefined {
  if (p.ownSite) return { href: `${asset(p.slug + '/')}?lang=${lang}` }; // hand-made site picks the language from ?lang
  if (p.intro) return { href: href(p.slug, lang) };
  if (p.visibility === 'public' && p.repo) return { href: p.repo, external: true };
  return undefined;
}
