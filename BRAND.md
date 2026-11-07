# 鱼心快跑 · 品牌与前端规范

> 用途：新建同品牌站点时，直接按本文件实现，不需要看旧代码。
> 技术栈固定为 VitePress + Vue 3 + 原生 CSS（无 UI 框架、无 CSS-in-JS）。
> 「必须」= 硬约束；「建议」= 允许偏离但要能说出理由。

---

## 1. 品牌与语气

| 项 | 规定 |
| --- | --- |
| 中文品牌名 | 鱼心快跑（站点名按主题命名，如「睡觉这件事」） |
| 英文品牌名 | Yuxin Runs |
| 口号 | 中文「鱼心快跑，Bug追不到」／英文「Yuxin Rush. Bugs Gone.」 |
| 吉祥物 | 正在奔跑的青色小鱼（`docs/public/running-fish.png`） |
| 人格 | 一个读过文献、但只肯说人话的同行者；不居高临下，不卖东西 |

**语气五条**（正文写作与所有 UI 文案都适用）

1. 开场必须是具体场景（时间点 + 动作 + 身体感觉），不写「随着社会发展」。
2. 小标题是判断句，不是名词（「八小时是区间，不是分数线」）。
3. 数字必须带口径：谁测的、多少人、自报还是实测、哪一年。
4. 幽默只能来自场景本身的荒诞，不能来自嘲笑读者。
5. 医疗段落零玩笑，且不出现诊断式表述与面向读者的剂量。

---

## 2. 配色（唯一真相源 = `--*` 变量）

禁止在组件里写死十六进制色值，一律用变量。下表左列为浅色，右列为 `html.dark` 覆盖值。

| Token | 浅色 | 深色 | 用途 |
| --- | --- | --- | --- |
| `--bg` | `#f6f4ee` | `#06100e` | 页面底色（米白 / 墨绿黑） |
| `--bg-soft` | `#eeeae0` | `#0a1815` | 侧栏、页面次级底 |
| `--bg-deep` | `#e7e2d6` | `#0d1e1a` | 分区底 |
| `--panel` | `#fffdf8` | `#0c1b18` | 卡片、弹窗、播放条 |
| `--panel-2` | `#f4f0e7` | `#10231e` | 卡片内嵌块、引用底 |
| `--panel-3` | `#ebe5d9` | `#152c26` | 第三层嵌套 |
| `--ink` | `#0e201c` | `#eaf4ef` | 主文字 |
| `--ink-2` | `#334a45` | `#b4c9c1` | 正文 |
| `--muted` | `#687a75` | `#80968f` | 说明、副标题 |
| `--faint` | `#93a19d` | `#5f746e` | 序号、时间戳 |
| `--line` | `rgba(14,32,28,.13)` | `rgba(234,243,238,.12)` | 常规分隔线 |
| `--line-strong` | `rgba(14,32,28,.28)` | `rgba(234,243,238,.26)` | 描边、虚线 |
| `--accent` | `#0a958a` | `#35d8c4` | 青绿主色：链接、强调、进度 |
| `--accent-bright` | `#0bb3a6` | `#5ce8d7` | hover / 高亮 |
| `--accent-ink` | `#042e2a` | `#032622` | 主色上的文字（深色） |
| `--accent-soft` | `rgba(10,149,138,.1)` | `rgba(53,216,196,.12)` | 主色浅底 |
| `--coral` | `#e85734` | `#ff7c5e` | 警示、对比、引用左边线 |
| `--coral-soft` | `rgba(232,87,52,.1)` | `rgba(255,124,94,.12)` | 警示浅底 |
| `--lime` | `#a9cc3f` | `#c4e35d` | 第三强调（正向、区分卡色） |
| `--blue` | `#3568d4` | `#7ba1ff` | 第四强调（中性、机制类） |
| `--blue-soft` | `rgba(53,104,212,.1)` | `rgba(123,161,255,.12)` | 蓝色浅底 |

**配色规则**

- 一屏内强调色不超过 2 种（`--accent` + 一个副色）；四种副色只用于卡片分类，不用于正文。
- 深色模式不是简单反色：深色下 `--accent` 提亮到 `#35d8c4`，`--coral` 提亮到 `#ff7c5e`，否则对比度不足。
- 正文对比度按 WCAG AA；`--faint` 只用于非关键信息（序号、时间）。

