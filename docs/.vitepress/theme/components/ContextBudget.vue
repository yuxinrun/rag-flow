<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 720 280" role="img" aria-label="上下文窗口中的位置效应：中间的证据最容易被忽略">
      <text x="14" y="22" fill="var(--ink)" font-size="12" font-weight="700" font-family="var(--font-sans)">一个 context window 里塞进去的东西</text>
      <g v-for="(s, i) in slots" :key="i">
        <rect :x="14 + i * 69" y="36" :width="62" height="52" rx="8"
          :fill="s.kind === 'mid' ? 'var(--panel-2)' : 'var(--accent-soft)'"
          :stroke="s.kind === 'mid' ? 'var(--line)' : 'var(--accent)'" stroke-width="1.4" />
        <text :x="22 + i * 69" y="58" fill="var(--ink-2)" font-size="10" font-family="var(--font-mono)">{{ s.label }}</text>
        <text :x="22 + i * 69" y="76" :fill="s.kind === 'mid' ? 'var(--faint)' : 'var(--accent)'" font-size="9" font-family="var(--font-mono)">{{ s.tag }}</text>
      </g>
      <text x="14" y="110" fill="var(--coral)" font-size="11" font-family="var(--font-sans)">↑ 头尾容易被看见</text>
      <text x="300" y="110" fill="var(--muted)" font-size="11" font-family="var(--font-sans)">↑ 中间这块，模型看着看着就走神了</text>
      <path d="M40 230 C140 140 240 140 340 205 C440 260 560 245 680 150" fill="none" stroke="var(--blue)" stroke-width="2.2" />
      <line x1="40" y1="140" x2="40" y2="240" stroke="var(--line-strong)" />
      <line x1="40" y1="240" x2="690" y2="240" stroke="var(--line-strong)" />
      <text x="14" y="136" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">答对率</text>
      <text x="14" y="262" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">金句在开头</text>
      <text x="300" y="262" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">金句在中间</text>
      <text x="600" y="262" fill="var(--muted)" font-size="10" font-family="var(--font-mono)">金句在结尾</text>
      <text x="40" y="132" fill="var(--faint)" font-size="10" font-family="var(--font-mono)">U 形曲线为机制示意，未配实测数值</text>
    </svg>
    <figcaption class="gs-cap">
      上下文不是仓库而是预算：Liu 等人 2023 年用多文档问答测到「答案在中间时表现下降」的 U 形位置效应，所以重排后最关键的证据要放头尾，问题放最后，别把金句埋在第 5 块。
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const slots = [
  { label: '系统指令', tag: 'head', kind: 'head' },
  { label: '证据 #1', tag: 'head', kind: 'head' },
  { label: '证据 #2', tag: 'mid', kind: 'mid' },
  { label: '证据 #3', tag: 'mid', kind: 'mid' },
  { label: '证据 #4', tag: 'mid', kind: 'mid' },
  { label: '证据 #5', tag: 'mid', kind: 'mid' },
  { label: '证据 #6', tag: 'mid', kind: 'mid' },
  { label: '证据 #7', tag: 'head', kind: 'head' },
  { label: '用户问题', tag: 'tail', kind: 'head' },
  { label: '留白', tag: 'buffer', kind: 'mid' }
]
</script>
