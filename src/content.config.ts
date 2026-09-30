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

// Privacy / support pages that app stores link to. Served at /work/<project>/<doc>/ —
// those URLs are registered with the stores, so don't rename the files.
const legal = defineCollection({
  loader: glob({ pattern: '{zh,en}/*/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    subtitle: z.string(), // the line under the title: effective date, or what the app does
  }),
});

export const collections = { notes, legal };
