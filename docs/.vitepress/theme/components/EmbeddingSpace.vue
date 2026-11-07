<template>
  <figure class="fig" data-listen="skip">
    <svg viewBox="0 0 720 300" role="img" aria-label="嵌入空间示意：语义相近的文本聚成簇，查询落点靠近相关簇">
      <rect x="30" y="20" width="660" height="230" rx="18" fill="var(--bg-deep)" />
      <g v-for="(g, i) in grids" :key="'g' + i">
        <line :x1="30" :x2="690" :y1="g" :y2="g" stroke="var(--line)" stroke-width="1" />
      </g>
      <g v-for="(g, i) in vgrids" :key="'v' + i">
        <line :x1="g" :x2="g" y1="20" y2="250" stroke="var(--line)" stroke-width="1" />
      </g>
      <g v-for="(p, i) in points" :key="i">
        <circle :cx="p.x" :cy="p.y" r="5" :fill="p.c" opacity="0.85" />
      </g>
      <g v-for="c in clusters" :key="c.label">
        <ellipse :cx="c.x" :cy="c.y" rx="66" ry="46" fill="none" :stroke="c.c" stroke-width="1.4" stroke-dasharray="5 4" />
        <text :x="c.x - 26" :y="c.y + 62" :fill="c.c" font-size="11" font-family="var(--font-mono)">{{ c.label }}</text>
      </g>
      <path d="M600 200 Q500 190 250 105" fill="none" stroke="var(--coral)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#es-a)" />
      <rect x="560" y="186" width="120" height="30" rx="8" fill="var(--panel)" stroke="var(--coral)" stroke-width="1.5" />
      <text x="572" y="205" fill="var(--ink)" font-size="11" font-family="var(--font-sans)">query 向量</text>
      <text x="30" y="278" fill="var(--faint)" font-size="10" font-family="var(--font-mono)">二维投影仅为机制示意，真实维度通常为几百到几千维，未配实测数值</text>
      <defs>
        <marker id="es-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0l8 4-8 4z" fill="var(--coral)" />
        </marker>
      </defs>
    </svg>
    <figcaption class="gs-cap">
      嵌入模型把文本压成向量，语义相近的内容在向量空间里挤成簇；查询被编码成同一个空间里的点，召回就是找离它最近的那些块，所以「用什么模型压」直接决定「能找到什么」。
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const grids = [65, 110, 155, 200]
const vgrids = [140, 250, 360, 470, 580]
const clusters = [
  { label: '财务/报销', x: 180, y: 100, c: 'var(--accent)' },
  { label: '设备/报修', x: 400, y: 180, c: 'var(--blue)' },
  { label: '人事/假期', x: 560, y: 95, c: 'var(--lime)' }
]
const points = [
  { x: 150, y: 88, c: 'var(--accent)' }, { x: 178, y: 78, c: 'var(--accent)' },
  { x: 205, y: 96, c: 'var(--accent)' }, { x: 160, y: 118, c: 'var(--accent)' },
  { x: 210, y: 122, c: 'var(--accent)' }, { x: 375, y: 165, c: 'var(--blue)' },
  { x: 410, y: 155, c: 'var(--blue)' }, { x: 430, y: 188, c: 'var(--blue)' },
  { x: 390, y: 200, c: 'var(--blue)' }, { x: 535, y: 80, c: 'var(--lime)' },
  { x: 570, y: 70, c: 'var(--lime)' }, { x: 585, y: 105, c: 'var(--lime)' },
  { x: 545, y: 115, c: 'var(--lime)' }
]
</script>
