// 阅读顺序真值：侧栏顺序、听书「全书」连播队列都由它生成。
export interface ReadItem {
  text: string
  link: string
  chapter: string
}

export const readingOrder: ReadItem[] = [
  { text: 'RAG 是开卷考试，不是装外挂', link: '/rag/what-is-rag', chapter: '认识 RAG' },
  { text: '切分：切错一步，后面全歪', link: '/rag/chunking', chapter: '六个环节' },
  { text: '索引：召回阶段救不了索引阶段的错', link: '/rag/indexing', chapter: '六个环节' },
  { text: '召回：先求宽，再求准', link: '/rag/retrieval', chapter: '六个环节' },
  { text: '重排：最后一道质检', link: '/rag/rerank', chapter: '六个环节' },
  { text: '生成：上下文是预算，不是仓库', link: '/rag/generation', chapter: '六个环节' },
  { text: '评测：不评测的 RAG 是薛定谔的 RAG', link: '/rag/evaluation', chapter: '六个环节' },
  { text: '一条能跑起来的最小流水线', link: '/rag/runnable', chapter: '动手与资源' },
  { text: '国内外 RAG 资源地图', link: '/rag/resources', chapter: '动手与资源' }
]