---

## 3. 字体与排版

| 项 | 规定 |
| --- | --- |
| 正文 | `--font-sans`：Manrope Variable → PingFang SC → Hiragino Sans GB → Microsoft YaHei → Noto Sans SC |
| 等宽 | `--font-mono`：JetBrains Mono Variable → SFMono → Consolas |
| H1 | `clamp(2rem, 4vw, 2.85rem)` / 760 / `-0.035em` |
| 正文 H2 | `clamp(1.42rem, 2.4vw, 1.78rem)` / 730，上间距 52px，顶部 1px 分隔线 |
| 版式 H2（`.mp-h2`） | `clamp(1.8rem, 3.4vw, 2.75rem)` / 750，`text-wrap: balance` |
| 正文 | 15–16px / 行高 1.75–1.8 |
| 引导段（`.mp-lead`） | 15px / 1.75 / `--muted` / 最大宽 680px |
| 眉标（`.mp-eyebrow`） | mono 10px，字距 `.16em`，大写，前置 18px 短横线 |
| 圆角 | `--radius-sm` 10px / `--radius` 18px / `--radius-lg` 28px |
| 容器宽 | `--container` 1180px |
| 动效 | `--ease: cubic-bezier(.2,.7,.2,1)`；时长 0.2–0.45s；`prefers-reduced-motion` 下全部关闭 |

- 数字、单位、序号、标签一律 mono；叙述性文字一律 sans。
- 中文正文两端对齐关闭、断行用默认；标题允许 `text-wrap: balance`。

### 3.1 动效与反馈（必须）

原则：所有动效走 `--ease` 曲线，只动 `transform / opacity / box-shadow / border-color / color`，不动画会引起重排的属性（width、top、margin）。时长 0.2–0.35s；`prefers-reduced-motion` 下全部关闭。

**Hover 反馈——每类可交互元素都必须有，且过渡要顺滑（位移 ≤ 4px，不许跳变）**

| 元素 | 反馈 |
| --- | --- |
| 卡片（`mp-card` / `mp-stat` / `mp-friend-card` / `mp-band-card`） | 上浮 3px + 描边提亮 + 投影浮现，三者同步过渡 |
| 按钮（`VPButton`、听书条按钮） | 上浮 2px；主按钮 hover 换 `--accent-bright` 底 |
| 图标（导航 logo、听书条图标） | 颜色过渡到 `--accent`；导航 logo 轻旋 -8° 并放大 8%，寓意「常驻在线」 |
| 图片（正文 `img`） | 上浮 2px + 1.008 缩放 + 投影，幅度小到「说不出但感觉得到」 |
| 链接 / 标签胶囊（`mp-tags span`） | 颜色 0.2s 过渡 |

**页面切换淡入淡出（必须）**

- 自定义 `Layout.vue`：`<Transition name="sa-page" mode="out-in">` 包住 DefaultTheme 的 `Layout`，`:key="page.relativePath"`。
- 淡出 0.13s（只做 opacity），淡入 0.22s（opacity + 8px 上移）；全程 ≤ 0.4s——快到不被打断，慢到能感到「换页了」。
- 锚点跳转不触发（key 不变）；首屏不触发（不加 `appear`）。

**Hero 大标题排版（必须）**

- `hero.name` 在 5 个词/词组以内时，桌面端（≥760px）必须 `white-space: nowrap` 不换行，字号同步收一档（`clamp(3.1rem, 6vw, 4.7rem)`）保证不溢出；窄屏放行换行并用 `text-wrap: balance` 匀称断行。
- `hero.text` 是副标题，**永远不许 `nowrap`**：字号收一档到 `clamp(1.32rem, 2.9vw, 2.05rem)`，宽 `max-width: 620px`，允许换行并 `text-wrap: balance`。写成 nowrap 会把标题顶到右侧配图底下（已踩过的坑）。
- 大标题与副标题（`hero.text`）之间间距 ≥ 26px（当前 `margin-top: 28px`）。
- 首屏是两栏栅格，不是绝对定位：`grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr)`（≥960px），`≤960px` 时文案 `order: 1`、配图 `order: 2` 上下排。**配图永远不许盖住文字。**

