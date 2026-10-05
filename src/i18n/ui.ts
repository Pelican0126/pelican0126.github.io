import type { L, Lang } from './index';

// Interface strings. Copy that belongs to a project, a service or the profile
// lives next to that data in src/data/.
const ui = {
  'nav.work': { zh: '作品', en: 'Work' },
  'nav.notes': { zh: '笔记', en: 'Notes' },
  'nav.about': { zh: '关于', en: 'About' },
  'nav.switchLang': { zh: 'Switch to English', en: '切换到中文' },
  'nav.theme': { zh: '切换深浅色', en: 'Switch light / dark' },
  'crumbs.label': { zh: '当前位置', en: 'You are here' },
  // The language hint speaks the reader's language — the other one from the page's.
  'hint.text': { zh: 'This site is also in English.', en: '本站也有中文版。' },
  'hint.link': { zh: 'Read it in English →', en: '切换到中文 →' },
  'hint.stay': { zh: 'Stay on the Chinese version', en: '继续看英文版' },

  'home.lately': { zh: '最近', en: 'Lately' },
  'home.work': { zh: '作品', en: 'Work' },
  'home.workAll': { zh: '全部作品 →', en: 'All work →' },
  'home.notes': { zh: '笔记', en: 'Notes' },
  'home.notesAll': { zh: '全部笔记 →', en: 'All notes →' },

  'work.title': { zh: '作品', en: 'Work' },
  'work.lead': {
    zh: '我做过的东西。每个产品都有自己的主页；开源的小工具直接连到 GitHub。',
    en: 'Things I’ve made. Each product has its own page; the open-source tools link straight to GitHub.',
  },
  'work.products': { zh: '产品', en: 'Products' },
  'work.more': { zh: '开源与小工具', en: 'Open source & small tools' },
  'work.highlights': { zh: '亮点', en: 'Highlights' },
  'work.stack': { zh: '技术栈', en: 'Stack' },
  'work.openSource': { zh: '开源', en: 'Open source' },
  'work.private': { zh: '私有', en: 'Private' },
  'work.client': { zh: '客户项目', en: 'Client work' },
  'work.openSourceNote': { zh: '开源，可直接查看源码。', en: 'Open source — browse the code.' },
  'work.privateNote': { zh: '私有项目，仅展示介绍。', en: 'Private project — intro only.' },
  'work.clientNote': {
    zh: '客户项目，代码和细节归客户所有，这里只做概要展示。',
    en: 'Client project — the code and details belong to the client; this is an overview only.',
  },
  'work.home': { zh: '产品主页 →', en: 'Product page →' },
  'work.repo': { zh: 'GitHub →', en: 'GitHub →' },
  'work.docs': { zh: '条款与支持', en: 'Policies & support' },
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
