---
title: "FernBudget Privacy Policy"
label: "Privacy"
description: "Privacy policy for FernBudget (formerly Spendlytics): your ledger stays on your device — no account and no server of ours."
subtitle: "Last updated: 2026-05-29 · App: Spendlytics (Bundle ID com.tongjunfang.pebble) · FernBudget was formerly named Spendlytics; the text below uses the old name"
---

<blockquote><p><strong>TL;DR.</strong> Spendlytics keeps your ledger on your own device. There is no Spendlytics account and no Spendlytics server — we do not receive, store, or sync your records. The only time data leaves your device is when <em>you</em> use the optional, bring-your-own-key AI receipt recognition, which sends the receipt image (or on-device OCR text) directly to the third-party AI provider <em>you</em> configured. No analytics, no ads, no tracking.</p></blockquote>

<h2>Overview</h2>
<p>Spendlytics is a personal expense-tracking app. It is built to keep your financial data on your own device. There is <strong>no Spendlytics account, no sign-up, and no Spendlytics server</strong> — we do not operate a backend that receives, stores, or syncs your records. The descriptions below match how the app actually works in its current released version.</p>

<h2>Data stored on your device</h2>
<p>All of your ledger data — transactions, amounts, merchants, notes, categories, accounts, and recurring rules — is stored <strong>locally on your device only</strong>, using Apple's on-device SwiftData/Core Data storage.</p>
<ul>
  <li>We do <strong>not</strong> upload this data to any server we control.</li>
  <li>The app ships with cloud sync (iCloud/CloudKit) <strong>disabled</strong>; your ledger is not synced off the device by the app.</li>
  <li>We have no ability to read, access, or recover your ledger data. It lives on your device (and in your own device/iCloud backups, which are governed by Apple's policies, not ours).</li>
</ul>

<h2>Camera and photo library</h2>
<p>The app may request access to your <strong>camera</strong> and <strong>photo library</strong>. These are used only when you choose to scan or import a receipt for the optional premium AI recognition feature. The in-app permission prompts state:</p>
<ul>
  <li>Camera: <em>"Premium feature: capture a receipt to auto-detect amount and merchant."</em></li>
  <li>Photo Library: <em>"Premium feature: pick a receipt from your photo library to auto-detect amount and merchant."</em></li>
</ul>
<p>Images are used to extract bill fields (amount, merchant, date, category, note). If you do not use the receipt-scan feature, the app does not need or use these permissions.</p>

<h2>Premium AI receipt recognition (third-party processing)</h2>
<p>The premium "AI recognition" feature is <strong>bring-your-own-key (BYOK)</strong>: it works only after <em>you</em> configure an AI provider and enter <em>your own</em> API key. The app does not include a built-in cloud AI service of ours.</p>
<p>When you use this feature, the app sends data <strong>directly from your device to the third-party AI provider endpoint that you configured</strong> — not to us. Depending on the app's recognition mode:</p>
<ul>
  <li><strong>Image mode (default):</strong> the receipt or screenshot <strong>image</strong> you selected is sent to your configured provider.</li>
  <li><strong>OCR text mode (fallback):</strong> text extracted from the image <strong>on your device</strong> using Apple's Vision framework is sent instead of the image.</li>
</ul>
<p>In both cases the <strong>only purpose</strong> is to extract structured bill fields (amount, merchant, date, suggested category, an optional note, and a source-type hint). The extracted fields are returned to your device and saved to your local ledger.</p>
<ul>
  <li>The destination is whichever provider <em>you</em> select. Built-in provider presets include <strong>OpenAI, Anthropic, DeepSeek, Moonshot, and Together</strong>, plus a <strong>Custom</strong> option where you supply your own endpoint URL. Your chosen provider's own privacy policy and terms govern how they handle the data you send them.</li>
  <li>All AI requests are sent over <strong>HTTPS</strong>; the app refuses to send to a non-HTTPS endpoint.</li>
  <li>Your API key is stored in the device's <strong>Keychain</strong> and is sent only to the provider endpoint you configured, in the request's authorization header. The key is not configured for iCloud Keychain sync by the app.</li>
  <li>We (the developer) do not receive, proxy, store, or log the images, OCR text, API key, or extracted fields on any server.</li>
</ul>
<p>If you never enable or use this feature, no receipt data, image, or text leaves your device through it.</p>

<h2>No tracking, no analytics, no ads</h2>
<p>Spendlytics contains <strong>no third-party analytics, advertising, attribution, or crash-reporting SDKs</strong> (for example: no Firebase, Google Analytics, Sentry, Crashlytics, Amplitude, Mixpanel, AppsFlyer, Segment, or similar). The app does <strong>not</strong> track you across other apps or websites, does not build an advertising profile, and shows no ads. We do not collect a device identifier for tracking.</p>

<h2>In-app diagnostic logs</h2>
<p>For troubleshooting the receipt-import flow, the app may write <strong>diagnostic log lines on your device</strong> (for example, the detected receipt source type, such as "receipt" or "alipay"). These logs stay on your device and are not transmitted to us automatically.</p>

<h2>Purchases</h2>
<p>The premium tier is sold via Apple's In-App Purchase. Purchase and subscription processing is handled by <strong>Apple (StoreKit)</strong> under Apple's privacy policy. We do not receive your payment details.</p>

<h2>Data retention and deletion</h2>
<p>Because your ledger data is stored only on your device:</p>
<ul>
  <li>It is retained for as long as you keep the app installed (or until you delete individual records inside the app).</li>
  <li>You can delete it at any time by deleting records in the app or by deleting the app, which removes its locally stored data from the device.</li>
  <li>Data you sent to a third-party AI provider is retained and deleted according to <strong>that provider's</strong> policies, not ours.</li>
</ul>

<h2>Children's privacy (rated 4+)</h2>
<p>Spendlytics is rated <strong>4+</strong> and contains no objectionable content. The app does not knowingly collect personal information from children, and it does not include advertising or cross-app tracking. Note that the optional premium AI feature requires an adult to provide a third-party API key and sends data to a third-party service; it is not intended to be set up by children.</p>

<h2>Changes to this policy</h2>
<p>If this policy changes, we will update the "Last updated" date above and publish the revised version at the same location.</p>

<h2>Contact</h2>
<p>For privacy questions, contact <a href="mailto:hi@julineshang.win">hi@julineshang.win</a>. Spendlytics is operated as an individual project by the developer reachable at that address.</p>
