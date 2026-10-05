import type { L } from '../i18n';

export type ProjectStatus = 'shipped' | 'live' | 'active' | 'paused';

export interface ProjectLink {
  label: L;
  href: string; // external URL (App Store, Chrome Web Store…)
}

// URL rule: every product lives in exactly one top-level folder named after its slug.
//   /<slug>/          the product's home — either generated from `intro` below, or a
//                     hand-made site in public/<slug>/ (`ownSite`)
//   /<slug>/<doc>/    its privacy / support pages (src/content/legal/<lang>/<slug>/<doc>.md)
// /work/ is only the index. See src/lib/projects.ts for the checks that enforce this.
export interface Project {
  slug: string;
  name: L;
  label?: L; // what it is, in two or three words
  tagline: L; // one-line value
  status: ProjectStatus;
  visibility: 'public' | 'private';
  client?: boolean; // built for a client: own section on /work/, never on the home page
  stack: string[]; // public, non-sensitive tech chips only
  repo?: string; // ONLY ever set for PUBLIC repos
  // The product's own hand-made site sits in public/<slug>/ and is its home page.
  // It must handle both languages itself and accept ?lang=zh|en (links pass the reader's language).
  ownSite?: boolean;
  links?: ProjectLink[]; // shown on a generated home page
  demo?: { type: 'video' | 'image'; src: string; poster?: string; portrait?: boolean }; // media in /public
  // A generated home page at /<slug>/.
  intro?: {
    summary: L; // marketing-level, NO private-repo content
    features: L[];
    note?: L;
  };
}

// ⚠️ Privacy red-line: no server IPs/domains, no API keys/tokens, no real bundle ids,
// no license/transaction internals, no internal business metrics.
// Private repos never get a `repo` link. Copy below is original product-level marketing.
// Client work goes further: no client name, product name, brand, backend or business
// details, and demos only from my own pre-contract prototypes.

