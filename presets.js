// @local/dsh-fonts-wallpaper — bundled presets: fonts and wallpapers shipped inside the plugin.
//
// The binaries live in `assets/` and are read from disk on demand, so no image or
// font bytes are duplicated in JavaScript. The client half (client.js) keeps a
// small mirror of this metadata (the FONT_FACE_TEMPLATE line is checked for byte
// parity by the harness) and gets the image payloads from the presets route.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))

/** Same one-rule template as client.js; the harness compares the two copies. */
export const FONT_FACE_TEMPLATE = '@font-face{font-family:"{family}";font-style:normal;font-weight:400;font-display:swap;src:{src};}'

export const BUNDLED_FONTS = [
  {
    family: 'Dsh Builtin CJK',
    label: '霞鹜文楷 GB 屏幕阅读版（内置子集）',
    note: '内置子集 · GB2312 常用字 + 拉丁',
    // Machines that have the real font keep using it: local() is tried first.
    local: ['霞鹜文楷 GB 屏幕阅读版', 'LXGW WenKai GB Screen', 'LXGWWenKaiGBScreen'],
    file: path.join('assets', 'fonts', 'lxgw-wenkai-gb-screen-subset.woff2'),
    license: path.join('LICENSES', 'bundled-font.txt'),
  },
]

export const BUNDLED_WALLPAPERS = [
  { id: 'preset-1', name: 'aurora-veil.png', label: 'aurora-veil', file: path.join('assets', 'wallpapers', 'aurora-veil.png') },
  { id: 'preset-2', name: 'dusk-tide.png', label: 'dusk-tide', file: path.join('assets', 'wallpapers', 'dusk-tide.png') },
  { id: 'preset-3', name: 'mint-bloom.png', label: 'mint-bloom', file: path.join('assets', 'wallpapers', 'mint-bloom.png') },
]

const MIME = { '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' }

const cache = new Map()

/** Read a bundled asset once and return its `data:` URL. */
export function bundledDataUrl(file) {
  if (cache.has(file)) return cache.get(file)
  const abs = path.isAbsolute(file) ? file : path.join(HERE, file)
  const ext = path.extname(abs).toLowerCase()
  const mime = MIME[ext] ?? 'application/octet-stream'
  let url = ''
  try {
    url = `data:${mime};base64,${fs.readFileSync(abs).toString('base64')}`
  } catch {
    url = ''
  }
  cache.set(file, url)
  return url
}

/** One `@font-face` rule; the installed copy wins when it exists. */
export function fontFaceCss(font) {
  const data = bundledDataUrl(font.file)
  if (!data) return ''
  const src = [...font.local.map(name => `local("${name}")`), `url("${data}") format("woff2")`].join(', ')
  return FONT_FACE_TEMPLATE.replace('{family}', font.family).replace('{src}', src) + '\n'
}

/** Rules for every bundled family the config actually references. */
export function bundledFontFaceCss(config) {
  const text = Object.entries(config ?? {})
    .filter(([field]) => /(?:Latin|Cjk)$/.test(field))
    .map(([, value]) => String(value ?? ''))
    .join(' ')
    .toLowerCase()
  if (!text) return ''
  return BUNDLED_FONTS.filter(font => text.includes(font.family.toLowerCase())).map(fontFaceCss).join('')
}

/** Rules for every bundled family, fetched by the client for live previews. */
export function allBundledFontFaceCss() {
  return BUNDLED_FONTS.map(fontFaceCss).join('')
}

/** Preset payload for the client: wallpaper data URLs, font metadata only. */
export function presetPayload() {
  return {
    ok: true,
    fonts: BUNDLED_FONTS.map(({ family, label, note }) => ({ family, label, note })),
    wallpapers: BUNDLED_WALLPAPERS.map(({ id, name, label, file }) => ({
      id, name, label,
      data: bundledDataUrl(file),
    })),
  }
}
