// @local/dsh-fonts-wallpaper — Host-side helpers: config shape, CSS builder, local font enumeration.
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

/** CSS generic families: quoted names would break generic matching. */
const GENERIC_FAMILIES = new Set([
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
  'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong',
])

/** Style words that follow a family name in a Windows registry face value. */
const STYLE_WORDS = /^(hairline|thin|ultralight|extralight|light|book|regular|normal|medium|semibold|demibold|bold|extrabold|ultrabold|black|heavy|italic|oblique|roman|condensed|extended|compressed|narrow|wide|semi|super|display|text|caption|subhead|titling)$/i

export const CONFIG_FIELDS = [
  'enabled', 'uiLatin', 'uiCjk', 'chatLatin', 'chatCjk', 'codeLatin', 'codeCjk',
  'chatComposer', 'brandFollowUi', 'terminalFollowCode',
  'wallpaperEnabled', 'wallpaperMode', 'wallpaperUrl', 'wallpaperData', 'wallpaperOpacity',
]

export const DEFAULTS = {
  enabled: true,
  uiLatin: '', uiCjk: '',
  chatLatin: '', chatCjk: '',
  codeLatin: '', codeCjk: '',
  chatComposer: true,
  brandFollowUi: false,
  terminalFollowCode: false,
  wallpaperEnabled: false,
  wallpaperMode: 'file',
  wallpaperUrl: '',
  wallpaperData: '',
  wallpaperOpacity: 60,
}

/** Unwrap one cosmokit `Volatile` config field into its plain value. */
function unwrap(value) {
  if (value !== null && typeof value === 'object' && typeof value.get === 'function') return value.get()
  return value
}

/** Turn a live plugin config (volatile fields allowed) into a plain object. */
export function unwrapConfig(config) {
  const out = {}
  for (const field of CONFIG_FIELDS) {
    if (config === undefined || config === null || !(field in config)) continue
    out[field] = unwrap(config[field])
  }
  return out
}

// Per-field string limits. The wallpaper data URL carries the compressed image
// (the client caps it at ~2 MB of base64 text), so the 400-char slice used for
// the font fields must not apply to it.
const FIELD_LIMITS = {
  wallpaperData: 4 * 1024 * 1024,
  wallpaperUrl: 2048,
}
const DEFAULT_LIMIT = 400

/** Validate + clamp an untrusted patch into the full plain config. */
export function normalizeConfig(input) {
  const source = input && typeof input === 'object' ? input : {}
  const out = { ...DEFAULTS }
  for (const field of CONFIG_FIELDS) {
    if (!(field in source)) continue
    const value = unwrap(source[field])
    if (typeof DEFAULTS[field] === 'boolean') {
      if (typeof value === 'boolean') out[field] = value
    } else if (field === 'wallpaperMode') {
      if (value === 'file' || value === 'url') out[field] = value
    } else if (field === 'wallpaperOpacity') {
      const num = typeof value === 'number' ? value : Number(value)
      if (Number.isFinite(num)) out[field] = Math.max(0, Math.min(100, Math.round(num)))
    } else if (typeof value === 'string') {
      if (field === 'wallpaperData' && !/^data:image\/[a-z0-9.+-]+;base64,/i.test(value)) {
        out[field] = ''
      } else if (field === 'wallpaperUrl' && !/^(https?:\/\/|data:image\/)/i.test(value)) {
        out[field] = ''
      } else {
        out[field] = value.slice(0, FIELD_LIMITS[field] ?? DEFAULT_LIMIT)
      }
    }
  }
  return out
}

