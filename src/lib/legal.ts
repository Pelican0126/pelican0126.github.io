import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Doc = CollectionEntry<'legal'> & { lang: Lang; project: string; doc: string };

/** All privacy / support pages. Entry ids look like '<lang>/<project>/<doc>'. */
export async function getDocs(): Promise<Doc[]> {
  const entries = await getCollection('legal');
  return entries.map((e) => {
    const [lang, project, doc] = e.id.split('/') as [Lang, string, string];
    return { ...e, lang, project, doc };
  });
}

/** One project's pages in one language, in a stable order (privacy before support). */
export async function getProjectDocs(project: string, lang: Lang): Promise<Doc[]> {
  return (await getDocs())
    .filter((d) => d.project === project && d.lang === lang)
    .sort((a, b) => a.doc.localeCompare(b.doc));
}