---

## 4. 布局

### 4.1 框骨架

```
Navbar（高 68px，毛玻璃，底色 --nav-bg；左上角 = 站点主题 logo + 站名）
├── 文章页：[左侧栏 目录] + [正文 max 760px] + [右侧本页目录]
├── 首页：Hero（左文案 / 右配图，两栏栅格）+ 8 段式营销区
└── 固定底部：听书条（--gs-bar-h，全局变量，Layout 用 padding-bottom 让位）；
    收起后只剩右下角一个耳机圆形按钮（--gs-bar-h 降到约 60px）
Footer（鱼心快跑品牌图 + 口号 + 版权）
```

- 断点：`1079px`（听书条换行、侧栏收起）、`960px`（首页首屏改上下排）、`760px`（卡片单列、正文留白收紧）、`640px`（按钮改为通栏）。
- 导航栏 logo **用站点主题图标**（`logo.svg` / `logo-dark.svg`，见「品牌资产」），hover 带轻旋反馈；深浅两版跟随主题切换。**导航栏不许放「鱼心快跑」品牌图。**
- 导航结构固定：4–6 个一级入口 + 「更多」下拉；下拉内按「工具 / 关于 / 姊妹站」分组。
- 一级导航顺序与侧栏分组顺序一致，不允许两处各排一套。

### 4.2 首页 8 段式（顺序不可乱）

1. Hero：`name`（品牌名）+ `text`（价值主张，一行）+ 3 个 action + 右侧配图（`HeroGraphLoop`：**讲本站内容的矢量示意图**，不是吉祥物、不是 AI 位图）+ 左上品牌胶囊。
2. 眉标 + H1 级判断句 + 引导段（`mp-lead`）。
3. 4 格数据条（`mp-stats`）——每格数字必须能在正文找到。
4. 「为什么不一样 / 三件事」+ 3 张链接卡（`mp-grid`）。
5. 做法区：`mp-steps` 4 步。
6. 一张 `mp-quote` 收束。
7. 姊妹站交叉推荐（`mp-friend-card`）。
8. 页脚。

### 4.3 文章页（每一章都必须满足）

| 结构 | 要求 |
| --- | --- |
| frontmatter | 只写 `title` + `description`（description 40–70 字，说清这页给什么） |
| 开头 | 150–250 字场景 + 「先给答案」的两三句 |
| 小标题 | 每 400–600 字一个 H2，且是判断句 |
| 可视化 | 每 400–600 字至少一个图形块；一级页 3–5 个 |
| 收尾 | `mp-quote` 一句 + 「接着读」3 张卡（同一 `mp-grid`） |

---

## 5. 版式原语（只用这些，不自造 class）

| 原语 | 用途 | 硬规则 |
| --- | --- | --- |
| `mp-wrap` / `mp-section` | 首页分区容器 | 段与段之间用 `mp-section` 的顶部分隔线 |
| `mp-eyebrow` | 分区眉标 | 10px mono，可加 `.coral` |
| `mp-h2` / `mp-lead` | 大标题 / 引导段 | 同段只用一次 |
| `mp-stats` / `mp-stat` | 3–4 格数字条 | 数字来自正文，禁止编新数 |
| `mp-grid` / `mp-card` / `mp-num` / `mp-go` | 卡片墙 | `tone-coral` / `tone-blue` / `tone-lime` 三选一，一屏最多 2 色 |
| `mp-steps` / `mp-step` / `b` | 有序步骤 | 3–4 步，序号 01 起 |
| `mp-split` | 左右对照 | 左边「常见误解」，右边「证据口径」 |
| `mp-band` / `mp-band-grid` / `mp-band-card` | 深色区块 + 2×2 | 每个卡片必须有 h3 |
| `mp-quote` | 收束引用 | 每页最多 1 个，左边线用 `--coral` |
| `::: tip / info / warning` | 提示块 | `warning` 用于医疗免责，措辞不许软化 |

**图表组件纪律**

