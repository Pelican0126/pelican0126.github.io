import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Both collections keep one folder per language: <collection>/zh/<slug>.md, <collection>/en/<slug>.md.

const notes = defineCollection({
  loader: glob({ pattern: '{zh,en}/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// A product's privacy / support pages, served at /<project>/<doc>/. App stores link to
// these URLs, so don't rename the files once a store has them.
const legal = defineCollection({
  loader: glob({ pattern: '{zh,en}/*/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(), // full page title, e.g. '易拍答 隐私政策'
    label: z.string(), // short name used in links and breadcrumbs, e.g. '隐私政策'
    description: z.string(),
    subtitle: z.string(), // the line under the title: effective date, or what the app does
  }),
});

export const collections = { notes, legal };
