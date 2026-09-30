import type { L, Lang } from './index';

// Interface strings. Copy that belongs to a project, a service or the profile
// lives next to that data in src/data/.
const ui = {
  'nav.work': { zh: '作品', en: 'Work' },
  'nav.notes': { zh: '笔记', en: 'Notes' },
  'nav.about': { zh: '关于', en: 'About' },
  'nav.switchLang': { zh: 'Switch to English', en: '切换到中文' },
  'nav.theme': { zh: '切换深浅色', en: 'Switch light / dark' },

  'home.lately': { zh: '最近', en: 'Lately' },
  'home.work': { zh: '作品', en: 'Work' },
  'home.workAll': { zh: '全部作品 →', en: 'All work →' },
  'home.notes': { zh: '笔记', en: 'Notes' },
  'home.notesAll': { zh: '全部笔记 →', en: 'All notes →' },

  'work.title': { zh: '作品', en: 'Work' },
  'work.lead': {
    zh: '我做过的东西。前面几个写得细一点，点开能看介绍和演示。',
    en: 'Things I’ve made. The first few have their own page, with a write-up and a demo.',
  },
  'work.products': { zh: '产品', en: 'Products' },
  'work.more': { zh: '开源与小工具', en: 'Open source & small tools' },
  'work.back': { zh: '← 全部作品', en: '← All work' },
  'work.highlights': { zh: '亮点', en: 'Highlights' },
  'work.stack': { zh: '技术栈', en: 'Stack' },
  'work.openSource': { zh: '开源', en: 'Open source' },
  'work.private': { zh: '私有', en: 'Private' },
  'work.repoNote': { zh: '开源，可直接查看源码。', en: 'Open source — browse the code.' },
  'work.privateNote': { zh: '私有项目，仅展示介绍。', en: 'Private project — intro only.' },
  'work.details': { zh: '详情 →', en: 'Details →' },
  'work.repo': { zh: 'GitHub →', en: 'GitHub →' },
  'work.ctaLead': {
    zh: '有想法、想给产品加 AI、或者只想问问，都可以找我。',
    en: 'Got an idea, want AI in your product, or just curious? Reach out.',
  },
  'work.cta': { zh: '想做个类似的？聊聊 →', en: 'Want something like this? Let’s talk →' },

  'status.shipped': { zh: '已上架', en: 'Shipped' },
  'status.live': { zh: '已上线', en: 'Live' },
  'status.active': { zh: '开发中', en: 'In progress' },
  'status.paused': { zh: '暂停', en: 'Paused' },

  'notes.title': { zh: '笔记', en: 'Notes' },
  'notes.lead': { zh: '做东西的时候记下来的一些事。', en: 'Things I write down while building.' },
  'notes.empty': { zh: '还没有笔记。', en: 'No notes yet.' },
  'notes.back': { zh: '← 全部笔记', en: '← All notes' },

  'about.title': { zh: '关于', en: 'About' },
  'about.timeline': { zh: '经历', en: 'Timeline' },
  'about.services': { zh: '需要的话，也能帮你做', en: 'Need a hand? Here’s what I do' },
  'about.servicesLead': { zh: '大概按我擅长的程度排。', en: 'Roughly in order of what I’m best at.' },

  'contact.title': { zh: '联系', en: 'Contact' },
  'contact.lead': {
    zh: '想做个 App、给产品加点 AI、或者只是想聊聊，都可以写信给我。',
    en: 'Want an app built, some AI added to your product, or just to chat? Write to me.',
  },

  'footer.rss': { zh: 'RSS', en: 'RSS' },
  'footer.source': { zh: '本站源码', en: 'Source' },
} as const satisfies Record<string, L>;

export type UIKey = keyof typeof ui;

export function t(key: UIKey, lang: Lang): string {
  return ui[key][lang];
}