1. 图表一律封装成 Vue 组件，命名大驼峰语义化（`TwoClocks`、`DebtBank`、`OsaGauge`），全局注册。
2. 图表根元素必须带 `data-listen="skip"`：听书时跳过图形，避免念坐标轴。
3. **图表结论必须写进 `<p class="gs-cap">`**，用完整句子把数字说一遍；只听不看的人靠这段。
4. 图内文字（SVG `<text>`、图例、`aria-label`、`sr-only` 描述）也是文案，必须进双语表。
5. 数据用 `const` 数组内嵌，不请求接口；纵轴无实测数据时必须标「机制示意，未配实测数值」。

---

## 6. 标准功能 A：听书（必须实现）

### 6.1 能力

- 引擎：浏览器 `SpeechSynthesis` + `MediaSession`。**无服务端、无音频文件、无账号。**
- 切块：按句切，单块上限 180 字；超长段落强切，否则浏览器会吞句。
- 连播范围三档：本页 / 本章 / 全书。范围与语速、音色、折叠状态一起持久化。
- 语速 0.75×–2×（6 档），改速从当前句重念，不跳段。
- 快捷键：`Alt+P` 播放/暂停，`Alt+←/→` 上一段/下一段。
- 锁屏：`MediaMetadata` 写标题/作者/专辑，系统播放器可续播。
- 保活：Chrome 约 15 秒会掐断长句，每 9 秒 `resume()` 一次。

### 6.2 折叠（必须，两级）

- 播放条默认展开，占整条底边；右上角「收起」按钮（`gs-l-icon`，下箭头）→ **全部收起**。
- 全部收起 = 整条消失，只在右下角留一个 52px 圆形按钮，图标是**耳机**（`gs-l-fab`）；点击即展开回整条。收起态不许再留标题、页码、进度、播放键等任何文字或控件。
- 只有"展开 / 全部收起"两态，不做半收起迷你条。
- 状态存 `localStorage['gs-listen-collapsed']`，跨页保持；收起/展开后重算 `--gs-bar-h`（`ResizeObserver` 测真实高度：展开约 164px，收起约 60px）。
- 收起不得停止朗读；正在朗读时圆形按钮右上角亮一个 `--coral` 呼吸小点。收起态下错误与提示文案隐藏，但不改变播放行为。

### 6.3 不支持时的降级（必须）

**原则：能念就安静地念，念不了就整条不出现。任何时候都不弹窗、不提示。**

| 条件 | 行为 |
| --- | --- |
| `!gsState.supported`（无 `speechSynthesis`） | **整条播放器不渲染**：页面上没有播放条，也没有耳机按钮，`--gs-bar-h` 归零；不弹窗、不 toast、不写 `sessionStorage` |
| 支持但 `voices.length === 0` | 播放条照常显示；按下播放后条内出现一行 `gs-l-error`，说明"这台设备没给浏览器语音包"，仍不弹窗 |
| 有语音但播放报错 | 条内 `gs-l-error` 内联提示 + 保留重试入口，不弹窗 |

- 判断必须放在 `mounted` 之后：SSR 阶段没有 `window.speechSynthesis`，直接用 `supported` 渲染会造成 hydration mismatch，所以模板写成 `v-if="mounted && gsState.supported"`。
- 不实现"三个可以试的办法"弹窗：没有 `ListenDialog.vue`、没有遮罩、没有 `sessionStorage['gs-listen-notified']`、没有焦点管理。


---

## 7. 标准功能 B：双语镜像（必须）

