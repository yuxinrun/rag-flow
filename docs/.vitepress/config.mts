import { defineConfig } from 'vitepress'

const base = process.env.BASE ?? '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'RAG 这件事',
  description:
    '从切分、索引到召回、重排、生成与评测：一条能跑起来的 RAG 流水线，把每个环节讲透的中文教程。',
  base,
  outDir: process.env.OUT_DIR ?? './.vitepress/dist',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;750&family=JetBrains+Mono:wght@400;600&display=swap'
      }
    ],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#f6f4ee' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#06100e' }]
  ],
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg', alt: 'RAG 这件事' },
    nav: [
      { text: '认识 RAG', link: '/rag/what-is-rag' },
      {
        text: '六个环节',
        items: [
          { text: '切分 Chunking', link: '/rag/chunking' },
          { text: '索引 Indexing', link: '/rag/indexing' },
          { text: '召回 Retrieval', link: '/rag/retrieval' },
          { text: '重排 Rerank', link: '/rag/rerank' },
          { text: '生成 Generation', link: '/rag/generation' },
          { text: '评测 Evaluation', link: '/rag/evaluation' }
        ]
      },
      { text: '动手跑一遍', link: '/rag/runnable' },
      { text: '资源地图', link: '/rag/resources' }
    ],
    sidebar: {
      '/rag/': [
        {
          text: '认识 RAG',
          items: [{ text: 'RAG 是开卷考试，不是装外挂', link: '/rag/what-is-rag' }]
        },
        {
          text: '六个环节',
          items: [
            { text: '切分：切错一步，后面全歪', link: '/rag/chunking' },
            { text: '索引：召回阶段救不了索引阶段的错', link: '/rag/indexing' },
            { text: '召回：先求宽，再求准', link: '/rag/retrieval' },
            { text: '重排：最后一道质检', link: '/rag/rerank' },
            { text: '生成：上下文是预算，不是仓库', link: '/rag/generation' },
            { text: '评测：不评测的 RAG 是薛定谔的 RAG', link: '/rag/evaluation' }
          ]
        },
        {
          text: '动手与资源',
          items: [
            { text: '一条能跑起来的最小流水线', link: '/rag/runnable' },
            { text: '国内外 RAG 资源地图', link: '/rag/resources' }
          ]
        }
      ]
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切到浅色',
    darkModeSwitchTitle: '切到深色',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜一搜', buttonAriaLabel: '搜索本站' },
          modal: {
            noResultsText: '没搜到',
            resetButtonTitle: '清空',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    footer: {
      message: `<span class="brand-footer"><img class="brand-logo" src="${base}yuxin-run.png" alt="鱼心快跑 · 正在奔跑的青色小鱼" width="42" height="28" /><span class="brand-name">鱼心快跑</span><span class="brand-slogan">鱼心快跑，Bug 追不到 · Yuxin Rush. Bugs Gone.</span></span>`,
      copyright: '© 2026 Yuxin Runs · 内容仅供学习参考'
    }
  }
})
