import { reactive } from 'vue'
import { splitSentences } from './extract'
import type { SpeakBlock } from './extract'
import { readingOrder } from './reading-order'

export type ListenRange = 'page' | 'chapter' | 'book'
export const RATE_STEPS = [0.75, 1, 1.25, 1.5, 1.75, 2]

const LS = {
  rate: 'gs-listen-rate',
  range: 'gs-listen-range',
  collapsed: 'gs-listen-collapsed'
}

export const gsState = reactive({
  mounted: false,
  supported: false,
  playing: false,
  idx: 0,
  rate: 1,
  range: 'page' as ListenRange,
  collapsed: false,
  error: '',
  title: '',
  total: 0
})

let queue: Array<SpeakBlock & { label: string }> = []
let keepAlive: ReturnType<typeof setInterval> | null = null
let currentPath = ''

// 用 markdown 原文构建朗读队列：dev / 静态部署都可用，不依赖别的页面 DOM。
const mdModules = import.meta.glob('../../rag/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

function mdToText(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '这段是代码，略过。')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/:::[^\n]*/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*>]\s+/gm, '')
    .replace(/[*_`|]/g, '')
    .replace(/\n+/g, ' ')
}

function blocksFor(link: string): SpeakBlock[] {
  const key = Object.keys(mdModules).find((k) => k.endsWith(link.replace('/rag/', '') + '.md'))
  if (!key) return []
  return mdToText(mdModules[key] as string)
    .split(/(?<=[。！？!?；;])\s*/)
    .flatMap((p) => splitSentences(p))
    .filter((t) => t.length > 1)
    .map((text) => ({ text }))
}

function planFor(path: string) {
  const normalized = path.replace(/\.html$/, '').replace(/\/$/, '')
  const here = readingOrder.findIndex((i) => i.link.replace(/\/$/, '') === normalized)
  if (here < 0) return []
  if (gsState.range === 'page') return readingOrder.slice(here, here + 1)
  if (gsState.range === 'chapter') {
    const chapter = readingOrder[here].chapter
    return readingOrder.filter((i) => i.chapter === chapter)
  }
  return readingOrder
}

function rebuildQueue() {
  const plan = planFor(currentPath)
  queue = plan.flatMap((item) =>
    blocksFor(item.link).map((b) => ({ ...b, label: item.text }))
  )
  gsState.total = queue.length
  gsState.idx = 0
  gsState.title = plan[0]?.text ?? '本页'
}

function stop() {
  gsState.playing = false
  if (keepAlive) clearInterval(keepAlive)
  keepAlive = null
  if (gsState.supported) window.speechSynthesis.cancel()
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'
}

function speakCurrent() {
  if (!gsState.supported || !queue.length) return
  const block = queue[gsState.idx]
  if (!block) return stop()
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(block.text)
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) {
    gsState.error = '这台设备没给浏览器语音包，念不了。'
    return stop()
  }
  u.voice = voices.find((v) => v.lang.startsWith('zh')) ?? voices[0]
  u.lang = u.voice.lang
  u.rate = gsState.rate
  u.onend = () => {
    if (!gsState.playing) return
    if (gsState.idx < queue.length - 1) {
      gsState.idx += 1
      speakCurrent()
    } else stop()
  }
  u.onerror = () => {
    gsState.error = '朗读被打断了，按播放键可以重试。'
    stop()
  }
  window.speechSynthesis.speak(u)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: block.label,
      artist: '鱼心快跑 · RAG 这件事',
      album: 'Yuxin Rush. Bugs Gone.'
    })
    navigator.mediaSession.playbackState = 'playing'
  }
  if (keepAlive) clearInterval(keepAlive)
  keepAlive = setInterval(() => {
    if (gsState.playing && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  }, 9000)
}

export function gsInit(path: string) {
  gsState.mounted = true
  gsState.supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  if (!gsState.supported) return
  const r = Number(localStorage.getItem(LS.rate))
  if (RATE_STEPS.includes(r)) gsState.rate = r
  const rr = localStorage.getItem(LS.range)
  if (rr === 'page' || rr === 'chapter' || rr === 'book') gsState.range = rr
  gsState.collapsed = localStorage.getItem(LS.collapsed) === '1'
  currentPath = path
  rebuildQueue()
  window.speechSynthesis.onvoiceschanged = () => gsState.error = ''
}

export function gsSetPath(path: string) {
  if (path === currentPath) return
  const wasPlaying = gsState.playing
  stop()
  currentPath = path
  rebuildQueue()
  if (wasPlaying) {
    gsState.playing = true
    speakCurrent()
  }
}

export function gsToggle() {
  gsState.error = ''
  if (gsState.playing) return stop()
  if (!queue.length) rebuildQueue()
  gsState.playing = true
  speakCurrent()
}

export function gsStep(delta: number) {
  stop()
  gsState.idx = Math.min(Math.max(gsState.idx + delta, 0), Math.max(queue.length - 1, 0))
  gsState.playing = true
  gsState.error = ''
  speakCurrent()
}

export function gsSetRate(rate: number) {
  gsState.rate = rate
  localStorage.setItem(LS.rate, String(rate))
  if (gsState.playing) speakCurrent() // 从当前句重念，不跳段
}

export function gsSetRange(range: ListenRange) {
  gsState.range = range
  localStorage.setItem(LS.range, range)
  stop()
  rebuildQueue()
}

export function gsToggleCollapse() {
  gsState.collapsed = !gsState.collapsed
  localStorage.setItem(LS.collapsed, gsState.collapsed ? '1' : '0')
}

export function gsCurrentLabel(): string {
  return queue[gsState.idx]?.label ?? gsState.title
}