- 中文在根路径，英文在 `/en/`，**逐页镜像**：`docs/x/y.md` ↔ `docs/en/x/y.md`，两边 md 数量必须相等。
- 两份阅读顺序（`reading-order.ts` / `reading-order.en.ts`）独立维护，条目数与顺序必须一致；侧栏、连播队列、`第 N/共 M 页` 都由它生成。
- 语言判断一律用**前缀匹配**：`lang.value.startsWith('en')`。VitePress 的 locale 键名是 `en`，但 `useData().lang` 返回 `en-US`，写成 `=== 'en'` 不报错也永不命中。
- 组件不拆分：一个组件 + 一份 `computed` 文案表（`T`），EN/ZH 字段名必须完全一致。
- 翻译纪律：数字、样本量、置信区间、口径、证据等级原样搬运；版式原语与 `::: warning` 一个不少；中文机构名保留原名 + 英文解释；中文书名写「《中文名》(English title)」。
- **专业术语与固定名称不翻译**：架构与协议名（Router、Worker / Worker Pool、Watchdog、Trigger、Inline / Spill、Fast / Slow Path、Full-duplex、MCP、Harness）、产品与团队名（DeepSeek、GitHub、VitePress）、度量与符号（p50、p95、MIT）一律保留英文原文，不造中文译名。首次出现可在括号里给一句中文解释，之后全文只用原文。
- 本地存储按语言分栏（如 `gs-sleep-quiz-v1` / `gs-sleep-quiz-en-v1`），避免中文答案套到英文题上。

---

## 8. 标准功能 C：明暗主题

- `appearance: true`，跟随系统，右上角切换；不提供"跟随日出"等花活。
- 深色不是反色，按第 2 节覆盖 `--*` 变量；代码块在两种主题下都用深底（`--code-bg`）。
- `theme-color` meta 两套（浅 `#f6f4ee` / 深 `#06100e`）。

---

## 9. 站内禁止项（内容与界面）

**界面层**

1. 不挂代码仓库入口：不配 `socialLinks`、不配 `editLink`，正文不出现仓库地址、"去 GitHub 编辑/提 issue"字样。只保留「最后更新于」。
2. 不显示访问量、点赞、评论区、广告位、赞助商、商品链接与返佣。
3. 不做弹窗订阅、不做退出挽留、不做自动播放音视频。

**内容层**

4. 不给读者下诊断（写"这类模式值得去睡眠门诊评估"，不写"你有失眠症"）。
5. 不给面向读者的剂量、增减量、停药步骤；药物只写"须由医生评估"。
6. 不承诺治愈，不承诺见效天数；不写"还清睡眠债"。
7. 不制造恐慌：风险数据必须带样本与口径，不做"熬夜=猝死"式因果。
8. 不混淆四层口径（困扰/症状/诊断/达标）与三层测量（自报/可穿戴/多导睡眠监测）。

---

## 10. 部署（GitHub Pages 自动发布，必须）

- 仓库推到 `github.com/yuxinrun/<repo>`，push 到 `main` 即自动构建发布，访问地址 `https://yuxinrun.github.io/<repo>/`（不是 yuxinrun.github.com）。
- 工作流文件固定 `.github/workflows/deploy.yml`：`checkout → setup-node(20, cache: npm) → npm ci → npm run build → configure-pages → upload-pages-artifact(path: docs/.vitepress/dist) → deploy-pages`；`permissions` 给 `contents: read / pages: write / id-token: write`；`concurrency.group: pages`；保留 `workflow_dispatch` 便于手动重发。
- 仓库名路径部署：构建时注入 `BASE=/<repo>/`（workflow 里的 `env.BASE`），`config.mts` 用 `process.env.BASE ?? '/'` 接住。绑定自定义域名时把 workflow 的 `BASE` 改成 `/`。
- 仓库 Settings → Pages → Source 必须选 **GitHub Actions**，否则构建成功也不会发布。
- 站内链接一律相对路径或经 `withBase()`，禁止写死 `https://yuxinrun.github.io/<repo>/…`，换 base 就断。

---

## 11. 站点骨架

```
docs/
├── .vitepress/
│   ├── config.mts               # nav / locales / 搜索 / 页脚 / head
│   └── theme/
│       ├── index.ts             # 注册组件 + 三个 Layout 插槽
│       ├── style.css            # token + 版式原语 + 图表 + 听书条（单一真相源）
│       ├── reading-order.ts     # 章节顺序真值（侧栏 + 连播队列）
│       ├── reading-order.en.ts  # 英文版镜像顺序
│       ├── useSpeech.ts         # 语音引擎状态机
│       ├── extract.ts           # 从正文抽可朗读块
│       └── components/          # 22 个图表/交互件 + ListenBar + BrandMark
├── public/                      # logo.svg / logo-dark.svg / favicon.svg / sleep-fish.png
├── index.md                     # 首页
└── en/                          # 英文镜像
```

