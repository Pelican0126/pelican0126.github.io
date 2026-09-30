import type { L } from '../i18n';

export type ProjectStatus = 'shipped' | 'live' | 'active' | 'paused';

export interface ProjectLink {
  label: L;
  href?: string; // external URL (App Store, Chrome Web Store…)
  path?: string; // page on this site, route-relative: 'work/moti/privacy'
}

export interface Project {
  slug: string;
  name: L;
  label?: L; // what it is, in two or three words
  tagline: L; // one-line value
  status: ProjectStatus;
  visibility: 'public' | 'private';
  stack: string[]; // public, non-sensitive tech chips only
  repo?: string; // ONLY ever set for PUBLIC repos
  links?: ProjectLink[];
  demo?: { type: 'video' | 'image'; src: string; poster?: string; portrait?: boolean }; // media in /public
  // A project with an intro gets its own page under /work/<slug>/.
  intro?: {
    summary: L; // marketing-level, NO private-repo content
    features: L[];
    note?: L;
  };
}

// ⚠️ Privacy red-line: no server IPs/domains, no API keys/tokens, no real bundle ids,
// no license/transaction internals, no internal business metrics.
// Private repos never get a `repo` link. Copy below is original product-level marketing.

export const projects: Project[] = [
  // ───────────────────────── Products (each has a page) ─────────────────────────
  {
    slug: 'panetrans',
    name: { zh: 'PaneTrans', en: 'PaneTrans' },
    label: { zh: '本地翻译', en: 'local translation' },
    tagline: {
      zh: '在网页上框一块就立刻翻译，而且翻译就在你浏览器里做，原文不外传',
      en: 'Box a bit of a page and it’s translated on the spot — and the translating happens right in your browser, nothing sent out',
    },
    status: 'live',
    visibility: 'private',
    stack: ['Chrome', 'WebGPU', 'OCR'],
    demo: { type: 'video', src: 'media/panetrans.mp4', poster: 'media/panetrans.jpg' },
    links: [
      {
        label: { zh: 'Chrome 商店', en: 'Chrome Web Store' },
        href: 'https://chromewebstore.google.com/detail/iienfgpjfginkjecmdfeakkfmlibfdcj',
      },
    ],
    intro: {
      summary: {
        zh: '一个 Chrome 扩展。你在网页上框出一块地方，旁边就弹出一个能拖的小窗，框里的字一变，译文跟着变——有点像给聊天框、弹幕、视频画面贴了条实时字幕。翻译是在你自己浏览器里跑的，免费档完全断网也能用，原文一个字都不往外传。',
        en: 'A Chrome extension. You box off a patch of a page and a little draggable window pops up next to it; when the text inside changes, the translation changes with it — a bit like sticking a live subtitle onto a chat box, a comment stream, or a video. The translating runs in your own browser, the free tier works fully offline, and not a word of the original is sent anywhere.',
      },
      features: [
        { zh: '框一块就实时翻译，里面的字一变译文跟着变', en: 'Box a region and it translates live, following the text as it changes' },
        { zh: 'YouTube 双语字幕', en: 'Bilingual YouTube subtitles' },
        { zh: '整页翻译，连画面里的字也能认', en: 'Whole-page translation, and it can read text baked into images too' },
        { zh: '翻译全在你浏览器里跑，不上传', en: 'All the translating happens in your browser — nothing uploaded' },
        { zh: '想要更准的翻译，也有云端档可选', en: 'Want sharper translations? There’s a cloud tier too' },
      ],
      note: {
        zh: '翻译在本地跑这点，是它最不容易被抄走的地方——在意隐私的人会喜欢，而大厂反而不太愿意这么做。',
        en: 'Doing the translating locally is the part that’s hardest to copy — people who care about privacy like it, and it’s exactly what the big players are reluctant to do.',
      },
    },
  },
  {
    slug: 'x-block',
    name: { zh: 'X-Block-Bot', en: 'X-Block-Bot' },
    label: { zh: '屏蔽垃圾号', en: 'block the spam' },
    tagline: {
      zh: '自动认出 X 上的机器人和垃圾号，帮你悄悄拉黑——免费，就在你浏览器里本地跑',
      en: 'Spots the bots and spam accounts on X and quietly blocks them for you — free, and it runs locally in your browser',
    },
    status: 'live',
    visibility: 'private',
    stack: ['Chrome', 'LLM'],
    demo: { type: 'video', src: 'media/x-block.mp4', poster: 'media/x-block.jpg', portrait: true },
    links: [
      {
        label: { zh: 'Chrome 商店', en: 'Chrome Web Store' },
        href: 'https://chromewebstore.google.com/detail/piclkcjckegmdggejmijcpebebdhneco',
      },
    ],
    intro: {
      summary: {
        zh: '一个 Chrome 扩展，帮你认出 X 上的机器人、垃圾号和诈骗号——时间线、回复、搜索、通知里都管。认出来后给它标个记号，或者直接悄悄拉黑；万一拉错了，也能一键放回来。装上就能用，本地规则不需要任何配置；想认得更全，可以接上你自己的 AI。',
        en: 'A Chrome extension that spots bots, spam and scam accounts on X — in the timeline, replies, search and notifications. It either tags them or quietly blocks them, and if it gets one wrong you can put it back with one click. It works as soon as it’s installed, on local rules that need no setup; plug in your own AI if you want it to catch more.',
      },
      features: [
        { zh: '装上即用：本地规则直接判，不用账号也不用 key', en: 'Works out of the box: local rules do the judging — no account, no key' },
        { zh: '时间线、回复、搜索、通知里都能悄悄批量拉黑', en: 'Quietly bulk-blocks across timeline, replies, search and notifications' },
        { zh: '拉错了一键解封，自动加进白名单', en: 'One-click unblock if it slips, and it remembers them next time' },
        { zh: '想更准就接你自己的 AI，key 只存在你电脑上，没有中间服务器', en: 'Want it sharper? Plug in your own AI — the key stays on your machine, no server in the middle' },
        { zh: '越用越准：常见的垃圾词会自动沉淀成本地规则', en: 'Gets better with use: recurring spam phrases turn into local rules on their own' },
      ],
      note: {
        zh: '完全免费。默认全在本地判定，数据不出浏览器。',
        en: 'Completely free. By default everything is judged locally and nothing leaves your browser.',
      },
    },
  },
  {
    slug: 'glm-rush',
    name: { zh: 'GLM 抢购助手', en: 'GLM Coding Rush' },
    tagline: {
      zh: '帮你盯着补货，一上架就秒下单，然后停在支付页等你来付',
      en: 'Watches for the restock, grabs it the second it’s back, then stops at checkout and waits for you to pay',
    },
    status: 'live',
    visibility: 'public',
    repo: 'https://github.com/Pelican0126/glm-coding-rush',
    stack: ['Chrome', 'JS'],
    demo: { type: 'image', src: 'media/glm.jpg', portrait: true },
    intro: {
      summary: {
        zh: '我自己用的一个 Chrome 扩展，也是个「让浏览器自动干活」的例子：它替你盯着某个东西有没有补货，一上架就飞快点进去、加进购物车，然后停在支付页让你自己来付（绝不自动付款）。想做类似的网页自动化，可以直接拿它当参考。',
        en: 'A Chrome extension I use myself, and also a nice little example of “let the browser do the boring part”: it keeps an eye out for a restock, and the instant something’s back it clicks in fast, adds it to the cart, then stops at the payment page so you pay yourself (it never auto-pays). A handy reference if you want similar browser automation.',
      },
      features: [
        { zh: '定时去看有没有补货', en: 'Checks for a restock on a schedule' },
        { zh: '一上架就秒级反应去抢', en: 'Reacts in well under a second the moment it’s back' },
        { zh: '自动加进购物车，停在支付页让你自己付', en: 'Adds to cart automatically, then stops at checkout for you' },
        { zh: '遇到验证码就停下来等你', en: 'Pauses and waits for you when a captcha shows up' },
        { zh: '纯浏览器里跑，没有服务器', en: 'Runs entirely in the browser, no server' },
      ],
      note: {
        zh: '代码是公开的，想做类似的浏览器自动化可以直接拿去参考。',
        en: 'The code is public — feel free to use it as a starting point for your own automation.',
      },
    },
  },
  {
    slug: 'moti',
    name: { zh: '易拍答', en: 'MoTi' },
    label: { zh: '拍照搜题', en: 'snap to answer' },
    tagline: {
      zh: '导入你的题库，对着题目拍一下就出答案，还能用手机本地 AI 给你讲解',
      en: 'Load your question bank, point the camera at a question, and the answer pops up — with on-phone AI to explain it',
    },
    status: 'active',
    visibility: 'private',
    stack: ['Swift', 'SwiftUI', 'OCR'],
    links: [
      { label: { zh: '隐私政策', en: 'Privacy' }, path: 'work/moti/privacy' },
      { label: { zh: '技术支持', en: 'Support' }, path: 'work/moti/support' },
    ],
    intro: {
      summary: {
        zh: '一个 iPhone 上的刷题 / 拍照搜题 App。先把你的题库（Excel/CSV）导进去，之后对着纸上的题拍一下，它认出字、在题库里找到对应那题、立刻给答案；付费版还能用手机本地的 AI 离线给你讲解。整个过程都在手机上跑，不用服务器、真机也不用联网。',
        en: 'An iPhone app for drilling questions and snapping a question to find its answer. Load your question bank (Excel/CSV) first; after that you point the camera at a printed question, it reads the text, finds the matching question in your bank, and shows the answer right away. The paid tier even uses on-phone AI to explain it, offline. The whole thing runs on the phone — no server, and a real device doesn’t need a connection.',
      },
      features: [
        { zh: '导入 Excel/CSV 题库，顺序、随机、错题随便练', en: 'Import an Excel/CSV bank; practice in order, shuffled, or just your misses' },
        { zh: '对着题目拍一下，自动认字并找到对应那题', en: 'Point at a question — it reads it and finds the match' },
        { zh: '付费版用手机本地 AI 离线给你讲解', en: 'Paid tier explains answers with on-phone AI, offline' },
        { zh: '错题本、收藏、答题统计', en: 'Mistake book, favorites, and stats' },
        { zh: '全在手机本地跑，没服务器，真机不用联网', en: 'All on-device — no server, no connection needed on a real phone' },
      ],
      note: {
        zh: '适合手里有纸质题库、想离线刷题备考的人。',
        en: 'Made for people who have a paper question bank and want to study offline.',
      },
    },
  },
  {
    slug: 'fernbudget',
    name: { zh: 'FernBudget', en: 'FernBudget' },
    label: { zh: '记账', en: 'expense tracker' },
    tagline: {
      zh: '拍张小票或截个账单图，自动认出金额、商家、分类，帮你记好账（已上架 App Store）',
      en: 'Snap a receipt or a bill screenshot and it logs the amount, merchant and category for you (on the App Store)',
    },
    status: 'shipped',
    visibility: 'private',
    stack: ['Swift', 'SwiftUI', 'OCR'],
    links: [{ label: { zh: 'App Store', en: 'App Store' }, href: 'https://apps.apple.com/app/id6770550959' }],
    demo: { type: 'video', src: 'media/pebble.mp4', poster: 'media/pebble.jpg', portrait: true },
    intro: {
      summary: {
        zh: '一个已经上架 App Store 的 iPhone 记账 App。你拍张纸质小票，或者截个支付宝、微信、PayPal、银行、电商的账单图，它就自动认出金额、商家、日期、分类，帮你记上；配合快捷指令能一键导入，灵动岛上还能看识别进度。用的是你自己的 AI key，key 只存在手机本地。',
        en: 'An iPhone bookkeeping app that’s already on the App Store. Photograph a paper receipt, or screenshot a bill from Alipay, WeChat, PayPal, a bank or a store, and it picks out the amount, merchant, date and category and logs it for you. A Shortcut lets you import in one tap, and you can watch progress on the Dynamic Island. It uses your own AI key, and that key only ever lives on the phone.',
      },
      features: [
        { zh: '拍张小票或截个图，AI 帮你认出来记上', en: 'Snap a receipt or a screenshot and the AI reads it and logs it' },
        { zh: '配合快捷指令一键导入，灵动岛上能看进度', en: 'One-tap import via Shortcuts, with progress on the Dynamic Island' },
        { zh: '用你自己的 AI key，花多少、隐私都你自己说了算', en: 'Your own AI key — you control the cost and the privacy' },
        { zh: '多账户多币种、预算、循环账单、能导入导出 CSV', en: 'Multiple accounts and currencies, budgets, recurring bills, CSV in and out' },
        { zh: '中、英、日、西四种语言', en: 'Chinese, English, Japanese and Spanish' },
      ],
      note: {
        zh: '已经在 App Store 上线，买断和订阅都能用了。',
        en: 'Live on the App Store, with both one-time purchase and subscription working.',
      },
    },
  },

  // ───────────────────────── Open source & small tools (list only) ─────────────────────────
  {
    slug: 'vision-mcp',
    name: { zh: 'vision-mcp', en: 'vision-mcp' },
    label: { zh: '给 agent 装眼睛', en: 'eyes for agents' },
    tagline: {
      zh: '给看不见图的 AI 编程助手装上眼睛——一个本地 MCP，让纯文本模型也能看懂截图、报错图和设计稿。',
      en: 'Eyes for coding agents that can’t see images — a local MCP so text-only models can read screenshots, errors and mockups.',
    },
    status: 'active',
    visibility: 'public',
    repo: 'https://github.com/Pelican0126/vision-mcp',
    stack: ['TypeScript', 'MCP'],
  },
  {
    slug: 'glyphscan',
    name: { zh: 'GlyphScan', en: 'GlyphScan' },
    tagline: {
      zh: '一个 Swift 库：拍一页中日韩文做文字识别后，从一堆糊掉的结果里挑出你正对着的那一条',
      en: 'A Swift library: after OCR-ing a page of Chinese/Japanese/Korean, it picks out the one line your camera is actually pointing at',
    },
    status: 'active',
    visibility: 'public',
    repo: 'https://github.com/Pelican0126/GlyphScan',
    stack: ['Swift', 'Swift Package'],
  },
  {
    slug: 'voiceinput',
    name: { zh: 'VoiceInput', en: 'VoiceInput' },
    label: { zh: '语音输入法', en: 'voice keyboard' },
    tagline: {
      zh: 'iOS 语音键盘：说一段话，转成文字、AI 顺一遍，直接填到光标处（用你自己的 key）',
      en: 'iOS voice keyboard: say something, it transcribes, an AI tidies it up, and it drops in at the cursor (your own key)',
    },
    status: 'active',
    visibility: 'private',
    stack: ['Swift', 'iOS'],
  },
  {
    slug: 'opencode-remote',
    name: { zh: 'OpenCode Remote', en: 'OpenCode Remote' },
    tagline: {
      zh: '一个 Telegram 机器人，让你用手机远程指挥电脑上的 opencode',
      en: 'A Telegram bot that lets you drive opencode on your computer from your phone',
    },
    status: 'shipped',
    visibility: 'public',
    repo: 'https://github.com/Pelican0126/opencode-remote',
    stack: ['Rust', 'Telegram'],
  },
  {
    slug: 'ai-worker',
    name: { zh: 'AI Worker 后端', en: 'AI Worker backend' },
    tagline: {
      zh: '我几个产品共用的一个后端：统一管登录、限流量、按用量算钱',
      en: 'A shared backend behind a few of my products: handles auth, rate limits and usage-based billing in one place',
    },
    status: 'active',
    visibility: 'private',
    stack: ['Python', 'FastAPI'],
  },
  {
    slug: 'moti-android',
    name: { zh: '易拍答 Android 版', en: 'MoTi for Android' },
    tagline: {
      zh: '易拍答的 Android 版（刷题 + 拍照搜题）',
      en: 'The Android version of MoTi (drill questions + snap to find the answer)',
    },
    status: 'paused',
    visibility: 'private',
    stack: ['Android'],
  },
];

/** Projects with their own page under /work/<slug>/. */
export const products = projects.filter((p) => p.intro);
export const moreProjects = projects.filter((p) => !p.intro);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
