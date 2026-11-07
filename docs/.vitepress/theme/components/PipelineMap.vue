<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 760 190" role="img" aria-label="RAG 六个环节与各自要回答的问题">
      <g v-for="(s, i) in stages" :key="s.title">
        <rect :x="10 + i * 125" y="24" width="112" height="96" rx="14" fill="var(--panel)" :stroke="s.color" stroke-width="1.6" />
        <text :x="22 + i * 125" y="48" :fill="s.color" font-size="11" font-family="var(--font-mono)">0{{ i + 1 }}</text>
        <text :x="22 + i * 125" y="72" fill="var(--ink)" font-size="13" font-weight="700" font-family="var(--font-sans)">{{ s.title }}</text>
        <text :x="22 + i * 125" y="92" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">{{ s.en }}</text>
        <text :x="22 + i * 125" y="108" fill="var(--muted)" font-size="10" font-family="var(--font-sans)">{{ s.q }}</text>
        <path v-if="i < 5" :d="`M${124 + i * 125} 72h10`" stroke="var(--line-strong)" stroke-width="1.6" marker-end="url(#pm-a)" />
      </g>
      <defs>
        <marker id="pm-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0l8 4-8 4z" fill="var(--line-strong)" />
        </marker>
      </defs>
      <rect x="10" y="140" width="740" height="34" rx="10" fill="var(--accent-soft)" />
      <text x="24" y="162" fill="var(--ink-2)" font-size="12" font-family="var(--font-sans)">评测贯穿全链路：每一环都要能单独回答「这一环做坏了会怎样」</text>
    </svg>
    <figcaption class="gs-cap">
      RAG 的六个环节各自回答一个问题：怎么切、怎么存、怎么找、怎么排、怎么答、怎么验；评测不是最后一站，而是横在每一步下面的地板。
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const stages = [
  { title: '切分', en: 'Chunking', q: '证据长什么样？', color: 'var(--blue)' },
  { title: '索引', en: 'Indexing', q: '按什么建库？', color: 'var(--blue)' },
  { title: '召回', en: 'Retrieval', q: '候选从哪来？', color: 'var(--accent)' },
  { title: '重排', en: 'Rerank', q: '谁排第一？', color: 'var(--lime)' },
  { title: '生成', en: 'Generation', q: '证据怎么用？', color: 'var(--accent)' },
  { title: '评测', en: 'Evaluation', q: '坏在哪一环？', color: 'var(--coral)' }
]
</script>
