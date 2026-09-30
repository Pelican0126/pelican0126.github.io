# personal-site · 个人站

Pelican0126's personal site: who I am, the things I've made, and notes — in 中文 (`/`) and English (`/en/`).

Built with [Astro](https://astro.build) as plain static pages and hosted on GitHub Pages.
The only script on a page remembers the light/dark choice; fonts are self-hosted, so pages make no third-party requests.

- **Live:** https://julineshang.top (custom domain) · https://pelican0126.github.io/personal-site/ (before the domain is bound)

## Where things live

```text
src/
├── data/
│   ├── profile.ts     # home intro sentence, "lately" lines, bio, timeline
│   ├── projects.ts    # every project (zh + en); ones with `intro` get a page
│   ├── offers.ts      # services listed on the About page
│   └── site.ts        # handle, email, links, <title>/description
├── content/
│   ├── notes/{zh,en}/<slug>.md            # notes (blog posts)
│   └── legal/{zh,en}/<project>/<doc>.md   # privacy / support pages → /work/<project>/<doc>/
├── i18n/              # language helpers (href, asset…) + interface strings
├── components/        # Header, Intro (the framed home sentence), ProjectList, NoteList…
├── layouts/Base.astro
├── pages/[...lang]/   # each page once; rendered for zh (root) and en (/en/)
└── styles/global.css  # color/type tokens, the `.frame` viewfinder, prose
```

## Common edits

- **Write a note:** add `src/content/notes/zh/<slug>.md` with `title`, `description`, `date` in the
  frontmatter. Add `src/content/notes/en/<slug>.md` for the English version (optional — without it
  the language switch on that note goes to the notes list). `draft: true` hides a note.
- **Change the home sentence or the "lately" lines:** `src/data/profile.ts`.
- **Add a project:** append to `src/data/projects.ts`. Give it an `intro` to get a page at `/work/<slug>/`.
- **Add experience / education:** fill `timeline` in `src/data/profile.ts`; the section appears on
  the About page once it has entries.
- **Add a contact link:** `links` in `src/data/site.ts`.

## This repo is public

So is the site. Nothing in here may contain server addresses, API keys, bundle ids, or internals of
the private products. Private projects get marketing-level copy and **no repo link**; only public
repos set `repo` in `projects.ts`. App stores link to the pages under `/work/moti/` — don't rename them.

## Commands

| Command           | Action                                 |
| :---------------- | :------------------------------------- |
| `npm install`     | Install dependencies                   |
| `npm run dev`     | Dev server at `localhost:4321`         |
| `npm run check`   | Type-check `.astro` and `.ts` files    |
| `npm run build`   | Build to `./dist/`                     |
| `npm run preview` | Serve the production build locally     |

## Deploy

Every push to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml): type-check,
build, publish to GitHub Pages. The build reads the site URL and base path from the Pages settings,
so it works both under `pelican0126.github.io/personal-site/` and at the root of a custom domain.

### Binding julineshang.top

1. DNS (DNSPod): point the apex at GitHub Pages and `www` at the user domain.

   | Host  | Type  | Value                 |
   | :---- | :---- | :-------------------- |
   | `@`   | A     | `185.199.108.153`     |
   | `@`   | A     | `185.199.109.153`     |
   | `@`   | A     | `185.199.110.153`     |
   | `@`   | A     | `185.199.111.153`     |
   | `www` | CNAME | `pelican0126.github.io` |

2. Tell Pages about the domain, then rebuild so links drop the `/personal-site` prefix:

   ```bash
   gh api -X PUT repos/Pelican0126/personal-site/pages -f cname=julineshang.top
   gh workflow run deploy.yml -R Pelican0126/personal-site
   ```

3. Once GitHub has issued the certificate (minutes to an hour), turn on HTTPS-only:

   ```bash
   gh api -X PUT repos/Pelican0126/personal-site/pages -F https_enforced=true
   ```
