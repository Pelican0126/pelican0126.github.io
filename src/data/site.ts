import type { L } from '../i18n';

// This repo and the deployed site are both public. Nothing here (or anywhere in src/)
// may contain server addresses, keys, bundle ids, or internals of the private products.

export const site = {
  handle: 'Pelican0126',
  name: { zh: 'Pelican', en: 'Pelican' } satisfies L,
  email: 'hi@julineshang.win',
  github: 'https://github.com/Pelican0126',
  source: 'https://github.com/Pelican0126/personal-site',
  // Other profiles shown next to email + GitHub. Add { label, href } entries to show them.
  links: [] as { label: L; href: string }[],
} as const;

export const siteMeta: { title: L; description: L } = {
  title: {
    zh: 'Pelican0126 · 一个人做的小工具和笔记',
    en: 'Pelican0126 · small tools and notes, made by one person',
  },
  description: {
    zh: 'Pelican 的个人站：一个人做的 iPhone App、Chrome 扩展和开源小工具，大多在你自己的设备上跑、数据不往外传；还有做东西时记下的笔记。',
    en: 'Pelican’s personal site: iPhone apps, Chrome extensions and open-source tools built by one person — most of them run on your own device and send nothing out — plus notes from building them.',
  },
};
