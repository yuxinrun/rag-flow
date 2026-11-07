<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 720 260" role="img" aria-label="三种切分策略对比：固定长度、语义边界、父子块">
      <text x="10" y="20" fill="var(--faint)" font-size="10" font-family="var(--font-mono)">同一段原文：……报销需提交发票。金额超 2000 元须双审，五个工作日到账……</text>
      <g v-for="(row, r) in rows" :key="row.label">
        <text x="10" :y="52 + r * 70" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">{{ row.label }}</text>
        <text x="10" :y="68 + r * 70" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">{{ row.note }}</text>
        <g v-for="(blk, b) in row.blocks" :key="b">
          <rect :x="150 + blk.x" :y="40 + r * 70" :width="blk.w" height="34" rx="7"
            :fill="blk.bad ? 'var(--coral-soft)' : 'var(--panel-2)'"
            :stroke="blk.bad ? 'var(--coral)' : 'var(--accent)'" stroke-width="1.4" />
          <text :x="158 + blk.x" :y="61 + r * 70" fill="var(--ink-2)" font-size="10" font-family="var(--font-sans)">{{ blk.t }}</text>
        </g>
      </g>
      <line x1="0" y1="238" x2="720" y2="238" stroke="var(--line)" />
      <text x="10" y="254" fill="var(--faint)" font-size="10" font-family="var(--font-mono)">红色 = 一句话被拦腰切断，答案的关键条件落在了隔壁块</text>
    </svg>
    <figcaption class="gs-cap">
      固定长度切法便宜但容易把「超过 2000 元」和「须双审」切到两个块里；按语义边界切能保证每个块自带完整条件；父子块让检索用小块的精度、生成拿大块的上下文。
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const rows = [
  {
    label: '固定长度', note: '每 N 个字符一刀',
    blocks: [
      { x: 0, w: 150, t: '报销需提交发票。金额', bad: false },
      { x: 158, w: 150, t: '超 2000 元须双审，', bad: true },
      { x: 316, w: 170, t: '五个工作日到账……', bad: true }
    ]
  },
  {
    label: '语义边界', note: '按句 / 标题 / 段落切',
    blocks: [
      { x: 0, w: 116, t: '报销需提交发票。', bad: false },
      { x: 124, w: 210, t: '金额超 2000 元须双审，', bad: false },
      { x: 342, w: 150, t: '五个工作日到账。', bad: false }
    ]
  },
  {
    label: '父子块', note: '小块检索，大块喂给模型',
    blocks: [
      { x: 0, w: 150, t: '父块：报销制度全文', bad: false },
      { x: 158, w: 150, t: '子块①：发票要求', bad: false },
      { x: 316, w: 170, t: '子块②：双审与时效', bad: false }
    ]
  }
]
</script>
