import type { L, Lang } from '../i18n';

// ───────────────────────── Home intro ─────────────────────────
// The opening sentence on the home page. A plain string is text; an object is a phrase
// that gets "framed" and links to that project's page.
export type IntroPart = string | { text: string; project: string };

export const intro: Record<Lang, { hello: string; statement: IntroPart[]; after: string }> = {
  zh: {
    hello: '你好，我是 Pelican。',
    statement: [
      '我一个人做些小工具：',
      { text: '拍张小票', project: 'fernbudget' },
      '就记好账，在网页上',
      { text: '框一块', project: 'panetrans' },
      '就翻译，对着题目',
      { text: '拍一下', project: 'moti' },
      '就出答案。',
    ],
    after: '它们都在你自己的手机或电脑上跑，数据不往外传。',
  },
  en: {
    hello: 'Hi, I’m Pelican.',
    statement: [
      'I build small tools on my own: ',
      { text: 'snap a receipt', project: 'fernbudget' },
      ' and the expense is logged, ',
      { text: 'box a bit of a page', project: 'panetrans' },
      ' and it’s translated, ',
      { text: 'point at a question', project: 'moti' },
      ' and the answer pops up.',
    ],
    after: 'They all run on your own phone or computer — nothing gets sent out.',
  },
};

// ───────────────────────── Lately ─────────────────────────
// Short dated lines on the home page, newest first. `path` is route-relative
// ('work/x-block', 'notes/<slug>'). Leave the list empty to hide the section.
export const lately: { date: string; text: L; path?: string }[] = [
  {
    date: '2026-09',
    text: {
      zh: '把这个站从产品作品集改成了个人站',
      en: 'Turned this site from a product portfolio into a personal site',
    },
    path: 'notes/rebuilt-this-site',
  },
  {
    date: '2026-09',
    text: {
      zh: 'X-Block-Bot 改成完全免费、默认纯本地运行，AI 变成可选',
      en: 'X-Block-Bot went fully free and local by default; the AI part is now optional',
    },
    path: 'work/x-block',
  },
];

// ───────────────────────── About ─────────────────────────
export const bio: L[] = [
  {
    zh: '我是 Pelican，一个人做产品的开发者。喜欢用 AI 做点真用得上的小东西，尤其是那种数据都留在你自己手机或电脑上、不往云上传的。',
    en: 'I’m Pelican, a developer who builds products on my own. I like making small AI tools people actually use — especially the kind where your data stays on your own phone or computer instead of going up to the cloud.',
  },
  {
    zh: '做得最多的是 iPhone App 和 Chrome 扩展：记账的 FernBudget 已经在 App Store 上架，翻译扩展 PaneTrans 和屏蔽垃圾号的 X-Block-Bot 在 Chrome 商店里能直接装。顺手也写些开源的小工具。',
    en: 'Mostly that means iPhone apps and Chrome extensions: FernBudget, an expense tracker, is on the App Store; PaneTrans, a translation extension, and X-Block-Bot, which blocks spam accounts, are on the Chrome Web Store. I write open-source tools along the way too.',
  },
  {
    zh: '这个站放我做过的东西，还有做的时候记下的笔记。',
    en: 'This site holds the things I’ve made, and the notes I take while making them.',
  },
];

// Experience / education, newest first. Empty = the section is hidden on the About page.
// Example: { period: '2024 — ', title: { zh: '独立开发', en: 'Independent developer' },
//            detail: { zh: '…', en: '…' } }
export const timeline: { period: string; title: L; detail?: L }[] = [];
