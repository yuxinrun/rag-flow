// 从正文 DOM 抽取可朗读块：按句切，单块上限 180 字（超长强切，防止浏览器吞句）。
export interface SpeakBlock {
  text: string
  el?: Element | null
}

const MAX = 180
const SENT_RE = /[^。！？!?；;\n]+[。！？!?；;]?/g

export function splitSentences(text: string, max = MAX): string[] {
  const raw = text.replace(/\s+/g, ' ').trim().match(SENT_RE) ?? []
  const out: string[] = []
  let buf = ''
  for (const s of raw) {
    if ((buf + s).length > max && buf) {
      out.push(buf.trim())
      buf = s
    } else {
      buf += s
    }
    if (buf.length >= max) {
      out.push(buf.trim())
      buf = ''
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out
}

export function extractBlocks(root: ParentNode, selector = 'p, li, h1, h2'): SpeakBlock[] {
  const out: SpeakBlock[] = []
  root.querySelectorAll(selector).forEach((el) => {
    if (el.closest('[data-listen="skip"]')) return
    if (el.closest('pre')) return
    if (el.closest('.gs-bar, .gs-l-fab')) return
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (!text) return
    for (const piece of splitSentences(text)) out.push({ text: piece, el })
  })
  return out
}