/** Split a comma-separated family list into clean, safe family names. */
export function familyList(text) {
  if (typeof text !== 'string') return []
  const out = []
  for (const raw of text.split(',')) {
    const name = raw
      .replace(/["'<>\\]/g, '')
      .replace(/[\u0000-\u001f]/g, '')
      .trim()
    if (!name) continue
    if (out.length >= 8) break
    out.push(name)
  }
  return out
}

export function quoteFamily(name) {
  return GENERIC_FAMILIES.has(String(name).toLowerCase()) ? String(name) : `"${name}"`
}

/** Latin first, then CJK: font matching is per glyph, so 西文/中文 split naturally. */
export function fontStack(latin, cjk) {
  const parts = [...familyList(latin), ...familyList(cjk)]
  return parts.map(quoteFamily).join(', ')
}

/**
 * Build the plugin's stylesheet. The host's own `ui-theme` writes the user font
 * lists inline on `body`; an author `!important` declaration in a stylesheet
 * outranks that inline value, so the plugin owns the roles it fills in.
 */
export function buildFontCss(config) {
  const c = normalizeConfig(config)
  if (c.enabled === false) return ''
  const ui = fontStack(c.uiLatin, c.uiCjk)
  const chat = fontStack(c.chatLatin, c.chatCjk)
  const code = fontStack(c.codeLatin, c.codeCjk)

  const bodyRules = []
  if (ui) bodyRules.push(`--dsh-font-family-text: ${ui} !important`)
  if (code) bodyRules.push(`--dsh-font-family-code: ${code} !important`)
  if (code && c.terminalFollowCode) bodyRules.push(`--dsh-font-family-terminal: ${code} !important`)
  if (ui && c.brandFollowUi) bodyRules.push(`--dsw-font-family-brand: ${ui} !important`)

  let css = bodyRules.length > 0 ? `body{${bodyRules.join(';')};}\n` : ''
  if (!chat) return css

  // Conversation scope: the markdown token ladder is computed on body, so a
  // deeper `--dsw-font-family` alone would not reach it. Re-declare the tokens
  // (shorthand and the -font-family longhand) on the transcript seams.
  const scopes = ['[data-slot="conversation.chat.flow"]', '[data-conversation-scroll]']
  if (c.chatComposer !== false) scopes.push('[data-slot="conversation.composer.bar"]', '[data-slot="conversation.input.overlay"]')
  const F = chat
  const d = [
    `--dsw-font-family: ${F}`,
    `--dsw-font-markdown-h1: 700 calc(21px + var(--dsh-content-font-delta)) / calc(30px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-h1-font-family: ${F}`,
    `--dsw-font-markdown-h2: 700 calc(19px + var(--dsh-content-font-delta)) / calc(28px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-h2-font-family: ${F}`,
    `--dsw-font-markdown-h3: 700 calc(18px + var(--dsh-content-font-delta)) / calc(26px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-h3-font-family: ${F}`,
    `--dsw-font-markdown-h4: 600 var(--dsh-content-font-size, 14px) / calc(24px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-h4-font-family: ${F}`,
    `--dsw-font-markdown-base: var(--dsh-content-font-size, 14px) / calc(24px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-base-font-family: ${F}`,
    `--dsw-font-markdown-base-strong: 600 var(--dsh-content-font-size, 14px) / calc(24px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-base-strong-font-family: ${F}`,
    `--dsw-font-markdown-base-italic: italic var(--dsh-content-font-size, 14px) / calc(24px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-base-italic-font-family: ${F}`,
    `--dsw-font-markdown-base-strong-italic: italic 600 var(--dsh-content-font-size, 14px) / calc(24px + var(--dsh-content-font-delta)) ${F}`,
    `--dsw-font-markdown-base-strong-italic-font-family: ${F}`,
    `--dsw-font-markdown-table: var(--dsh-content-font-size-secondary, 13px)/calc(22px + var(--dsh-content-font-delta-secondary, 0px)) ${F}`,
    `--dsw-font-markdown-table-font-family: ${F}`,
    `--dsw-font-markdown-table-head: 500 var(--dsh-content-font-size-secondary, 13px)/calc(22px + var(--dsh-content-font-delta-secondary, 0px)) ${F}`,
    `--dsw-font-markdown-table-head-font-family: ${F}`,
    `--dsw-font-markdown-small: 12px/20px ${F}`,
    `--dsw-font-markdown-small-font-family: ${F}`,
    `--dsw-font-markdown-small-strong: 600 12px/20px ${F}`,
    `--dsw-font-markdown-small-strong-font-family: ${F}`,
    `--dsw-font-markdown-small-italic: italic 12px/20px ${F}`,
    `--dsw-font-markdown-small-italic-font-family: ${F}`,
    `--dsw-font-markdown-small-strong-italic: italic 600 12px/20px ${F}`,
    `--dsw-font-markdown-small-strong-italic-font-family: ${F}`,
  ]
  if (code) {
    d.push(
      `--ds-font-family-code: ${code}`,
      `--dsh-font-family-code: ${code}`,
      `--dsw-font-markdown-code: calc(12px + var(--dsh-code-font-delta)) / calc(19px + var(--dsh-code-font-delta)) ${code}`,
      `--dsw-font-markdown-code-font-family: ${code}`,
      `--dsw-font-markdown-code-block: var(--dsh-code-font-size, 11px) / calc(19px + var(--dsh-code-font-delta)) ${code}`,
      `--dsw-font-markdown-code-block-font-family: ${code}`,
      `--dsw-font-markdown-code-block-small: var(--dsh-code-font-size, 11px) / calc(16px + var(--dsh-code-font-delta)) ${code}`,
      `--dsw-font-markdown-code-block-small-font-family: ${code}`,
    )
  }
  return `${css}${scopes.join(', ')}{${d.join(';')};}\n`
}

/** Pre-paint injection: one style tag inside <head>, before any app script. */
export function bootStyleTag(css) {
  if (!css) return ''
  const safe = css.replace(/<\/(style|script)/gi, '<\\/$1')
  return `<style id="dsh-fonts-boot">${safe}</style>`
}

// ----------------------------------------------------------------- wallpaper

/** Escape a URL for embedding inside a quoted CSS `url("…")` string. */
export function cssUrlEscape(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/[\u0000-\u001f]/g, '')
}

/**
 * The wallpaper layer rides on `#root::before`, fixed behind the AppFrame.
 * Transparency works at two levels (hashed CSS-module classes, so no
 * class-name selectors are possible):
 *  1. Token overrides on html/body/#root — every panel that paints a
 *     surface through a theme token becomes see-through at any depth:
 *     `--dsw-alias-bg-base` (page base, frame columns, bottom row,
 *     conversation root, composer top fade),
 *     `--dsw-specific-sidebar-fill` (sidebar column, sidebar root, Windows
 *     titlebar strip, sidebar scroll fade),
 *     `--dsw-alias-bg-layer-1` + `--dsw-alias-card-fill` (deliverables
 *     "changed files" card body and header).
 *     `!important` beats the body-scoped light/dark theme definitions and
 *     any inline theme projection.
 *  2. Structural backstops for literal fills: the frame and its columns
 *     (`#root > *`, `#root > * > *`), the Windows titlebar strip
 *     (`#root > *::before`), and the conversation root (the only element
 *     hosting the `conversation.header` slot directly).
 * Kept opaque on purpose: code blocks, inputs/textareas, images, menus,
 * popovers and modals — surfaces that need contrast for readability.
 */
export const WALLPAPER_CSS = `html,body,#root{background:transparent !important;}
html,body,#root{--dsw-alias-bg-base:transparent !important;--dsw-alias-bg-layer-1:transparent !important;--dsw-specific-sidebar-fill:transparent !important;--dsw-alias-card-fill:transparent !important;}
#root::before{content:"";position:fixed;inset:0;background-image:var(--dsh-wp-image);background-size:cover;background-position:center;background-repeat:no-repeat;opacity:var(--dsh-wp-opacity,0.6);pointer-events:none;}
#root>*,#root>*::before{background-color:transparent !important;}
#root>*>*{background-color:transparent !important;background-image:none !important;}
#root :has(> [data-slot="conversation.header"]){background-color:transparent !important;}
.dshf-page{background:transparent !important;}
`

/**
 * Build the wallpaper stylesheet: the `:root` variables carrying the image and
 * opacity, plus the static layer. Returns '' when no wallpaper is active.
 */
export function buildWallpaperCss(config) {
  const c = normalizeConfig(config)
  const image = c.wallpaperMode === 'url' ? c.wallpaperUrl : c.wallpaperData
  if (c.wallpaperEnabled !== true || !image) return ''
  const opacity = Math.max(0, Math.min(100, Number(c.wallpaperOpacity) || 0)) / 100
  return `:root{--dsh-wp-image:url("${cssUrlEscape(image)}");--dsh-wp-opacity:${opacity};}\n${WALLPAPER_CSS}`
}

/**
 * Pre-paint wallpaper tag, separate from the fonts boot tag so the client can
 * remove exactly the wallpaper when it is disabled.
 */
export function wallpaperStyleTag(css) {
  if (!css) return ''
  const safe = css.replace(/<\/(style|script)/gi, '<\\/$1')
  return `<style id="dsh-fonts-wallpaper">${safe}</style>`
}

// ---------------------------------------------------------------- local fonts

const REG_KEYS = [
  ['HKLM', 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts'],
  ['HKCU', 'HKCU\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts'],
]

function regQuery(key) {
  return new Promise(resolve => {
    execFile('reg.exe', ['query', key], { windowsHide: true, timeout: 8000, maxBuffer: 16 * 1024 * 1024, encoding: 'buffer' }, (error, stdout) => {
      if (error || !stdout) {
        resolve({ ok: false, families: [], note: error ? String(error.message ?? error).slice(0, 160) : 'empty' })
        return
      }
      const families = new Set()
      for (const line of decodeConsoleOutput(stdout).split(/\r?\n/)) {
        // `reg query` prints  <value name>  REG_SZ  <font file path>.
        const match = line.match(/^\s+(.+?)\s+REG_(?:SZ|MULTI_SZ)\s+(.+?)\s*$/)
        if (!match) continue
        for (const family of familiesFromFace(match[1])) families.add(family)
      }
      resolve({ ok: true, families: [...families] })
    })
  })
}

/**
 * reg.exe writes the console codepage, not UTF-8: on a zh-CN machine that is
 * cp936, so a UTF-8 read mangles every Chinese family name. Try UTF-8 first,
 * then the ANSI/OEM legacy decoders when ICU provides them.
 */
function decodeConsoleOutput(buffer) {
  const utf8 = new TextDecoder('utf-8', { fatal: false }).decode(buffer)
  if (!utf8.includes('\uFFFD')) return utf8
  for (const encoding of ['gb18030', 'cp936', 'ms936', 'windows-1252']) {
    try {
      const text = new TextDecoder(encoding, { fatal: false }).decode(buffer)
      if (!text.includes('\uFFFD')) return text
    } catch { /* this ICU build has no legacy decoder for that encoding */ }
  }
  return utf8
}

/** "Segoe UI Bold Italic (TrueType)" → "Segoe UI Bold Italic" + "Segoe UI". */
function familiesFromFace(value) {
  const base = String(value)
    .replace(/\.(ttf|otf|ttc|otc)$/i, '')
    .replace(/\s*\((?:TrueType|OpenType|Type 1|TrueType \(Type 1\))\)\s*$/i, '')
    .trim()
  const out = []
  if (base) out.push(base)
  // One registry row can name two families: "Microsoft YaHei & Microsoft YaHei UI".
  if (base.includes('&')) {
    for (const half of base.split('&')) {
      const part = half.trim()
      if (part) out.push(part)
    }
  }
  const stripped = base.split(/\s+/).filter(word => !STYLE_WORDS.test(word)).join(' ').trim()
  if (stripped && stripped !== base) out.push(stripped)
  return out.filter(isPlausibleFamily)
}

/** Keep real family names and drop mojibake from partially parsed name tables. */
function isPlausibleFamily(name) {
  const text = String(name ?? '').trim()
  if (text.length < 2 || text.length > 64) return false
  if (/[\\/:*?"<>|\u0000-\u001f]/.test(text)) return false
  if (!/^[\p{L}\p{N}]/u.test(text)) return false
  return /^[\p{L}\p{N} .+()-]+$/u.test(text)
}

function fontDirectories() {
  const home = os.homedir()
  if (process.platform === 'win32') {
    const win = process.env.SystemRoot ?? 'C:\\Windows'
    const local = process.env.LOCALAPPDATA ?? path.join(home, 'AppData', 'Local')
    return [path.join(win, 'Fonts'), path.join(local, 'Microsoft', 'Windows', 'Fonts')]
  }
  if (process.platform === 'darwin') {
    return ['/System/Library/Fonts', '/Library/Fonts', path.join(home, 'Library', 'Fonts')]
  }
  return ['/usr/share/fonts', '/usr/local/share/fonts', path.join(home, '.fonts'), path.join(home, '.local', 'share', 'fonts')]
}

/** The `name` table stores Windows-platform strings as UTF-16BE. */
function decodeUtf16BE(buffer, from, length) {
  const swapped = Buffer.allocUnsafe(length)
  for (let i = 0; i + 1 < length; i += 2) {
    swapped[i] = buffer[from + i + 1]
    swapped[i + 1] = buffer[from + i]
  }
  return swapped.toString('utf16le')
}

/** Read the `name` table of one sfnt (TTF/OTF, or one face of a TTC). */
function namesOfSfnt(buffer, start) {
  try {
    const numTables = buffer.readUInt16BE(start + 4)
    let nameOffset = -1
    let nameLength = 0
    for (let i = 0; i < numTables; i += 1) {
      const record = start + 12 + i * 16
      if (record + 16 > buffer.length) return []
      const tag = buffer.toString('latin1', record, record + 4)
      if (tag === 'name') {
        nameOffset = buffer.readUInt32BE(record + 8)
        nameLength = buffer.readUInt32BE(record + 12)
      }
    }
    if (nameOffset < 0 || nameOffset + nameLength > buffer.length) return []
    const count = buffer.readUInt16BE(nameOffset + 2)
    const stringOffset = buffer.readUInt16BE(nameOffset + 4)
    // Family (1), full name (4), typographic family (16). Only English and the
    // CJK UI languages are kept: every other language's localized record
    // would add noise such as "Arial Black Standaard".
    const wanted = new Set([1, 4, 16])
    const wantedLanguages = new Set([1033, 2052, 1028, 3076, 1041, 1042])
    const out = new Set()
    for (let i = 0; i < count; i += 1) {
      const record = nameOffset + 6 + i * 12
      if (record + 12 > buffer.length) break
      const platform = buffer.readUInt16BE(record)
      const encoding = buffer.readUInt16BE(record + 2)
      const language = buffer.readUInt16BE(record + 4)
      const id = buffer.readUInt16BE(record + 6)
      const length = buffer.readUInt16BE(record + 8)
      const offset = buffer.readUInt16BE(record + 10)
      if (!wanted.has(id) || length === 0) continue
      if ((platform === 3 || platform === 0) && !wantedLanguages.has(language)) continue
      const from = nameOffset + stringOffset + offset
      if (from + length > buffer.length) continue
      let text
      if (platform === 3 || platform === 0) text = decodeUtf16BE(buffer, from, length)
      else if (platform === 1) text = buffer.toString('latin1', from, from + length)
      else text = buffer.toString('utf8', from, from + length)
      text = text.replace(/[\u0000-\u001f\u007f\uFFFD]/g, ' ').replace(/\s+/g, ' ').trim()
      if (isPlausibleFamily(text)) out.add(text)
    }
    return [...out]
  } catch {
    return []
  }
}

function scanFontFile(file) {
  try {
    const stat = fs.statSync(file)
    if (stat.size > 64 * 1024 * 1024) return []
    const buffer = fs.readFileSync(file)
    if (buffer.toString('latin1', 0, 4) === 'ttcf') {
      const count = buffer.readUInt32BE(8)
      const out = []
      for (let i = 0; i < count; i += 1) out.push(...namesOfSfnt(buffer, buffer.readUInt32BE(12 + i * 4)))
      return out
    }
    return namesOfSfnt(buffer, 0)
  } catch {
    return []
  }
}

function scanFontDirectory(dir, families) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return false }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) { scanFontDirectory(full, families); continue }
    if (!/\.(ttf|otf|ttc|otc)$/i.test(entry.name)) continue
    for (const name of scanFontFile(full)) families.add(name)
  }
  return true
}