export const projects: Project[] = [
  // ───────────────────────── Products (each has a home at /<slug>/) ─────────────────────────
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
    // public/panetrans/ is synced from the extension repo (scripts/sync-site.sh there);
    // it carries its own translations and takes ?lang=zh|en.
    ownSite: true,
  },
  {
    slug: 'x-block',
    name: { zh: 'X 机器人拉黑助手', en: 'X Bot Blocker' },
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
        label: { zh: '免费添加到 Chrome', en: 'Add to Chrome — free' },
        href: 'https://chromewebstore.google.com/detail/piclkcjckegmdggejmijcpebebdhneco',
      },
    ],
    intro: {
      summary: {
        zh: '自动识别并静默屏蔽 X（Twitter）上的机器人、色情、引流、诈骗账号——时间线、回复、搜索、通知全界面覆盖，真人不误伤。本地规则秒判铁证，接上你自己的 AI 还能看懂黑话、自我进化。',
        en: 'Automatically spots and quietly blocks bot, porn, lead-farming and scam accounts on X (Twitter) — across the timeline, replies, search and notifications — without catching real people. Local rules settle the obvious cases instantly; plug in your own AI and it also reads coded spam and keeps learning.',
      },
      features: [
        {
          zh: 'AI 精准判定：看懂露骨与「编码 / 黑话」垃圾（约炮拉客、引流话术、币圈诈骗），正常吐槽的真人绝不误伤。',
          en: 'Sharp AI calls: it understands explicit and coded spam — hookup bait, lead-farming scripts, crypto scams — and leaves real people venting alone.',
        },
        {
          zh: '全界面覆盖：时间线、回复、搜索、通知、新粉丝——你刷到哪、收到谁，都自动判，看见即处理。',
          en: 'Everywhere you look: timeline, replies, search, notifications, new followers — whatever you scroll past or hear from gets checked and handled on sight.',
        },
        {
          zh: '静默秒拉：复用你已登录的会话，无弹窗、无感，几秒内成片消失。已拉黑的号一进帖子就隐藏。',
          en: 'Silent, instant blocks: it reuses your logged-in session, with no pop-ups — whole swathes disappear in seconds, and blocked accounts are hidden as soon as you open a thread.',
        },
        {
          zh: '越用越准：把 AI 反复拉黑里的高频垃圾词自动沉淀成本地秒拉规则——你刷得越多，它越快越省。',
          en: 'Gets better with use: spam phrases the AI keeps catching become instant local rules — the more you scroll, the faster and cheaper it gets.',
        },
        {
          zh: '隐私优先：默认全部在本地判定，数据不出浏览器；接 AI 时直连你自己的服务商，Key 仅存本地；没有作者服务器。',
          en: 'Privacy first: by default everything is judged locally and nothing leaves your browser; with AI on, it talks straight to your own provider and the key stays on your machine. There is no author server.',
        },
        {
          zh: '两种用法：装上即用，本地规则免配置；想要更全，填上你自己的 OpenAI 兼容 API（BYOK），AI 一起判。',
          en: 'Two ways to run it: install and go, with local rules and zero setup; or add your own OpenAI-compatible API (BYOK) and let the AI weigh in too.',
        },
      ],
      note: {
        zh: '完全免费 · 本地运行、无服务器 · 可选接入你自己的 AI',
        en: 'Completely free · runs locally, no server · your own AI is optional',
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
    demo: { type: 'image', src: 'media/glm-rush.jpg', portrait: true },
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
    status: 'shipped',
    visibility: 'private',
    stack: ['Swift', 'SwiftUI', 'OCR'],
    links: [{ label: { zh: 'App Store', en: 'App Store (China)' }, href: 'https://apps.apple.com/cn/app/id6780907669' }],
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
    demo: { type: 'video', src: 'media/fernbudget.mp4', poster: 'media/fernbudget.jpg', portrait: true },
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

  // ───────────────────────── Client work (each has a page) ─────────────────────────
  {
    slug: 'tennis-watch',
    name: { zh: 'Tennis Watch', en: 'Tennis Watch' },
    label: { zh: '手表网球计分', en: 'tennis on the wrist' },
    tagline: {
      zh: '给客户做的 Apple Watch 网球计分 App：打球时抬手点一下就记一分，手机负责登录，手表专心记分',
      en: 'An Apple Watch tennis-scoring app built for a client: tap your wrist to log a point mid-match — the iPhone handles sign-in, the watch just keeps score',
    },
    status: 'active',
    visibility: 'private',
    client: true,
    stack: ['Swift', 'SwiftUI', 'watchOS', 'HealthKit'],
    demo: { type: 'video', src: 'media/tennis-watch.mp4', poster: 'media/tennis-watch.jpg', portrait: true },
    intro: {
      summary: {
        zh: '帮一位客户做的 Apple Watch 网球计分 App，配一个 iPhone 伴侣 App。打球时抬手点一下就记一分，点错了一键撤回；赢下一分、一局、一盘、整场，手腕上的震动各不一样，不看屏幕也知道打到哪了。记分的同时还会开一次网球训练，心率和卡路里就显示在记分牌上，打完存进「健身」。登录只在 iPhone 上做一次，手表自动接上。',
        en: 'An Apple Watch tennis-scoring app with an iPhone companion, built for a client. Mid-match you tap once to log a point, and one more tap takes it back if you slipped. Winning a point, a game, a set or the match each feels different on your wrist, so you know where you stand without looking. Scoring also runs a tennis workout — heart rate and calories sit right on the scoreboard, and the session lands in Apple Fitness afterwards. You sign in once on the iPhone and the watch picks it up on its own.',
      },
      features: [
        { zh: '抬手点一下记一分，点错了一键撤回', en: 'One tap on the wrist per point, one tap to undo' },
        { zh: '分、局、盘、整场结束，各有各的震动', en: 'Point, game, set and match each have their own haptic' },
        { zh: '平分占先、抢七、决胜盘抢十，常见赛制都按规则算', en: 'Deuce and advantage, tiebreaks, match tiebreaks — the common formats, by the rules' },
        { zh: '边记分边记训练：实时心率、卡路里，打完存进「健身」', en: 'Logs a workout while you score: live heart rate and calories, saved to Apple Fitness' },
        { zh: 'iPhone 登录一次，手表自动接上，比分同步到后端', en: 'Sign in once on the iPhone; the watch picks it up and scores sync to the backend' },
      ],
      note: {
        zh: '页面上的演示是我接这个项目之前自己做的原型，不是客户的正式版。',
        en: 'The demo on this page is a prototype I built before taking on the project, not the client’s release build.',
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

/** Products: each has a home page at /<slug>/. The rest are listed on /work/ only. */
export const products = projects.filter((p) => (p.intro || p.ownSite) && !p.client);
export const clientWork = projects.filter((p) => p.client);
export const moreProjects = projects.filter((p) => !p.intro && !p.ownSite && !p.client);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
