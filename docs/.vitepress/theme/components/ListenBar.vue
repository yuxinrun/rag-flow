<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import {
  gsState, gsInit, gsSetPath, gsToggle, gsStep, gsSetRate, gsSetRange,
  gsToggleCollapse, RATE_STEPS
} from '../useSpeech'
import type { ListenRange } from '../useSpeech'

const route = useRoute()
const barEl = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

const label = computed(() =>
  gsState.total ? `第 ${gsState.idx + 1} / 共 ${gsState.total} 句 · ${gsState.title}` : '本页暂无可朗读内容'
)

function setH(h: number) {
  document.documentElement.style.setProperty('--gs-bar-h', `${h}px`)
}
function measure() {
  if (!gsState.supported) return setH(0)
  if (gsState.collapsed) return setH(60)
  nextTick(() => {
    ro?.disconnect()
    if (!barEl.value) return
    ro = new ResizeObserver(() => setH((barEl.value?.offsetHeight ?? 0) + 4))
    ro.observe(barEl.value)
    setH(barEl.value.offsetHeight + 4)
  })
}
function onKey(e: KeyboardEvent) {
  if (!e.altKey) return
  if (e.key.toLowerCase() === 'p') { e.preventDefault(); gsToggle() }
  if (e.key === 'ArrowLeft') { e.preventDefault(); gsStep(-1) }
  if (e.key === 'ArrowRight') { e.preventDefault(); gsStep(1) }
}
function onRange(e: Event) {
  gsSetRange((e.target as HTMLSelectElement).value as ListenRange)
}
function onRate(e: Event) {
  gsSetRate(Number((e.target as HTMLSelectElement).value))
}

watch(() => gsState.collapsed, measure)
watch(() => route.path, (p) => gsSetPath(p))

onMounted(() => {
  gsInit(route.path)
  measure()
  window.addEventListener('keydown', onKey)
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', () => { if (!gsState.playing) gsToggle() })
      navigator.mediaSession.setActionHandler('pause', () => { if (gsState.playing) gsToggle() })
      navigator.mediaSession.setActionHandler('nexttrack', () => gsStep(1))
      navigator.mediaSession.setActionHandler('previoustrack', () => gsStep(-1))
    } catch { /* 系统播放器不支持就安静略过 */ }
  }
})
onUnmounted(() => {
  ro?.disconnect()
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div v-if="gsState.mounted && gsState.supported && !gsState.collapsed" ref="barEl" class="gs-bar">
    <div class="gs-l-head">
      <button class="gs-l-btn is-on" :aria-label="gsState.playing ? '暂停' : '播放'" @click="gsToggle()">
        <svg v-if="gsState.playing" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M8 4.5v15l12-7.5z"/></svg>
      </button>
      <button class="gs-l-btn" aria-label="上一句" @click="gsStep(-1)">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h2v14H7zm12 0v14L9 12z"/></svg>
      </button>
      <button class="gs-l-btn" aria-label="下一句" @click="gsStep(1)">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 5h2v14h-2zM5 5v14l10-7z"/></svg>
      </button>
      <span class="gs-l-title">{{ label }}</span>
      <div class="gs-l-controls">
        <select class="gs-l-select" :value="gsState.range" aria-label="连播范围" @change="onRange">
          <option value="page">本页</option>
          <option value="chapter">本章</option>
          <option value="book">全书</option>
        </select>
        <select class="gs-l-select" :value="gsState.rate" aria-label="语速" @change="onRate">
          <option v-for="r in RATE_STEPS" :key="r" :value="r">{{ r }}×</option>
        </select>
        <span class="gs-l-meta">Alt+P / Alt+←→</span>
        <button class="gs-l-btn gs-l-collapse" aria-label="收起听书条" @click="gsToggleCollapse()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>
    </div>
    <p v-if="gsState.error" class="gs-l-error">{{ gsState.error }}</p>
  </div>

  <button
    v-if="gsState.mounted && gsState.supported && gsState.collapsed"
    class="gs-l-fab"
    aria-label="展开听书条"
    @click="gsToggleCollapse()"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="13" width="4" height="7" rx="2" fill="currentColor" stroke="none"/><rect x="17" y="13" width="4" height="7" rx="2" fill="currentColor" stroke="none"/>
    </svg>
    <span v-if="gsState.playing" class="gs-l-dot" />
  </button>
</template>
