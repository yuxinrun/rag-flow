<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 720 320" role="img" aria-label="RAG 评测三角：查询、上下文、回答三条边的指标">
      <path d="M360 44 L150 260 L570 260 Z" fill="var(--bg-deep)" stroke="var(--line-strong)" stroke-width="1.6" />
      <g v-for="n in nodes" :key="n.t">
        <circle :cx="n.x" :cy="n.y" r="34" fill="var(--panel)" :stroke="n.c" stroke-width="2" />
        <text :x="n.x" :y="n.y + 4" text-anchor="middle" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">{{ n.t }}</text>
      </g>
      <g v-for="e in edges" :key="e.t">
        <rect :x="e.x" :y="e.y" width="170" height="34" rx="9" fill="var(--panel)" :stroke="e.c" stroke-width="1.4" />
        <text :x="e.x + 10" :y="e.y + 15" fill="var(--ink)" font-size="11" font-weight="600" font-family="var(--font-sans)">{{ e.t }}</text>
        <text :x="e.x + 10" :y="e.y + 28" fill="var(--muted)" font-size="9" font-family="var(--font-mono)">{{ e.en }}</text>
      </g>
      <text x="14" y="306" fill="var(--faint)" font-size="10" font-family="var(--font-mono)">口径来自 TruLens RAG Triad 与 RAGAS 指标体系；示意，未配实测数值</text>
    </svg>
    <figcaption class="gs-cap">
      评测不是只盯最终答案：RAG 三角把系统拆成「问题→上下文」的上下文相关性、「上下文→回答」的忠实度/接地性、「问题→回答」的答案相关性三条边，哪条边掉分就回去修对应环节。
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const nodes = [
  { t: 'Query', x: 360, y: 44, c: 'var(--blue)' },
  { t: 'Context', x: 150, y: 260, c: 'var(--accent)' },
  { t: 'Answer', x: 570, y: 260, c: 'var(--coral)' }
]
const edges = [
  { t: '上下文相关性', en: 'Context Relevance', x: 100, y: 138, c: 'var(--blue)' },
  { t: '忠实度 / 接地性', en: 'Faithfulness / Groundedness', x: 290, y: 214, c: 'var(--accent)' },
  { t: '答案相关性', en: 'Answer Relevance', x: 450, y: 138, c: 'var(--coral)' }
]
</script>
