---
title: "X Bot Blocker Privacy Policy"
label: "Privacy"
description: "X Bot Blocker privacy policy: detection runs locally in your browser, there is no author server, and your own AI is optional."
subtitle: "Last updated: 2026-09-29"
---

<p>X Bot Blocker is a <strong>free</strong> extension that detects and blocks bot / spam / escort / scam accounts on X (Twitter). The author runs <strong>no servers</strong> for it: detection runs locally in your browser, optionally using your own AI provider (BYOK).</p>

<h2>Data processed</h2>

<p>To classify an account, the extension reads <strong>publicly visible</strong> account info on pages you view (display name, @handle, bio, avatar URL, follower counts) and the <strong>text</strong> of posts/replies, and classifies them locally with rules; only if you configure your own AI provider are they also sent to that provider for analysis. It does <strong>not</strong> read your DMs, passwords, browsing history, other sites, or your X login credentials.</p>

<h2>Where data is sent</h2>

<p>By default (no AI configured) nothing leaves your browser. If you configure your own OpenAI-compatible endpoint (BYOK), account info is sent directly from your browser to that endpoint with your API key as an auth token; data handling is governed by your provider. Nothing is ever sent to the author. We do <strong>not</strong> sell your data, use it for ads, or send it to any other third party. The extension has no paid features and collects no payment information.</p>

<h2>Local storage</h2>

<p>Settings, your API key, the block log, and learned spam keywords are stored only in your browser (<code>chrome.storage.local</code>) and never uploaded — the API key is sent only to the endpoint you configured, for authentication.</p>

<h2>Blocking</h2>

<p>Blocking reuses your already-logged-in X session to call X's own block API (equivalent to clicking "Block" yourself). Your X credentials are never sent to any external server. Blocks can be undone on X anytime.</p>

<h2>Contact</h2>

<p><a href="mailto:hi@julineshang.win">hi@julineshang.win</a></p>
