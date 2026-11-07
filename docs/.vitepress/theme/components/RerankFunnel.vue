<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 720 260" role="img" aria-label="重排漏斗：一百个召回候选经交叉编码器打分后只留五块">
      <path d="M40 30h240l-60 70v110l-120-30V100z" fill="var(--bg-deep)" stroke="var(--line-strong)" stroke-width="1.5" />
      <text x="90" y="66" fill="var(--ink)" font-size="13" font-weight="700" font-family="var(--font-sans)">召回 100 块</text>
      <text x="90" y="86" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">bi-encoder / BM25</text>
      <path d="M280 80h60" stroke="var(--line-strong)" stroke-width="1.6" marker-end="url(#rr-a)" />
      <rect x="340" y="44" width="180" height="72" rx="12" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.8" />
      <text x="356" y="70" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">Cross-encoder</text>
      <text x="356" y="90" fill="var(--muted)" font-size="10.5" font-family="var(--font-sans)">把「问题 + 块」一起喂进去</text>
      <text x="356" y="106" fill="var(--muted)" font-size="10.5" font-family="var(--font-sans)">逐对算相关性分数</text>
      <path d="M520 80h60" stroke="var(--line-strong)" stroke-width="1.6" marker-end="url(#rr-a)" />
      <g v-for="(n, i) in top" :key="n">
        <rect x="580" :y="26 + i * 28" width="120" height="24" rx="6" fill="var(--panel)" :stroke="i === 0 ? 'var(--coral)' : 'var(--line-strong)'" stroke-width="1.3" />
        <text x="590" :y="42 + i * 28" fill="var(--ink-2)" font-size="10" font-family="var(--font-mono)">#{{ i + 1 }} {{ n }}</text>
      </g>
      <rect x="40" y="180" width="660" height="56" rx="12" fill="var(--panel-2)" />
      <text x="56" y="203" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">为什么要单独一步？</text>
      <text x="56" y="222" fill="var(--muted)" font-size="11" font-family="var(--font-sans)">召回必须快（百万级 ANN），重排可以慢（只算几十对）；精度换延迟，账算得过来。</text>
      <defs>
        <marker id="rr-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0l8 4-8 4z" fill="var(--line-strong)" /></marker>
      </defs>
    </svg>
    <figcaption class="gs-cap">
      召回用便宜的 bi-encoder 从百万块里快速捞回约 100 块，重排用贵的 cross-encoder 只对这几十对做「问题与文档一起读」的精算，最后留 3–5 块进 prompt；快慢分工是工程账，不是玄学。
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const top = ['0.91 报销时效', '0.84 双审条件', '0.72 发票要求', '0.31 咖啡机', '0.12 投影仪']
</script>
