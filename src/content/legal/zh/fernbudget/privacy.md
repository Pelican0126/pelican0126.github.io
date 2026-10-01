---
title: "FernBudget 隐私政策"
label: "隐私政策"
description: "FernBudget（原名 Spendlytics）隐私政策：账本只保存在你的设备上，没有账号，也没有我们的服务器。"
subtitle: "最后更新：2026-05-29 · App：Spendlytics(Bundle ID com.tongjunfang.pebble) · FernBudget 原名 Spendlytics，下文沿用原名"
---

<blockquote><p><strong>太长不看。</strong> Spendlytics 把你的账本保存在你自己的设备上,没有 Spendlytics 账号、也没有我们的服务器 —— 我们不接收、不存储、不同步你的记录。 唯一会让数据离开设备的情形,是<em>你</em>主动使用可选的「自带密钥」AI 小票识别, 它会把小票图片(或设备本地 OCR 文本)直接发送到<em>你自己配置</em>的第三方 AI 服务商。无分析、无广告、无追踪。</p></blockquote>

<h2>概述</h2>
<p>Spendlytics 是一款个人记账 App,设计上将你的财务数据保存在你自己的设备上。本 App <strong>没有 Spendlytics 账号、无需注册,也没有我们的服务器</strong> —— 我们不运营任何接收、存储或同步你记录的后端。以下描述与当前已发布版本中 App 的实际行为一致。</p>

<h2>保存在你设备上的数据</h2>
<p>你的全部账本数据 —— 交易、金额、商家、备注、分类、账户、周期记账规则 —— 都<strong>仅保存在你的设备本地</strong>,使用 Apple 的设备端 SwiftData / Core Data 存储。</p>
<ul>
  <li>我们<strong>不会</strong>把这些数据上传到任何由我们控制的服务器。</li>
  <li>本 App 发布版本<strong>默认关闭</strong>云同步(iCloud / CloudKit);App 不会把你的账本同步到设备之外。</li>
  <li>我们无法读取、访问或恢复你的账本数据。它保存在你的设备上(以及你自己的设备 / iCloud 备份中,这部分受 Apple 的政策约束,而非我们的政策)。</li>
</ul>

<h2>相机与相册</h2>
<p>App 可能会请求访问你的<strong>相机</strong>和<strong>相册</strong>。仅当你主动选择扫描或导入小票、用于可选的高级 AI 识别功能时才会用到。App 内的权限弹窗说明为:</p>
<ul>
  <li>相机:<em>"高级功能:拍摄小票以自动识别金额和商家。"</em></li>
  <li>相册:<em>"高级功能:从相册中选择小票以自动识别金额和商家。"</em></li>
</ul>
<p>图片仅用于提取账单字段(金额、商家、日期、分类、备注)。如果你不使用小票扫描功能,App 不需要也不会使用这些权限。</p>

<h2>高级 AI 小票识别(第三方处理)</h2>
<p>高级版"AI 识别"功能采用<strong>自带密钥(BYOK,Bring Your Own Key)</strong>模式:只有在<em>你</em>自行配置 AI 服务商并填入<em>你自己的</em> API 密钥后才能使用。本 App 不包含由我们提供的内置云端 AI 服务。</p>
<p>当你使用该功能时,App 会<strong>从你的设备直接将数据发送到你所配置的第三方 AI 服务商接口</strong> —— 而不是发给我们。根据 App 的识别模式:</p>
<ul>
  <li><strong>图片模式(默认):</strong> 把你选择的小票或截图<strong>图片</strong>发送到你配置的服务商。</li>
  <li><strong>OCR 文本模式(回退):</strong> 改为发送在<strong>你设备本地</strong>用 Apple Vision 框架从图片中识别出的文本,而不是图片本身。</li>
</ul>
<p>两种情况下,<strong>唯一用途</strong>都是提取结构化账单字段(金额、商家、日期、建议分类、可选备注,以及来源类型提示)。提取出的字段会返回到你的设备并保存到本地账本。</p>
<ul>
  <li>数据发往哪个服务商由<em>你</em>选择。内置的服务商预设包括 <strong>OpenAI、Anthropic、DeepSeek、Moonshot、Together</strong>,以及可填写自有接口地址的 <strong>Custom(自定义)</strong>选项。你所选服务商如何处理你发送的数据,受其自身的隐私政策和条款约束。</li>
  <li>所有 AI 请求均通过 <strong>HTTPS</strong> 发送;App 会拒绝向非 HTTPS 接口发送数据。</li>
  <li>你的 API 密钥保存在设备的<strong>钥匙串(Keychain)</strong>中,仅在请求的授权头里发送给你配置的服务商接口。App 未将该密钥配置为 iCloud 钥匙串同步。</li>
  <li>我们(开发者)不会在任何服务器上接收、代理、存储或记录这些图片、OCR 文本、API 密钥或提取出的字段。</li>
</ul>
<p>如果你从未启用或使用该功能,就不会有任何小票数据、图片或文本经由它离开你的设备。</p>

<h2>无追踪、无分析、无广告</h2>
<p>Spendlytics <strong>不包含任何第三方分析、广告、归因或崩溃上报 SDK</strong>(例如:没有 Firebase、Google Analytics、Sentry、Crashlytics、Amplitude、Mixpanel、AppsFlyer、Segment 等)。本 App <strong>不会</strong>跨其他 App 或网站追踪你,不会构建广告画像,也不展示广告。我们不会为追踪目的收集设备标识符。</p>

<h2>App 内诊断日志</h2>
<p>为排查小票导入流程的问题,App 可能会在<strong>你的设备上</strong>写入<strong>诊断日志</strong>(例如识别到的小票来源类型,如 "receipt" 或 "alipay")。这些日志保留在你的设备上,不会自动传输给我们。</p>

<h2>购买</h2>
<p>高级版通过 Apple 的 App 内购买出售。购买和订阅的处理由 <strong>Apple(StoreKit)</strong>完成,受 Apple 的隐私政策约束。我们不会收到你的支付信息。</p>

<h2>数据保留与删除</h2>
<p>由于你的账本数据仅保存在你的设备上:</p>
<ul>
  <li>只要你保留 App 安装(或直到你在 App 内删除单条记录),数据就会一直保留。</li>
  <li>你可以随时通过在 App 内删除记录、或删除 App 来清除数据;删除 App 会移除其在设备上本地保存的数据。</li>
  <li>你发送给第三方 AI 服务商的数据,按<strong>该服务商</strong>的政策保留和删除,而非我们的政策。</li>
</ul>

<h2>儿童隐私(分级 4+)</h2>
<p>Spendlytics 分级为 <strong>4+</strong>,不含不当内容。本 App 不会在知情的情况下收集儿童的个人信息,也不包含广告或跨 App 追踪。请注意:可选的高级 AI 功能需要由成年人提供第三方 API 密钥,并会将数据发送给第三方服务,不适合由儿童自行设置。</p>

<h2>政策变更</h2>
<p>若本政策发生变更,我们将更新上方的"最后更新"日期,并在相同位置发布修订版本。</p>

<h2>联系方式</h2>
<p>隐私相关问题,请联系 <a href="mailto:hi@julineshang.win">hi@julineshang.win</a>。Spendlytics 由该邮箱可联系到的开发者以个人项目形式运营。</p>

<p class="legal-meta" style="margin-top:2rem">© 2026 Spendlytics · <a href="/fernbudget/support/">Support</a></p>
