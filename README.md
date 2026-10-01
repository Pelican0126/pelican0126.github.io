# pelican0126.github.io

Pelican0126's personal site and the home of every product page — https://pelican0126.github.io

Built with [Astro](https://astro.build) as plain static pages, bilingual (中文 at `/`, English at `/en/`),
deployed to GitHub Pages by Actions. The site's own pages carry two tiny scripts — remember the
light/dark and language choice, and offer the other language when the browser prefers it; fonts are
self-hosted, so those pages make no third-party requests.

## URL rule

```text
/                         home — who I am
/work/  /notes/  /about/  site sections (/work/ is only the index of products and tools)
/<product>/               a product's one and only home page
/<product>/<doc>/         that product's privacy / support / … pages
/en/…                     the same structure in English
```

One product = one top-level folder named after its slug, and nothing about a product lives anywhere
else. A product's home is one of two kinds:

| Kind | Where it comes from | Products |
| :--- | :--- | :--- |
| Generated (zh + en) | `intro` in [src/data/projects.ts](src/data/projects.ts) + docs in `src/content/legal/<lang>/<slug>/` | `x-block`, `fernbudget`, `moti`, `glm-rush` |
| Hand-made site (`ownSite: true`) | static files in `public/<slug>/`, served as-is; must handle both languages itself and accept `?lang=zh\|en` | `panetrans` |

`src/lib/projects.ts` checks the rule at build time (reserved names, one home per product, hand-made
sites actually present) and fails the build if it's broken.

**Don't rename anything under a product folder** once a store has the URL — App Store, Chrome Web Store
and payment-provider listings point at these pages. Old URLs that moved are kept alive as redirects in
[astro.config.mjs](astro.config.mjs) (`/spendlytics/*`, `/x-block/privacy.html`, the stale PaneTrans copies that
used to sit at the root).

## Where things live

```text
public/
├── panetrans/         PaneTrans site — synced from the extension repo (scripts/sync-site.sh there),
│                      don't edit it here; it has its own 11-language switcher
├── media/<slug>.*     demo videos / images for generated product pages
└── google…html        Search Console verification — keep
src/
├── data/
│   ├── projects.ts    every project (zh + en) and the URL rule above
│   ├── profile.ts     home intro sentence, "lately" lines, bio, timeline
│   ├── offers.ts      services listed on the About page
│   └── site.ts        handle, email, links, <title>/description
├── content/
│   ├── notes/{zh,en}/<slug>.md              → /notes/<slug>/
│   └── legal/{zh,en}/<product>/<doc>.md     → /<product>/<doc>/
├── pages/[...lang]/   each page once; rendered for zh (root) and en (/en/)
├── lib/               projects (links + rule checks), notes, legal
├── components/        Header, Intro (the framed home sentence), ProjectList, Breadcrumbs…
└── styles/global.css  color/type tokens, the `.frame` viewfinder, prose
```

## Common edits

- **Write a note:** add `src/content/notes/zh/<slug>.md` with `title`, `description`, `date`. Add the
  same slug under `en/` for an English version (optional). `draft: true` hides a note.
- **Add a product:** append to `src/data/projects.ts` with either an `intro` (generated page) or
  `ownSite: true` plus `public/<slug>/index.html`. Its privacy/support pages go in
  `src/content/legal/<lang>/<slug>/<doc>.md` with `title`, `label`, `description`, `subtitle`.
- **Change the home sentence or the "lately" lines:** `src/data/profile.ts`.
- **Add experience / education:** fill `timeline` in `src/data/profile.ts`; the About page shows it once
  it has entries.

## This repo is public

So is the site. The personal-site copy must not contain server addresses, API keys, or internals of
the private products. Private projects get product-level copy and **no repo link**; only public repos
set `repo` in `projects.ts`. Product policy pages are published as written by the product.

## Commands

| Command           | Action                                 |
| :---------------- | :------------------------------------- |
| `npm install`     | Install dependencies                   |
| `npm run dev`     | Dev server at `localhost:4321`         |
| `npm run check`   | Type-check `.astro` and `.ts` files    |
| `npm run build`   | Build to `./dist/`                     |
| `npm run preview` | Serve the production build locally     |

Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml): type-check,
build, publish to GitHub Pages.

## Two languages

Every page of the site itself exists in 中文 (`/…`) and English (`/en/…`) with the same path; the
header switch goes to the same page in the other language (or to the nearest parent when a note or
policy has no translation). Generated product pages need both languages in `projects.ts`; notes and
policies are translated by adding the same file under the other language folder. Hand-made product
sites get `?lang=zh|en` from every link, so the reader stays in their language.