let cache = { at: 0, payload: null }

/** Enumerate this machine's installed font families (registry + font folders). */
export async function listInstalledFonts({ refresh = false, ttlMs = 60_000 } = {}) {
  const now = Date.now()
  if (!refresh && cache.payload && now - cache.at < ttlMs) return cache.payload

  const families = new Set()
  const sources = []
  if (process.platform === 'win32') {
    for (const [label, key] of REG_KEYS) {
      const result = await regQuery(key)
      sources.push({ kind: 'registry', key: label, ok: result.ok, count: result.families.length, ...(result.note ? { note: result.note } : {}) })
      for (const family of result.families) families.add(family)
    }
  }
  for (const dir of fontDirectories()) {
    const found = new Set()
    const read = scanFontDirectory(dir, found)
    sources.push({ kind: 'directory', path: dir, ok: read, count: found.size })
    for (const family of found) families.add(family)
  }

  // Case-insensitive dedupe: the registry spelling is seen first and wins.
  const seen = new Map()
  for (const family of families) {
    const key = family.toLowerCase()
    if (!seen.has(key)) seen.set(key, family)
  }

  const payload = {
    ok: true,
    platform: process.platform,
    generatedAt: new Date(now).toISOString(),
    sources,
    fonts: [...seen.values()]
      .filter(name => name.length <= 96)
      .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })),
  }
  cache = { at: now, payload }
  return payload
}
