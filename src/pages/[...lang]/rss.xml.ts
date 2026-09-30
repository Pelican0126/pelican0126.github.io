import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { href, langPaths, type Lang } from '../../i18n';
import { siteMeta } from '../../data/site';
import { getNotes } from '../../lib/notes';

export const getStaticPaths = langPaths;

export async function GET(context: APIContext<{ lang: Lang }>) {
  const { lang } = context.props;
  const notes = await getNotes(lang);
  return rss({
    title: siteMeta.title[lang],
    description: siteMeta.description[lang],
    site: context.site!.origin + href('', lang),
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.date,
      link: href('notes/' + note.slug, lang),
    })),
  });
}
