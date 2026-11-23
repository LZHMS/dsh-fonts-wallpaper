// @zhaulee/dsh-fonts-wallpaper — Host half: config schema, persistence, local font list route.
import Schema from '@deepseek-ai/schemastery'
import {
  CONFIG_FIELDS, DEFAULTS, buildFontCss, buildWallpaperCss, listInstalledFonts,
  normalizeConfig, unwrapConfig, bootStyleTag, wallpaperStyleTag,
} from './fonts.js'
import { presetPayload, allBundledFontFaceCss } from './presets.js'

const ROUTE_CONFIG = '/api/dsh-fonts-wallpaper/config'
const ROUTE_FONTS = '/api/dsh-fonts-wallpaper/fonts'
const ROUTE_PRESETS = '/api/dsh-fonts-wallpaper/presets'
const ROUTE_FACE = '/api/dsh-fonts-wallpaper/font-face'
const ROUTE_PING = '/api/dsh-fonts-wallpaper/ping'
const PLUGIN_VERSION = '1.2.0'

/** `.volatile()` exists on DSH ≥ 0.1.7 schemastery; plain fields still work. */
function live(field) {
  const volatile = field.volatile
  return typeof volatile === 'function' ? volatile.call(field) : field
}

/** Hard dependencies: without these the plugin cannot serve its panel or save. */
export const inject = ['webServer', 'configEditor']

export const Config = Schema.object({
  enabled: live(Schema.boolean().default(true).description('字体插件总开关：关闭后界面回到 DSH 内置字体栈')),
  uiLatin: live(Schema.string().default('').description('界面西文字体：逗号分隔的字体名列表，空值使用内置栈')),
  uiCjk: live(Schema.string().default('').description('界面中文字体：排在西文之后，只影响中日韩字形')),
  chatLatin: live(Schema.string().default('').description('对话区西文字体：只作用于会话正文、工具卡片与用户气泡')),
  chatCjk: live(Schema.string().default('').description('对话区中文字体：空值时对话区跟随界面字体')),
  codeLatin: live(Schema.string().default('').description('代码字体：代码块、行内代码等等宽文本')),
  codeCjk: live(Schema.string().default('').description('代码中文字体：空值时使用内置等宽栈的中文后备')),
  chatComposer: live(Schema.boolean().default(true).description('输入框跟随对话字体：关闭后输入框使用界面字体')),
  brandFollowUi: live(Schema.boolean().default(false).description('品牌字标（Montserrat）跟随界面西文字体')),
  terminalFollowCode: live(Schema.boolean().default(false).description('侧栏终端跟随代码字体')),
  wallpaperEnabled: live(Schema.boolean().default(false).description('全局壁纸总开关：开启后在界面背景之后显示壁纸')),
  wallpaperMode: live(Schema.string().default('file').description('壁纸来源：file 本地图片，url 网络地址')),
  wallpaperUrl: live(Schema.string().default('').description('壁纸网络地址（url 模式使用，支持 http/https 或 data:image）')),
  wallpaperData: live(Schema.string().default('').description('本地图片 data URL（file 模式使用，客户端压缩为 ≤2000px JPEG 后随配置保存）')),
  wallpaperOpacity: live(Schema.number().default(60).description('壁纸不透明度 0-100，越小越接近原界面背景')),
})

function sendJson(res, code, value) {
  const body = JSON.stringify(value)
  res.statusCode = code
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(body)
}

