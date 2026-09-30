import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Note = CollectionEntry<'notes'> & { slug: string };

/** Published notes in one language, newest first. Entry ids look like 'zh/<slug>'. */
export async function getNotes(lang: Lang): Promise<Note[]> {
  const entries = await getCollection('notes', (e) => e.id.startsWith(lang + '/') && !e.data.draft);
  return entries
    .map((e) => ({ ...e, slug: e.id.slice(lang.length + 1) }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
