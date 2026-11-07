<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'sentence' | 'paragraph'
interface Chunk { id: string; title: string; text: string }
interface Scored extends Chunk { dense: number; kw: number; score: number; final: number }

const DOCS = [
  { id: 1, title: '茶水间', text: '咖啡机每天早上八点自动清洗，滤芯每两个月更换一次。更换滤芯后长按红色按钮三秒复位。' },
  { id: 2, title: '报销', text: '报销需在飞书提交电子发票，金额超过 2000 元要部门总监与财务双审。材料齐全后一般五个工作日到账。' },
  { id: 3, title: '会议室', text: '会议室 A 的投影仪支持 USB-C 直连，HDMI 转接头放在前台第二个抽屉。借用转接头需要在前台登记。' },
  { id: 4, title: '年假', text: '入职满一年有五天年假，满十年增加到十天。年假当年有效，不跨年累积。' },
  { id: 5, title: '打印机', text: '三楼东侧的打印机经常卡纸，卡纸时先开前盖取出纸屑，再按面板上的继续键。反复卡纸就找行政小陈报修。' }
]

const query = ref('打印机卡纸了怎么办')
const mode = ref<Mode>('sentence')
const hybrid = ref(true)
const rerankOn = ref(true)

const chunks = computed<Chunk[]>(() =>
  DOCS.flatMap((d) =>
    mode.value === 'sentence'
      ? d.text.split(/(?<=。)/).filter((s) => s.trim()).map((s, i) => ({
          id: `${d.id}.${i + 1}`, title: d.title, text: s.trim()
        }))
      : [{ id: `${d.id}`, title: d.title, text: d.text }]
  )
)