async function readBody(req, limit = 64 * 1024) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) throw new Error('body too large')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export function apply(ctx, config) {
  const entry = ctx.fiber?.entry
  const editor = ctx.get('configEditor')
  const web = ctx.get('webServer')
  const connection = ctx.get('connection')

  const current = () => normalizeConfig(unwrapConfig(config))

  // Paint the saved fonts and wallpaper into the served document before any app
  // script runs. Two separate tags: the wallpaper tag carries the image data
  // URL and is removed by the client when the wallpaper is disabled.
  if (web !== undefined && typeof web.tapIndex === 'function') {
    ctx.effect(() => web.tapIndex(html => {
      const cfg = current()
      const fontTag = bootStyleTag(buildFontCss(cfg))
      const wallpaperTag = wallpaperStyleTag(buildWallpaperCss(cfg))
      if (!fontTag && !wallpaperTag) return html
      if (!html.includes('</head>')) return html
      return html.replace('</head>', `${fontTag}${wallpaperTag}</head>`)
    }), 'dsh-fonts-wallpaper: pre-paint font and wallpaper style')
  }

  if (web === undefined) {
    ctx.logger?.warn?.('dsh-fonts-wallpaper: no webServer carrier, the font panel and the font list are unavailable')
    return
  }

  // Warm the font cache so the first panel open is instant, and keep the last
  // count for the liveness route.
  let lastFontCount = null
  ctx.effect(() => {
    let disposed = false
    listInstalledFonts({ refresh: true })
      .then(payload => { if (!disposed) lastFontCount = payload.fonts.length })
      .catch(error => ctx.logger?.warn?.('dsh-fonts-wallpaper: font scan failed: %s', String(error?.message ?? error)))
    return () => { disposed = true }
  }, 'dsh-fonts-wallpaper: warm font cache')

  // Liveness probe: no font data, so it answers without a Session. It exists so
  // a broken composition shows up as a fact instead of a guessed diagnosis.
  ctx.effect(() => web.register({
    kind: 'exact',
    path: ROUTE_PING,
    handler: async (req, res) => {
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, code: 'method-not-allowed', message: 'GET only' })
        return
      }
      sendJson(res, 200, {
        ok: true,
        plugin: '@zhaulee/dsh-fonts-wallpaper',
        version: PLUGIN_VERSION,
        platform: process.platform,
        routes: [ROUTE_CONFIG, ROUTE_FONTS, ROUTE_PRESETS],
        fonts: lastFontCount,
      })
    },
  }), `dsh-fonts-wallpaper: GET ${ROUTE_PING}`)

  /** Answer an unauthenticated request; true when it was rejected. */
  const rejected = (req, res) => {
    if (connection === undefined) return false
    const rejection = connection.requestRejection?.(req)
    if (rejection === undefined) return false
    sendJson(res, rejection, { ok: false, code: 'unauthenticated', message: 'reopen the URL printed by dsh web' })
    return true
  }

  ctx.effect(() => web.register({
    kind: 'exact',
    path: ROUTE_CONFIG,
    handler: async (req, res) => {
      if (rejected(req, res)) return
      if (req.method === 'GET') {
        const cfg = current()
        sendJson(res, 200, { ok: true, config: cfg, css: buildFontCss(cfg), fields: CONFIG_FIELDS, defaults: DEFAULTS })
        return
      }
      if (req.method !== 'POST') {
        sendJson(res, 405, { ok: false, code: 'method-not-allowed', message: 'GET or POST' })
        return
      }
      if (editor === undefined || entry === undefined) {
        sendJson(res, 503, { ok: false, code: 'config-unavailable', message: 'this profile exposes no configEditor; font settings cannot be saved' })
        return
      }
      const essence = String(req.headers?.['content-type'] ?? '').split(';', 1)[0]?.trim().toLowerCase()
      if (essence !== 'application/json') {
        sendJson(res, 415, { ok: false, code: 'unsupported-media-type', message: 'content-type must be application/json' })
        return
      }
      let parsed
      try {
        // The wallpaper data URL rides in this body; the client caps it at
        // ~2 MB of base64, so the 64 KB default is far too small here.
        parsed = JSON.parse(await readBody(req, 8 * 1024 * 1024))
      } catch {
        sendJson(res, 400, { ok: false, code: 'bad-request', message: 'request body is not readable JSON' })
        return
      }
      const incoming = parsed && typeof parsed === 'object' ? (parsed.config && typeof parsed.config === 'object' ? parsed.config : parsed) : {}
      const merged = normalizeConfig({ ...current(), ...incoming })
      try {
        await editor.edit(entry, stored => ({ ...(stored && typeof stored === 'object' ? stored : {}), ...merged }))
      } catch (error) {
        sendJson(res, 500, { ok: false, code: 'save-failed', message: String(error?.message ?? error) })
        return
      }
      sendJson(res, 200, { ok: true, config: merged, css: buildFontCss(merged) })
    },
  }), `dsh-fonts-wallpaper: ${ROUTE_CONFIG}`)

  // Bundled presets: the panel shows these so a fresh machine can pick a nice
  // font and wallpaper without installing anything. Wallpaper bytes ride along
  // as data URLs; font bytes stay on disk until a rule actually needs them.
  let presets = null
  ctx.effect(() => web.register({
    kind: 'exact',
    path: ROUTE_PRESETS,
    handler: async (req, res) => {
      if (rejected(req, res)) return
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, code: 'method-not-allowed', message: 'GET only' })
        return
      }
      if (presets === null) presets = presetPayload()
      sendJson(res, 200, presets)
    },
  }), `dsh-fonts-wallpaper: GET ${ROUTE_PRESETS}`)

  // The @font-face text for bundled families. The client fetches it only once a
  // field actually references one, so the (large) font bytes never travel unless
  // they are used. `src: local(...)` first keeps installed copies in charge.
  let faceCss = null
  ctx.effect(() => web.register({
    kind: 'exact',
    path: ROUTE_FACE,
    handler: async (req, res) => {
      if (rejected(req, res)) return
      if (req.method !== 'GET') {
        sendJson(res, 405, { ok: false, code: 'method-not-allowed', message: 'GET only' })
        return
      }
      if (faceCss === null) faceCss = allBundledFontFaceCss()
      sendJson(res, 200, { ok: true, css: faceCss })
    },
  }), `dsh-fonts-wallpaper: GET ${ROUTE_FACE}`)

  ctx.effect(() => web.register({
    kind: 'exact',
    path: ROUTE_FONTS,
    handler: async (req, res) => {
      if (rejected(req, res)) return
      if (req.method !== 'GET' && req.method !== 'POST') {
        sendJson(res, 405, { ok: false, code: 'method-not-allowed', message: 'GET or POST' })
        return
      }
      let refresh = req.method === 'POST'
      if (!refresh) {
        const url = new URL(String(req.url ?? ROUTE_FONTS), 'http://localhost')
        refresh = url.searchParams.get('refresh') === '1'
      }
      try {
        sendJson(res, 200, await listInstalledFonts({ refresh }))
      } catch (error) {
        sendJson(res, 500, { ok: false, code: 'font-scan-failed', message: String(error?.message ?? error) })
      }
    },
  }), `dsh-fonts-wallpaper: ${ROUTE_FONTS}`)
}
