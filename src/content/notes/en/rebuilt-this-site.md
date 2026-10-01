---
title: I rebuilt this site
description: It went from a one-page product portfolio to a personal site — and every page I have now follows one URL rule, one folder per product.
date: 2026-09-30
---

This site used to be a one-page product portfolio on a server of my own, while the product pages and their policies lived somewhere else under URLs that followed no rule. Now it all sits under pelican0126.github.io.

## How the URLs work

- `/` is the home page: who I am.
- `/work/` lists everything I’ve made; `/notes/` holds notes; `/about/` is about me.
- `/<product>/` is a product’s one and only page — `/panetrans/`, `/fernbudget/`, `/moti/`.
- `/<product>/privacy/` and `/<product>/support/` are that product’s privacy policy and support page, right underneath it.
- The English version lives under `/en/`, with the same structure.

Old URLs still open and forward to the new place. The old `/spendlytics/privacy.html`, for example, now goes to FernBudget’s privacy policy.

## What else changed

- There are notes now — you’re reading one. You can subscribe by RSS.
- Work went from a wall of cards to a plain list.
- The source is public on GitHub; there’s a link in the footer.

## How it’s built

The site is written in Astro, builds to plain static pages, and is hosted on GitHub Pages. The headings are set in LXGW WenKai, and the font files are hosted with the site.

Every page has a Chinese and an English twin, and the switch in the top-right corner takes you between them; if your browser’s language differs from the page’s, a line at the top points you to the other version.

The only scripts on this site’s pages remember your light/dark choice and your language choice. There are no analytics, no tracking, and no requests to third parties.
