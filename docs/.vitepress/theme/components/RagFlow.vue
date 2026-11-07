<script setup lang="ts">
const nodes = [
  { x: 40, y: 24, w: 210, h: 46, t: '用户问题', s: '「报销要几天？」', c: 'var(--blue)' },
  { x: 310, y: 24, w: 210, h: 46, t: '离线：切分 + 索引', s: '文档 → chunk → 向量', c: 'var(--accent)' },
  { x: 40, y: 118, w: 210, h: 46, t: '召回 Retrieval', s: '从库里捞回 top-k 候选', c: 'var(--accent)' },
  { x: 310, y: 118, w: 210, h: 46, t: '重排 Rerank', s: '把最相关的挪到最前', c: 'var(--lime)' },
  { x: 40, y: 212, w: 210, h: 46, t: '生成 Generation', s: '问题 + 证据 → prompt', c: 'var(--blue)' },
  { x: 310, y: 212, w: 210, h: 46, t: '答案 + 引用', s: '「5 个工作日【来源 2】」', c: 'var(--coral)' }
]
</script>

<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 560 320" role="img" aria-label="RAG 六步流程：用户问题、切分索引、召回、重排、生成、答案与引用">
      <defs>
        <marker id="rf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0l10 5-10 5z" fill="var(--line-strong)" />
        </marker>
      </defs>
      <rect x="0" y="0" width="560" height="320" rx="28" fill="var(--bg-deep)" />
      <path
        d="M145 70V94h270V70 M250 164v28H145v20 M460 164v28H355v20 M250 258v28h215v-78"
        fill="none" stroke="var(--line-strong)" stroke-width="1.6" stroke-dasharray="5 5" marker-end="url(#rf-arrow)"
        class="rf-flow" />
      <g v-for="n in nodes" :key="n.t">
        <rect :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="12" fill="var(--panel)" :stroke="n.c" stroke-width="1.6" />
        <text :x="n.x + 14" :y="n.y + 20" fill="var(--ink)" font-size="13" font-weight="700" font-family="var(--font-sans)">{{ n.t }}</text>
        <text :x="n.x + 14" :y="n.y + 37" fill="var(--muted)" font-size="10.5" font-family="var(--font-mono)">{{ n.s }}</text>
      </g>
      <text x="40" y="306" fill="var(--faint)" font-size="10" font-family="var(--font-mono)">OFFLINE BUILD → ONLINE QUERY → VERIFY</text>
    </svg>
    <figcaption class="gs-cap">
      一条 RAG 流水线分成离线建库与在线问答两段：文档先被切块、编码、入库，用户提问时再走召回、重排、生成，最后连答案带引用一起交付；机制示意，未配实测数值。
    </figcaption>
  </figure>
</template>

<style scoped>
.rf-flow { animation: rf-dash 14s linear infinite; }
@keyframes rf-dash { to { stroke-dashoffset: -200; } }
</style>