- `Layout` 插槽固定三处：`home-hero-image`（`HeroGraphLoop`）、`home-hero-info-before`（BrandMark）、`layout-bottom`（ListenBar）。
- `footer.message` 会被塞进 `<p class="message">`，**只能放行内元素**，放 `<div>` 会引发全站 hydration mismatch；品牌块用 `span` + flex。
- 依赖 `document` / `localStorage` / 正文 DOM 的组件必须 `mounted` 之后再渲染。

---

## 12. 品牌资产

| 资产 | 文件 | 规则 |
| --- | --- | --- |
| 导航栏 Logo（浅/深） | `public/logo.svg`、`public/logo-dark.svg` | **站点主题图标**（本站 = 执行环 + 检查点 + 心跳），单色、无字、26px 仍可读；母题按本站主题绘制，禁止跨站复用 |
| Favicon | `public/favicon.svg` | 与导航 logo 同形 |
| 品牌形象 | `public/yuxin-run.png` | 戴耳机奔跑的青色小鱼，透明底，546×363；**只出现在页脚品牌块与首屏品牌胶囊** |
| 姊妹站/空状态配图 | `public/<theme>-mascot.png` | 与本站主题相关的形象，可用于姊妹站卡与空状态 |
| 首屏配图 | `components/HeroGraphLoop.vue` | 手写 SVG：画本站内容（LLM → tool → state → checkpoint 的循环），跟随明暗主题、可动效、无位图 |

**Logo 与配图的分工（必须）**

- 导航栏 logo 不是通用商标，也不是品牌吉祥物：它取自该站的核心概念，换主题就重绘。母题定稿后，浅色版、深色版、favicon 三份同形，只换配色。
- 本站（Agent 这件事）母题 = **执行环 + 检查点 + 心跳**：虚线圆环代表 Agent 的循环，环上节点是状态图的一步，圆心里的心跳折线是 checkpointer 每步落盘。
- **导航栏不许用「鱼心快跑」品牌图**（`yuxin-run.png`）：那是品牌形象，属于页脚与品牌胶囊；导航栏要的是"这一站在讲什么"。
- 首屏右侧配图同样要讲内容：用一个能一眼看懂"这站在讲什么"的示意图（本站：LLM → tool → state → checkpoint 的循环图），**不使用吉祥物、不使用带水印的 AI 位图**。图内文字只允许不翻译的技术术语（`LLM`/`tool`/`state`/`checkpoint`）。
- 生成提示词模板（重绘导航 logo 时用）：`minimal flat vector logo, <母题描述>, single-weight strokes, teal #0a958a on transparent, readable at 26px, no text, no gradient, no drop shadow`；深色版主色换 `#35d8c4`，核心反白 `#eaf4ef`。
- 深浅两版都在 `themeConfig.logo` 里配置（`light` / `dark`），aria-label 写站点名，不写组件名。

---

## 13. 交付前自检

- [ ] `vitepress build` 通过，无死链
- [ ] push 到 `main` 后 GitHub Actions 构建成功，`https://yuxinrun.github.io/<repo>/` 可访问
- [ ] 导航栏 logo 与站点主题同母题，浅/深两版 + favicon 齐全
- [ ] 卡片 / 按钮 / 图标 / 图片 hover 有顺滑反馈，页面切换淡入淡出
- [ ] hero 大标题 ≤5 词时不换行，与副标题间距 ≥26px
- [ ] 每个图表有 `data-listen="skip"` + `gs-cap` 结论句
- [ ] 听书条能整条收起到一个耳机图标（右下角），点击可展开，`--gs-bar-h` 随之更新
- [ ] 浏览器不支持语音合成时整条播放器不出现、不弹窗、不占底部高度
- [ ] 中英 md 数量相等，两份 `reading-order` 条目数相等
- [ ] 英文页构建产物 `<main>` 内汉字数 = 0（术语白名单除外）
- [ ] 无 `socialLinks` / `editLink`，正文无仓库地址
- [ ] 深色模式下所有新增块用 `--*` 变量、对比度达标
- [ ] `prefers-reduced-motion` 下动效关闭
