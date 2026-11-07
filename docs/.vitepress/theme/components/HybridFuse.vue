<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 720 280" role="img" aria-label="稠密检索与 BM25 稀疏检索结果经 RRF 融合成最终候选">
      <text x="14" y="22" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">稠密通道（语义）</text>
      <text x="390" y="22" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">稀疏通道（关键词 BM25）</text>
      <g v-for="(r, i) in dense" :key="'d' + i">
        <rect x="14" :y="34 + i * 34" width="300" height="28" rx="7" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.2" />
        <text x="24" :y="52 + i * 34" fill="var(--ink-2)" font-size="10.5" font-family="var(--font-mono)">{{ i + 1 }}. {{ r }}</text>
      </g>
      <g v-for="(r, i) in sparse" :key="'s' + i">
        <rect x="390" :y="34 + i * 34" width="300" height="28" rx="7" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.2" />
        <text x="400" :y="52 + i * 34" fill="var(--ink-2)" font-size="10.5" font-family="var(--font-mono)">{{ i + 1 }}. {{ r }}</text>
      </g>
      <path d="M314 80 Q350 80 350 122 L350 138 M390 80 Q368 80 368 122 L368 138" fill="none" stroke="var(--line-strong)" stroke-width="1.6" marker-end="url(#hf-a)" />
      <rect x="230" y="142" width="260" height="40" rx="10" fill="var(--panel)" stroke="var(--lime)" stroke-width="1.8" />
      <text x="246" y="159" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">RRF 倒数排名融合</text>
      <text x="246" y="174" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">score = Σ 1 / (60 + rank)</text>
      <rect x="120" y="204" width="480" height="46" rx="10" fill="var(--panel-2)" stroke="var(--line-strong)" stroke-width="1.2" />
      <text x="136" y="224" fill="var(--ink)" font-size="11" font-family="var(--font-sans)">融合后：报销时效 › 咖啡机 › 双审条件 › 打印机</text>
      <text x="136" y="240" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">谁在两路都排前面，谁就冲到最前 —— 不比分数，比名次</text>
      <defs>
        <marker id="hf-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0l8 4-8 4z" fill="var(--line-strong)" /></marker>
      </defs>
    </svg>
    <figcaption class="gs-cap">
      稠密检索抓「意思像」，BM25 抓「词一样」，两路结果用 RRF 按名次而不是按分数融合：一个文档只要在两路都靠前就会胜出，因此不必把两种量纲的分数硬凑到一根秤上。
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const dense = ['报销五个工作日到账', '打印机卡纸处理', '咖啡机滤芯更换', '会议室投影仪']
const sparse = ['双审条件 2000 元', '报销五个工作日到账', '年假累积规则', '打印机卡纸处理']
</script>
