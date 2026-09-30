import type { L } from '../i18n';

export interface Offer {
  title: L;
  blurb: L;
}

// The freelance side — kept plain and human.
export const offers: Offer[] = [
  {
    title: { zh: '帮你把 App 做出来、上架', en: 'Get your app built and shipped' },
    blurb: {
      zh: '你有想法，或者已经有网页版，但卡在做 iPhone App、上架 App Store——这块交给我。',
      en: 'You’ve got an idea, or a web version already, but you’re stuck turning it into an iPhone app and getting it on the App Store — that part I can handle.',
    },
  },
  {
    title: { zh: '数据不上云的 AI', en: 'AI that doesn’t go to the cloud' },
    blurb: {
      zh: '让 AI 全程在用户自己设备上跑，数据不外传。适合法律、医疗、金融这种不方便往云上传的场景。',
      en: 'AI that runs entirely on the user’s own device, with nothing sent out. Good for legal, medical or finance work that can’t go to the cloud.',
    },
  },
  {
    title: { zh: '给你现有的产品加 AI', en: 'Add AI to what you already have' },
    blurb: {
      zh: '把 AI 能力稳稳接进你现有的产品里，做完代码都归你。',
      en: 'Wire AI into your existing product so it actually works — and the code is yours when we’re done.',
    },
  },
  {
    title: { zh: '两周给你一个能跑的原型', en: 'A working prototype in two weeks' },
    blurb: {
      zh: '固定价，两周内给你一个真能点、能用的原型，代码归你。适合想先快点验证想法的人。',
      en: 'Fixed price, a real clickable prototype in two weeks, code yours. For when you want to test an idea fast.',
    },
  },
  {
    title: { zh: '把重复的活儿自动化', en: 'Automate the repetitive stuff' },
    blurb: {
      zh: '帮你把每天重复做的事交给机器，后面也能长期帮你看着、维护。',
      en: 'Hand the daily repetitive work over to a machine — and I can keep it running for you afterwards.',
    },
  },
  {
    title: { zh: '做 Chrome 扩展', en: 'Build a Chrome extension' },
    blurb: {
      zh: '网页自动化、顺手的小工具、浏览器里的 AI——从想法到上架我都能弄。',
      en: 'Web automation, handy little tools, AI inside the browser — from idea to store listing.',
    },
  },
];