function hash(s: string): number {
  let h = 2166136261
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function clean(s: string) { return s.replace(/[\s，。、：；「」？！0-9]/g, '') }
function grams(s: string): Set<string> {
  const t = clean(s), out = new Set<string>()
  for (let i = 0; i < t.length - 1; i++) out.add(t.slice(i, i + 2))
  return out
}
function toVec(s: string): number[] {
  const v = new Array<number>(48).fill(0)
  const gs = grams(s)
  gs.forEach((g) => { v[hash(g) % 48] += 1 })
  const n = Math.hypot(...v) || 1
  return v.map((x) => x / n)
}
function cos(a: number[], b: number[]): number {
  return a.reduce((sum, x, i) => sum + x * b[i], 0)
}
function kwScore(q: string, c: string): number {
  const qs = grams(q)
  if (!qs.size) return 0
  const cs = grams(c)
  let hit = 0
  qs.forEach((g) => { if (cs.has(g)) hit += 1 })
  return hit / qs.size
}

const REWRITE: Record<string, string> = { 几天: '工作日 到账', 多久: '工作日 到账', 怎么办: '处理 办法' }
function rewrite(q: string): string {
  const extra = Object.entries(REWRITE).filter(([k]) => q.includes(k)).map(([, v]) => v)
  return q + (extra.length ? ' ' + extra.join(' ') : '')
}
const rewritten = computed(() => rewrite(query.value))

const heat = computed(() => toVec(chunks.value[0]?.text ?? ''))
const scored = computed<Scored[]>(() => {
  const q = rewritten.value
  const qv = toVec(q)
  return chunks.value
    .map((c) => {
      const dense = cos(qv, toVec(c.text))
      const kw = kwScore(q, c.text)
      const score = hybrid.value ? dense * 0.7 + kw * 0.6 : dense
      return { ...c, dense, kw, score, final: score }
    })
    .sort((a, b) => b.score - a.score)
})
const recalled = computed(() => scored.value.slice(0, 4))
const reranked = computed(() => {
  const list = recalled.value.slice()
  if (!rerankOn.value) return list
  return list
    .map((c) => ({ ...c, final: c.kw * 0.7 + c.dense * 0.3 }))
    .sort((a, b) => b.final - a.final)
})
const moved = computed(() =>
  recalled.value.length > 0 && reranked.value.length > 0 &&
  recalled.value[0].id !== reranked.value[0].id
)
const answer = computed(() => {
  const usable = reranked.value.filter((c) => c.kw >= 0.08)
  if (!usable.length) return '资料里没找到能支撑这句话的内容，我不知道。（这叫拒答，是特性，不是 bug。）'
  const parts = usable.slice(0, 2).map((c) => `${c.text}【来源 ${c.id} · ${c.title}】`)
  return `根据手头 ${chunks.value.length} 个块，能确认的是：${parts.join(' ')}`
})
const pct = (n: number) => `${Math.max(2, Math.min(100, n * 100)).toFixed(0)}%`
</script>

<template>
  <figure class="fig" data-listen="skip">
    <div class="demo">
      <div class="demo-head">
        <span class="demo-tag">LIVE · 浏览器里真跑</span>
        <label class="demo-query">问一句：
          <input v-model="query" type="text" placeholder="试试『报销要几天』或『外星人几点下班』" />
        </label>
      </div>

      <section class="demo-stage">
        <div class="demo-no">01 切分</div>
        <div class="demo-body">
          <div class="demo-toggle">
            <button :class="{ on: mode === 'sentence' }" @click="mode = 'sentence'">按句切</button>
            <button :class="{ on: mode === 'paragraph' }" @click="mode = 'paragraph'">整篇不切</button>
            <span class="demo-hint">共 {{ chunks.length }} 块</span>
          </div>
          <div class="demo-chips">
            <span v-for="c in chunks" :key="c.id" class="chip">{{ c.id }} · {{ c.text.slice(0, 11) }}…</span>
          </div>
        </div>
      </section>

      <section class="demo-stage">
        <div class="demo-no">02 索引</div>
        <div class="demo-body">
          <div class="demo-heat" aria-label="第一块的 48 维玩具向量热力条">
            <i v-for="(v, i) in heat" :key="i" :style="{ opacity: 0.12 + Math.min(1, v * 3) }" />
          </div>
          <p class="demo-hint">把 #{{ chunks[0]?.id }} 压成 48 维向量：字符二元组哈希 + L2 归一化（教学玩具，不用于生产）。</p>
        </div>
      </section>

      <section class="demo-stage">
        <div class="demo-no">03 召回</div>
        <div class="demo-body">
          <div class="demo-toggle">
            <button :class="{ on: !hybrid }" @click="hybrid = false">只开稠密</button>
            <button :class="{ on: hybrid }" @click="hybrid = true">稠密 + 关键词混合</button>
            <span class="demo-hint" style="margin:0">查询改写：{{ rewritten }}</span>
          </div>
          <div v-for="c in recalled" :key="c.id" class="demo-row">
            <code>#{{ c.id }}</code>
            <span class="demo-row-text">{{ c.text.slice(0, 16) }}…</span>
            <span class="demo-bar"><i :style="{ width: pct(c.score) }" /></span>
            <b>{{ c.score.toFixed(2) }}</b>
          </div>
        </div>
      </section>

      <section class="demo-stage">
        <div class="demo-no">04 重排</div>
        <div class="demo-body">
          <div class="demo-toggle">
            <button :class="{ on: !rerankOn }" @click="rerankOn = false">跳过</button>
            <button :class="{ on: rerankOn }" @click="rerankOn = true">按词面覆盖重排</button>
            <span v-if="moved && rerankOn" class="demo-moved">第一名换人了 ↑</span>
          </div>
          <div class="demo-order">
            <span v-for="(c, i) in reranked" :key="c.id" :class="{ first: i === 0 }">#{{ c.id }}<small>{{ c.final.toFixed(2) }}</small></span>
          </div>
        </div>
      </section>

      <section class="demo-stage">
        <div class="demo-no">05 生成</div>
        <div class="demo-body"><p class="demo-answer">{{ answer }}</p></div>
      </section>
    </div>
    <figcaption class="gs-cap">
      这条流水线在浏览器里从切分一路跑到带引用的生成：切换「按句切/整篇不切」会改变候选块，切换「混合召回」和「重排」会改变第一名，而问一个资料里没有的问题会触发拒答；向量是字符哈希玩具实现，只用来演示数据怎么流动，不能拿来选模型。
    </figcaption>
  </figure>
</template>

<style scoped>
.demo { border: 1px solid var(--line-strong); border-radius: var(--radius); background: var(--panel); padding: 20px; }
.demo-head { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.demo-tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--accent); border: 1px solid var(--accent); border-radius: 999px; padding: 3px 10px; }
.demo-query { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 8px; flex: 1; min-width: 240px; }
.demo-query input { flex: 1; min-width: 160px; border: 1px solid var(--line-strong); border-radius: var(--radius-sm); background: var(--panel-2); color: var(--ink); padding: 7px 10px; font-family: var(--font-sans); font-size: 13px; }
.demo-query input:focus { outline: 2px solid var(--accent-soft); border-color: var(--accent); }
.demo-stage { display: grid; grid-template-columns: 76px 1fr; gap: 12px; border-top: 1px solid var(--line); padding: 14px 0; }
.demo-no { font-family: var(--font-mono); font-size: 11px; color: var(--faint); padding-top: 4px; }
.demo-body { min-width: 0; }
.demo-toggle { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.demo-toggle button { border: 1px solid var(--line-strong); background: var(--panel-2); color: var(--ink-2); border-radius: 999px; padding: 4px 12px; font-size: 11px; cursor: pointer; transition: transform 0.25s var(--ease), background 0.25s var(--ease), color 0.25s var(--ease); }
.demo-toggle button:hover { transform: translateY(-2px); }
.demo-toggle button.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
.demo-hint { font-size: 11px; color: var(--muted); margin: 6px 0 0; line-height: 1.6; }
.demo-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { font-size: 10.5px; font-family: var(--font-mono); color: var(--muted); background: var(--panel-2); border: 1px solid var(--line); border-radius: 6px; padding: 3px 7px; }
.demo-heat { display: flex; gap: 2px; height: 26px; }
.demo-heat i { flex: 1; background: var(--accent); border-radius: 2px; }
.demo-row { display: grid; grid-template-columns: 44px minmax(0, 1fr) 110px 36px; gap: 8px; align-items: center; font-size: 11px; margin: 5px 0; color: var(--ink-2); }
.demo-row code { font-family: var(--font-mono); color: var(--accent); }
.demo-row-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.demo-row b { font-family: var(--font-mono); font-size: 10px; color: var(--muted); text-align: right; }
.demo-bar { height: 7px; background: var(--panel-3); border-radius: 999px; overflow: hidden; }
.demo-bar i { display: block; height: 100%; background: var(--accent); border-radius: 999px; transition: width 0.3s var(--ease); }
.demo-order { display: flex; flex-wrap: wrap; gap: 8px; }
.demo-order span { font-family: var(--font-mono); font-size: 11px; color: var(--muted); background: var(--panel-2); border: 1px solid var(--line); border-radius: 8px; padding: 5px 9px; display: inline-flex; gap: 6px; align-items: center; }
.demo-order span.first { border-color: var(--coral); color: var(--coral); }
.demo-order small { color: var(--faint); }
.demo-moved { font-size: 11px; color: var(--coral); }
.demo-answer { margin: 0; font-size: 13px; line-height: 1.75; color: var(--ink); background: var(--accent-soft); border-radius: var(--radius-sm); padding: 10px 14px; }
@media (max-width: 640px) {
  .demo-stage { grid-template-columns: 1fr; }
  .demo-row { grid-template-columns: 40px minmax(0, 1fr) 60px 32px; }
}
</style>
