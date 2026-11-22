// @local/dsh-fonts-wallpaper — Client half: font panel, sidebar entry, live stylesheet.
window.__ModuleLoader__.load({
  id: '@local/dsh-fonts-wallpaper',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useMemo, useRef, useState } = React

    const PANEL_ID = 'fonts'
    const LOCALE_NS = 'dsh-fonts-wallpaper'
    const ROUTE_CONFIG = '/api/dsh-fonts-wallpaper/config'
    const ROUTE_FONTS = '/api/dsh-fonts-wallpaper/fonts'
    const ROUTE_PRESETS = '/api/dsh-fonts-wallpaper/presets'
    const ROUTE_FACE = '/api/dsh-fonts-wallpaper/font-face'
    const ROUTE_PING = '/api/dsh-fonts-wallpaper/ping'

    const DICT = {
      zh: {
        panel: '字体与壁纸',
        title: '字体与壁纸',
        subtitle: '分别为界面、对话与代码设置西文和中文字体，可直接从本机已安装字体中选择。',
        enabled: '启用自定义字体',
        enabledOn: '自定义字体已启用',
        enabledOff: '自定义字体已关闭，界面使用内置字体栈',
        groupUi: '界面字体',
        groupUiHint: '侧栏、按钮、菜单、标题等所有界面文字。',
        groupChat: '对话字体',
        groupChatHint: '只作用于会话正文、用户气泡与工具卡片；留空则跟随界面字体。',
        groupCode: '代码字体',
        groupCodeHint: '代码块、行内代码与等宽文本；与界面字体互不影响。',
        latin: '西文',
        cjk: '中文',
        pick: '选择字体',
        chatComposer: '输入框跟随对话字体',
        brandFollowUi: '品牌字标跟随界面字体',
        terminalFollowCode: '侧栏终端跟随代码字体',
        save: '保存',
        saved: '已保存',
        saving: '保存中…',
        reset: '清空并恢复内置字体',
        dirty: '有未保存的修改',
        previewText: '永字八法 ABCDEFG abcdefg 0123456789',
        preview: '预览',
        pickerHint: '左侧是字体名称，右侧是该字体的实际效果',
        pickerMore: '另有 {count} 个未显示',
        pickerTitle: '本机已安装字体',
        pickerSearch: '搜索字体名…',
        pickerRefresh: '重新扫描',
        pickerEmpty: '没有匹配的字体',
        pickerLoading: '正在读取本机字体…',
        pickerCount: '本机字体 {count} 个',
        close: '关闭',
        offline: '无法读取字体配置：本机字体服务未响应（刷新页面或重启 DSH 后重试）。',
        loadFailed: '读取字体配置失败：{message}',
        saveFailed: '保存失败：{message}',
        scanFailed: '读取本机字体失败：{message}',
        note: '插件启用期间会覆盖「设置 → 常规 → 字体」中的字体输入框；字号设置仍然有效。',
        groupWallpaper: '全局壁纸',
        groupWallpaperHint: '在界面背景之后显示一张壁纸：侧栏、会话区、文件卡片与底部区域都会透出；代码块、输入框与弹出层保持不透明以保证可读性。',
        wallpaperEnabled: '启用全局壁纸',
        wallpaperMode: '壁纸来源',
        wallpaperModeFile: '本地图片',
        wallpaperModeUrl: '网络地址',
        wallpaperChoose: '选择图片…',
        wallpaperUrlPh: 'https://example.com/wallpaper.jpg 或 data:image/…',
        wallpaperOpacity: '不透明度',
        wallpaperRemove: '移除壁纸',
        wallpaperProcessing: '正在压缩图片…',
        wallpaperTooLarge: '图片压缩后仍超过 2 MB，请换一张较小的图片。',
        wallpaperDecodeFailed: '无法读取该图片，请换一张格式正确的图片。',
        wallpaperLocal: '本地图片',
        wallpaperPresets: '内置壁纸',
        bundledFonts: '内置字体',
        wallpaperNote: '本地图片会压缩为最长边 2000px 的 JPEG 并随配置保存；网络地址在每次加载页面时重新获取。',
      },
      en: {
        panel: 'Fonts & wallpaper',
        title: 'Fonts & wallpaper',
        subtitle: 'Set Latin and CJK fonts separately for the interface, the conversation, and code, picked from the fonts installed on this machine.',
        enabled: 'Enable custom fonts',
        enabledOn: 'Custom fonts are on',
        enabledOff: 'Custom fonts are off; the built-in stacks are used',
        groupUi: 'Interface font',
        groupUiHint: 'Every interface label: sidebar, buttons, menus, headings.',
        groupChat: 'Conversation font',
        groupChatHint: 'Transcript, user bubbles and tool cards only; empty follows the interface font.',
        groupCode: 'Code font',
        groupCodeHint: 'Code blocks, inline code and monospaced text, independent of the interface.',
        latin: 'Latin',
        cjk: 'CJK',
        pick: 'Choose',
        chatComposer: 'Composer follows the conversation font',
        brandFollowUi: 'Brand mark follows the interface font',
        terminalFollowCode: 'Sidebar terminal follows the code font',
        save: 'Save',
        saved: 'Saved',
        saving: 'Saving…',
        reset: 'Clear and restore built-in fonts',
        dirty: 'Unsaved changes',
        previewText: '永字八法 ABCDEFG abcdefg 0123456789',
        preview: 'Preview',
        pickerHint: 'Name on the left, that font rendered for real on the right',
        pickerMore: '{count} more not shown',
        pickerTitle: 'Fonts installed on this machine',
        pickerSearch: 'Search font name…',
        pickerRefresh: 'Rescan',
        pickerEmpty: 'No matching fonts',
        pickerLoading: 'Reading local fonts…',
        pickerCount: '{count} fonts on this machine',
        close: 'Close',
        offline: 'Font settings are unavailable: the local font service did not answer (reload the page or restart DSH).',
        loadFailed: 'Could not read font settings: {message}',
        saveFailed: 'Save failed: {message}',
        scanFailed: 'Could not read local fonts: {message}',
        note: 'While this plugin is enabled it overrides the font fields in Settings → General → Fonts; the font-size settings still apply.',
        groupWallpaper: 'Global wallpaper',
        groupWallpaperHint: 'Shows a wallpaper image behind the whole interface: the sidebar, the conversation area, the file cards and the bottom row all reveal it, while code blocks, inputs and popovers stay opaque for readability.',
        wallpaperEnabled: 'Enable global wallpaper',
        wallpaperMode: 'Wallpaper source',
        wallpaperModeFile: 'Local image',
        wallpaperModeUrl: 'Web address',
        wallpaperChoose: 'Choose image…',
        wallpaperUrlPh: 'https://example.com/wallpaper.jpg or data:image/…',
        wallpaperOpacity: 'Opacity',
        wallpaperRemove: 'Remove wallpaper',
        wallpaperProcessing: 'Compressing image…',
        wallpaperTooLarge: 'The image is still over 2 MB after compression; choose a smaller one.',
        wallpaperDecodeFailed: 'This image could not be read; choose a valid image file.',
        wallpaperLocal: 'Local image',
        wallpaperPresets: 'Bundled wallpapers',
        bundledFonts: 'Bundled fonts',
        wallpaperNote: 'Local images are compressed to a JPEG with a 2000 px longest edge and stored with the config; web addresses are refetched on every page load.',
      },
    }

    const DEFAULTS = {
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

    // --- CSS builder: mirrors fonts.js so a saved stack paints without a round trip.
    const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong'])
    const quote = name => (GENERIC.has(String(name).toLowerCase()) ? String(name) : `"${name}"`)
    function familyList(text) {
      if (typeof text !== 'string') return []
      const out = []
      for (const raw of text.split(',')) {
        const name = raw.replace(/["'<>\\]/g, '').replace(/[\u0000-\u001f]/g, '').trim()
        if (name && out.length < 8) out.push(name)
      }
      return out
    }
    function stack(latin, cjk) {
      return [...familyList(latin), ...familyList(cjk)].map(quote).join(', ')
    }
    function buildCss(c) {
      const cfg = { ...DEFAULTS, ...(c ?? {}) }
      if (cfg.enabled === false) return ''
      const ui = stack(cfg.uiLatin, cfg.uiCjk)
      const chat = stack(cfg.chatLatin, cfg.chatCjk)
      const code = stack(cfg.codeLatin, cfg.codeCjk)
      const body = []
      if (ui) body.push(`--dsh-font-family-text: ${ui} !important`)
      if (code) body.push(`--dsh-font-family-code: ${code} !important`)
      if (code && cfg.terminalFollowCode) body.push(`--dsh-font-family-terminal: ${code} !important`)
      if (ui && cfg.brandFollowUi) body.push(`--dsw-font-family-brand: ${ui} !important`)
      let css = body.length > 0 ? `body{${body.join(';')};}\n` : ''
      if (!chat) return css
      const scopes = ['[data-slot="conversation.chat.flow"]', '[data-conversation-scroll]']
      if (cfg.chatComposer !== false) scopes.push('[data-slot="conversation.composer.bar"]', '[data-slot="conversation.input.overlay"]')
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

    // --- bundled presets: mirrors presets.js. The harness compares
    // FONT_FACE_TEMPLATE between the two halves.
    const FONT_FACE_TEMPLATE = '@font-face{font-family:"{family}";font-style:normal;font-weight:400;font-display:swap;src:{src};}'
    const BUNDLED_FAMILIES = ['Dsh Builtin CJK']
    const FONT_FIELDS = ['uiLatin', 'uiCjk', 'chatLatin', 'chatCjk', 'codeLatin', 'codeCjk']
    const usesBundledFamily = c => BUNDLED_FAMILIES.some(family =>
      FONT_FIELDS.some(field => String(c?.[field] ?? '').includes(family)))

    // --- wallpaper: mirrors the host WALLPAPER_CSS so live edits need no round trip.
    const cssUrlEscape = text => String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\u0000-\u001f]/g, '')
    const WALLPAPER_CSS = `html,body,#root{background:transparent !important;}
html,body,#root{--dsw-alias-bg-base:transparent !important;--dsw-alias-bg-layer-1:transparent !important;--dsw-specific-sidebar-fill:transparent !important;--dsw-alias-card-fill:transparent !important;}
#root::before{content:"";position:fixed;inset:0;background-image:var(--dsh-wp-image);background-size:cover;background-position:center;background-repeat:no-repeat;opacity:var(--dsh-wp-opacity,0.6);pointer-events:none;}
#root>*,#root>*::before{background-color:transparent !important;}
#root>*>*{background-color:transparent !important;background-image:none !important;}
#root :has(> [data-slot="conversation.header"]){background-color:transparent !important;}
.dshf-page{background:transparent !important;}
`
    function wallpaperImage(c) {
      if (!c) return ''
      const value = c.wallpaperMode === 'url' ? c.wallpaperUrl : c.wallpaperData
      return typeof value === 'string' && value ? value : ''
    }

    // Local images are downscaled (longest edge 2000 px, white-filled JPEG) and
    // re-encoded until they fit under ~2 MB of base64 text, so the config patch
    // that stores them stays a reasonable size.
    const WP_MAX_EDGE = 2000
    const WP_MAX_CHARS = 2_000_000
    function encodeWallpaper(file) {
      return new Promise((resolve, reject) => {
        if (!file || !String(file.type ?? '').startsWith('image/')) { reject(new Error('not-image')); return }
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
          try {
            const width = img.naturalWidth || img.width
            const height = img.naturalHeight || img.height
            if (!width || !height) throw new Error('decode-failed')
            const canvas = document.createElement('canvas')
            let scale = Math.min(1, WP_MAX_EDGE / Math.max(width, height))
            const paint = () => {
              canvas.width = Math.max(1, Math.round(width * scale))
              canvas.height = Math.max(1, Math.round(height * scale))
              const context = canvas.getContext('2d')
              context.fillStyle = '#ffffff'
              context.fillRect(0, 0, canvas.width, canvas.height)
              context.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
            paint()
            let data = canvas.toDataURL('image/jpeg', 0.82)
            let guard = 0
            while (data.length > WP_MAX_CHARS && guard < 4) { paint(); data = canvas.toDataURL('image/jpeg', 0.82); guard += 1 }
            if (data.length > WP_MAX_CHARS) throw new Error('image-too-large')
            resolve(data)
          } catch (error) {
            reject(new Error(error && error.message === 'image-too-large' ? 'image-too-large' : 'decode-failed'))
          } finally {
            URL.revokeObjectURL(url)
          }
        }
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode-failed')) }
        img.src = url
      })
    }

    // --- panel stylesheet, removed with the plugin run
    const PANEL_CSS = `
.dshf-page { display: flex; flex: 1; flex-direction: column; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: 14px; line-height: 1.6; }
.dshf-scroll { flex: 1; min-height: 0; overflow: auto; scrollbar-gutter: stable; --dsh-scrollbar-width: 9px; --dsh-scrollbar-thumb-border: 2px; }
.dshf-content { max-width: 960px; margin: 0 auto; padding: 0 clamp(24px, 4vw, 48px) 48px; }
.dshf-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px; padding-top: 28px; margin-bottom: 20px; }
[data-platform='darwin'] .dshf-head { padding-top: calc(28px + var(--dsh-frame-top-clearance, 0px)); }
.dshf-head h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 500; }
.dshf-sub { margin: 6px 0 0; max-width: 56ch; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.dshf-card { margin-bottom: 16px; padding: 4px 18px 14px; border: 0.5px solid var(--dsw-alias-settings-card-stroke, var(--dsw-alias-border-l1)); border-radius: var(--dsw-radius-md); background: var(--dsw-alias-settings-card-fill, var(--dsw-alias-bg-layer-2)); }
.dshf-cardTitle { padding: 14px 0 2px; font-size: 15px; font-weight: 600; }
.dshf-cardHint { padding-bottom: 4px; color: var(--dsw-alias-label-secondary); font-size: 12.5px; }
.dshf-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 10px 0; border-top: 0.5px solid var(--dsw-alias-border-l1); }
.dshf-rowTop { display: flex; gap: 10px; align-items: center; min-width: 0; }
.dshf-tag { flex: none; padding: 2px 8px; border-radius: 999px; font-size: 11.5px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1); border: 0.5px solid var(--dsw-alias-border-l1); }
.dshf-input { box-sizing: border-box; width: 100%; min-width: 0; padding: 8px 11px; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-bg-layer-1); color: inherit; font-size: 14px; outline: none; }
.dshf-input:focus-visible { border-color: var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary)); box-shadow: 0 0 0 var(--dsw-focus-ring-width, 2px) color-mix(in srgb, var(--dsw-focus-ring-color, #4176e6) 28%, transparent); }
.dshf-previewRow { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 10px; }
.dshf-previewTag { flex: none; font-size: 11.5px; color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); }
.dshf-preview { color: var(--dsw-alias-label-secondary); font-size: 15px; line-height: 22px; overflow-wrap: anywhere; }
.dshf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 13px; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-bg-layer-1); color: inherit; font: inherit; font-size: 13px; cursor: pointer; }
.dshf-btn:hover { background: var(--dsw-alias-interactive-hover, var(--dsw-alias-bg-layer-3)); }
.dshf-btn:disabled { opacity: 0.55; cursor: default; }
.dshf-btnPrimary { border-color: transparent; background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-on-color, #fff); font-weight: 500; }
.dshf-btnPrimary:hover { background: var(--dsw-alias-brand-primary); filter: brightness(1.06); }
body[data-ds-dark-theme] .dshf-btnPrimary { background: var(--dsw-alias-bg-layer-3); border-color: var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); }
body[data-ds-dark-theme] .dshf-btnPrimary:hover { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); }
.dshf-switchRow { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 0 4px; }
.dshf-switch { position: relative; flex: none; width: 40px; height: 22px; padding: 0; border: 0; border-radius: 999px; background: var(--dsw-alias-border-l2); cursor: pointer; transition: background 0.2s; }
.dshf-switch[aria-checked="true"] { background: var(--dsw-alias-brand-primary); }
.dshf-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--dsw-alias-switch-thumb, #fff); transition: transform 0.2s; }
.dshf-switch[aria-checked="true"]::after { transform: translateX(18px); }
.dshf-check { display: inline-flex; align-items: center; gap: 8px; padding: 6px 0; color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; }
.dshf-status { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; color: var(--dsw-alias-label-secondary); font-size: 12.5px; }
.dshf-statusError { color: var(--dsw-alias-state-error-primary); }
.dshf-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 4px 0 24px; }
.dshf-note { margin: 0 0 24px; color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); font-size: 12.5px; }
.dshf-backdrop { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; background: var(--dsw-alias-bg-mask-drop, rgba(0, 0, 0, 0.45)); }
.dshf-modal { display: flex; flex-direction: column; width: min(620px, 96vw); max-height: min(76vh, 720px); border: 0.5px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); overflow: hidden; }
.dshf-modalHead { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 0.5px solid var(--dsw-alias-border-l1); }
.dshf-modalTitle { font-size: 15px; font-weight: 600; }
.dshf-modalBody { flex: 1; min-height: 0; overflow: auto; padding: 4px 0 8px; scrollbar-gutter: stable; }
.dshf-fontRow { display: flex; align-items: baseline; gap: 14px; width: 100%; padding: 8px 18px; border: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.dshf-fontRow:hover { background: var(--dsw-alias-interactive-hover, var(--dsw-alias-bg-layer-2)); }
.dshf-fontName { flex: none; width: 210px; font-size: 14px; font-weight: 500; overflow-wrap: anywhere; }
.dshf-fontSample { flex: 1 1 auto; min-width: 0; text-align: right; color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); font-size: 15px; overflow-wrap: anywhere; }
.dshf-pickerHint { padding: 8px 18px 4px; color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); font-size: 12px; }
.dshf-empty { padding: 18px; color: var(--dsw-alias-label-secondary); }
.dshf-seg { display: inline-flex; padding: 2px; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-bg-layer-1); }
.dshf-segBtn { padding: 5px 14px; border: 0; border-radius: calc(var(--dsw-radius-sm) - 2px); background: transparent; color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; }
.dshf-segBtnActive { background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); font-weight: 500; }
.dshf-range { flex: 1 1 auto; min-width: 120px; accent-color: var(--dsw-alias-accent-1, #4f7cf7); }
.dshf-wpMedia { display: flex; gap: 12px; align-items: center; padding: 12px 0 4px; }
.dshf-wpThumb { flex: none; width: 132px; height: 74px; object-fit: cover; border: 0.5px solid var(--dsw-alias-border-l2); border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-bg-layer-1); }
.dshf-wpPresets { display: flex; flex-wrap: wrap; gap: 8px; }
.dshf-wpPreset { position: relative; width: 104px; height: 60px; padding: 0; border-radius: var(--dsw-radius-sm); border: 1px solid var(--dsw-alias-border-l2); background-size: cover; background-position: center; cursor: pointer; opacity: 0.88; }
.dshf-wpPreset:hover { opacity: 1; }
.dshf-wpPresetOn { border-color: var(--dsw-alias-interactive-accent, #2f7fd6); box-shadow: 0 0 0 2px var(--dsw-alias-interactive-accent, #2f7fd6); opacity: 1; }
.dshf-wpPresetName { position: absolute; right: 0; bottom: 0; left: 0; padding: 12px 6px 4px; font-size: 11px; color: #fff; text-align: left; background: linear-gradient(transparent, rgba(0, 0, 0, 0.72)); border-radius: 0 0 var(--dsw-radius-sm) var(--dsw-radius-sm); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.dshf-bundled { display: flex; flex-direction: column; gap: 8px; padding: 10px 18px 12px; border-bottom: 0.5px solid var(--dsw-alias-border-l1); }
.dshf-bundledRow { display: flex; flex-wrap: wrap; gap: 8px; }
.dshf-bundledBtn { display: flex; align-items: baseline; gap: 12px; padding: 6px 12px; border-radius: var(--dsw-radius-sm); border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); color: inherit; cursor: pointer; }
.dshf-bundledBtn:hover { background: var(--dsw-alias-interactive-hover, var(--dsw-alias-bg-layer-2)); }
.dshf-wpMeta { min-width: 0; color: var(--dsw-alias-label-secondary); font-size: 12.5px; overflow-wrap: anywhere; }
@media (max-width: 767px) {
  .dshf-content { padding-inline: 20px; }
  .dshf-row { grid-template-columns: minmax(0, 1fr); }
}
`

    async function apiGet(path) {
      let response
      try {
        response = await fetch(path, { headers: { accept: 'application/json' } })
      } catch (error) {
        throw new Error(`fetch ${path}: ${String(error?.message ?? error)}`)
      }
      const value = await response.json().catch(() => null)
      if (!response.ok) throw new Error(`${path} -> HTTP ${response.status}${value?.code ? ' ' + value.code : ''}`)
      return value
    }
    async function apiPost(path, body) {
      const response = await fetch(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(body),
      })
      const value = await response.json().catch(() => null)
      if (!response.ok) throw new Error(`${path} -> HTTP ${response.status}${value?.code ? ' ' + value.code : ''}${value?.message ? ' · ' + value.message : ''}`)
      return value
    }

    function Switch({ checked, onChange, label }) {
      return h('button', {
        type: 'button',
        className: 'dshf-switch',
        role: 'switch',
        'aria-checked': checked ? 'true' : 'false',
        'aria-label': label,
        onClick: () => onChange(!checked),
      })
    }

    function Field({ t, label, value, family, onInput, onPick, datalistId }) {
      const previewFamily = stack(value, '') || 'inherit'
      return h('div', { className: 'dshf-row' },
        h('div', { className: 'dshf-rowTop' },
          h('span', { className: 'dshf-tag' }, label),
          h('input', {
            className: 'dshf-input',
            value: value,
            list: datalistId,
            spellcheck: false,
            placeholder: t('pick'),
            onInput: event => onInput(event.target.value),
          }),
        ),
        h('button', { type: 'button', className: 'dshf-btn', onClick: onPick }, t('pick')),
        h('div', { className: 'dshf-previewRow' },
        h('span', { className: 'dshf-previewTag' }, t('preview')),
        h('span', { className: 'dshf-preview', style: { fontFamily: family || previewFamily } }, t('previewText')),
        ),
      )
    }

    function FontPicker({ t, fonts, bundled, fieldLabel, onPick, onClose, onRefresh, busy, error }) {
      const [query, setQuery] = useState('')
      const search = useRef(null)
      useEffect(() => {
        search.current?.focus()
        const onKey = event => { if (event.key === 'Escape') { event.stopPropagation(); onClose() } }
        window.addEventListener('keydown', onKey, true)
        return () => window.removeEventListener('keydown', onKey, true)
      }, [onClose])
      const needle = query.trim().toLowerCase()
      const matched = useMemo(() => {
        const list = fonts ?? []
        return needle ? list.filter(name => name.toLowerCase().includes(needle)) : list
      }, [fonts, needle])
      const shown = matched.slice(0, 600)
      return h('div', {
        className: 'dshf-backdrop',
        onMouseDown: event => { if (event.target === event.currentTarget) onClose() },
      },
      h('div', { className: 'dshf-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': `${t('pickerTitle')} · ${fieldLabel}` },
        h('div', { className: 'dshf-modalHead' },
          h('span', { className: 'dshf-modalTitle' }, t('pickerTitle')),
          h('span', { className: 'dshf-tag' }, fieldLabel),
          h('input', {
            ref: search,
            className: 'dshf-input',
            style: { flex: '1 1 180px', minWidth: 120 },
            value: query,
            placeholder: t('pickerSearch'),
            onInput: event => setQuery(event.target.value),
          }),
          h('button', { type: 'button', className: 'dshf-btn', disabled: busy, onClick: onRefresh }, t('pickerRefresh')),
          h('button', { type: 'button', className: 'dshf-btn', onClick: onClose }, t('close')),
        ),
        h('div', { className: 'dshf-modalBody' },
        bundled?.length ? h('div', { className: 'dshf-bundled' },
          h('span', { className: 'dshf-tag' }, t('bundledFonts')),
          h('div', { className: 'dshf-bundledRow' }, bundled.map(item => h('button', {
            type: 'button',
            key: item.family,
            className: 'dshf-bundledBtn',
            title: item.note,
            onClick: () => onPick(item.family),
          },
          h('span', { className: 'dshf-fontName' }, item.label),
          h('span', { className: 'dshf-fontSample', style: { fontFamily: quote(item.family) } }, 'Aa 永字八法 123'),
          ))),
        ) : null,
        h('div', { className: 'dshf-pickerHint' }, fonts === null
          ? t('pickerHint')
          : matched.length > shown.length
            ? `${t('pickerCount', { count: matched.length })} · ${t('pickerMore', { count: matched.length - shown.length })} · ${t('pickerHint')}`
            : `${t('pickerCount', { count: matched.length })} · ${t('pickerHint')}`),
          error ? h('div', { className: 'dshf-empty dshf-statusError' }, error)
            : fonts === null ? h('div', { className: 'dshf-empty' }, t('pickerLoading'))
              : shown.length === 0 ? h('div', { className: 'dshf-empty' }, t('pickerEmpty'))
                : shown.map(name => h('button', {
                  type: 'button',
                  key: name,
                  className: 'dshf-fontRow',
                  onClick: () => onPick(name),
                },
                h('span', { className: 'dshf-fontName' }, name),
                h('span', { className: 'dshf-fontSample', style: { fontFamily: quote(name) } }, 'Aa 永字八法 123'),
                )),
        ),
      ))
    }

    function makePanel(hooks) {
      const { t, applyCss, applyWallpaper, readConfig, writeConfig, readFonts, refreshFonts, readPresets, readFace } = hooks
      return function FontPanel() {
        const [draft, setDraft] = useState(null)
        const saved = useRef(null)
        const [fonts, setFonts] = useState(null)
        const [picker, setPicker] = useState(null)
        const [busy, setBusy] = useState(false)
        const [message, setMessage] = useState(null)
        const [wpFile, setWpFile] = useState(null)
        const [wpBusy, setWpBusy] = useState(false)
        const fileRef = useRef(null)
        const [presets, setPresets] = useState(null)
        const [faceTick, setFaceTick] = useState(0)
        const face = useRef({ css: null, pending: null })
        // The @font-face text carries the font subset, so it is fetched only when
        // a field actually references a bundled family, then cached here.
        const ensureFace = needed => {
          if (!needed || face.current.css !== null || face.current.pending !== null) return
          face.current.pending = readFace()
            .then(value => { face.current.css = String(value?.css ?? ''); setFaceTick(x => x + 1) })
            .catch(() => { face.current.pending = null })
        }
        const cssOf = c => `${usesBundledFamily(c) ? face.current.css ?? '' : ''}${buildCss(c)}`

        useEffect(() => {
          readPresets().then(value => setPresets(value ?? null)).catch(() => setPresets(null))
        }, [])

        useEffect(() => {
          let disposed = false
          readConfig().then(value => {
            if (disposed) return
            saved.current = value.config
            setDraft(value.config)
          }).catch(async error => {
            if (disposed) return
            let detail = String(error?.message ?? error)
            try {
              const ping = await apiGet(ROUTE_PING)
              detail += ` · ${ping.plugin} v${ping.version} 已加载，已扫描 ${ping.fonts ?? 0} 个字体`
            } catch {
              detail += ' · 插件路由不可达：需要完全退出并重启 DSH'
            }
            setMessage({ kind: 'error', text: t('loadFailed', { message: detail }) })
          })
          return () => { disposed = true }
        }, [])

        useEffect(() => {
          if (draft === null) return
          ensureFace(usesBundledFamily(draft))
          applyCss(cssOf(draft))
          applyWallpaper(draft)
        }, [draft, faceTick])

        // Leaving the page discards an unsaved preview.
        useEffect(() => () => {
          applyCss(cssOf(saved.current ?? DEFAULTS))
          applyWallpaper(saved.current ?? DEFAULTS)
        }, [])

        useEffect(() => {
          if (picker === null || fonts !== null) return
          setBusy(true)
          readFonts().then(payload => setFonts(payload.fonts ?? [])).catch(error => {
            setMessage({ kind: 'error', text: t('scanFailed', { message: String(error?.message ?? error) }) })
            setFonts([])
          }).finally(() => setBusy(false))
        }, [picker])

        const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(saved.current)
        const groups = [
          { key: 'ui', title: t('groupUi'), hint: t('groupUiHint'), latin: 'uiLatin', cjk: 'uiCjk', follow: { field: 'brandFollowUi', label: t('brandFollowUi') } },
          { key: 'chat', title: t('groupChat'), hint: t('groupChatHint'), latin: 'chatLatin', cjk: 'chatCjk', follow: { field: 'chatComposer', label: t('chatComposer') } },
          { key: 'code', title: t('groupCode'), hint: t('groupCodeHint'), latin: 'codeLatin', cjk: 'codeCjk', follow: { field: 'terminalFollowCode', label: t('terminalFollowCode') } },
        ]

        const save = async () => {
          if (draft === null) return
          setBusy(true)
          setMessage({ kind: 'busy', text: t('saving') })
          try {
            const value = await writeConfig(draft)
            saved.current = value.config ?? draft
            setDraft(value.config ?? draft)
            applyCss(value.css ?? buildCss(saved.current))
            setMessage({ kind: 'ok', text: t('saved') })
          } catch (error) {
            setMessage({ kind: 'error', text: t('saveFailed', { message: String(error?.message ?? error) }) })
          } finally {
            setBusy(false)
          }
        }

        // Reset clears the font choices but keeps the wallpaper: re-uploading
        // a multi-MB image after an accidental reset would be needlessly harsh.
        const reset = () => {
          const keep = {
            wallpaperEnabled: draft?.wallpaperEnabled === true,
            wallpaperMode: draft?.wallpaperMode === 'url' ? 'url' : 'file',
            wallpaperUrl: typeof draft?.wallpaperUrl === 'string' ? draft.wallpaperUrl : '',
            wallpaperData: typeof draft?.wallpaperData === 'string' ? draft.wallpaperData : '',
            wallpaperOpacity: typeof draft?.wallpaperOpacity === 'number' ? draft.wallpaperOpacity : DEFAULTS.wallpaperOpacity,
          }
          setDraft({ ...DEFAULTS, enabled: draft?.enabled ?? true, ...keep })
          setMessage(null)
        }

        const pickWallpaper = async file => {
          if (!file) return
          setWpBusy(true)
          setMessage({ kind: 'busy', text: t('wallpaperProcessing') })
          try {
            const data = await encodeWallpaper(file)
            setWpFile(file)
            setDraft(current => current === null ? current : {
              ...current,
              wallpaperEnabled: true,
              wallpaperMode: 'file',
              wallpaperData: data,
              wallpaperUrl: '',
            })
            setMessage({ kind: 'ok', text: t('saved') })
          } catch (error) {
            const key = error?.message === 'image-too-large' ? 'wallpaperTooLarge' : 'wallpaperDecodeFailed'
            setMessage({ kind: 'error', text: t(key) })
          } finally {
            setWpBusy(false)
          }
        }

        const removeWallpaper = () => {
          setWpFile(null)
          setDraft(current => current === null ? current : {
            ...current,
            wallpaperEnabled: false,
            wallpaperUrl: '',
            wallpaperData: '',
          })
          setMessage(null)
        }

        return h('div', { className: 'dshf-page' },
        h('div', { className: 'dshf-scroll' },
        h('div', { className: 'dshf-content' },
        h('div', { className: 'dshf-head' },
        h('div', {},
        h('h1', {}, t('title')),
        h('p', { className: 'dshf-sub' }, t('subtitle')),
        ),
        h('div', { className: 'dshf-switchRow', style: { padding: 0 } },
        h('span', {}, draft?.enabled === false ? t('enabledOff') : t('enabledOn')),
        h(Switch, {
          checked: draft === null || draft.enabled !== false,
          label: t('enabled'),
          onChange: next => setDraft(current => (current === null ? current : { ...current, enabled: next })),
        }),
        ),
        ),
        message === null ? null : h('div', { className: `dshf-status${message.kind === 'error' ? ' dshf-statusError' : ''}` }, message.text),
        draft === null ? h('div', { className: 'dshf-empty' }, t('pickerLoading')) : null,
        draft === null ? null : groups.map(group => h('section', { className: 'dshf-card', key: group.key },
        h('div', { className: 'dshf-cardTitle' }, group.title),
        h('div', { className: 'dshf-cardHint' }, group.hint),
        h(Field, {
          t,
          label: t('latin'),
          value: draft[group.latin] ?? '',
          family: stack(draft[group.latin], draft[group.cjk]),
          datalistId: `dshf-list-${group.key}-latin`,
          onInput: next => setDraft(current => ({ ...current, [group.latin]: next })),
          onPick: () => setPicker({ field: group.latin, label: `${group.title} · ${t('latin')}` }),
        }),
        h(Field, {
          t,
          label: t('cjk'),
          value: draft[group.cjk] ?? '',
          family: stack(draft[group.latin], draft[group.cjk]),
          datalistId: `dshf-list-${group.key}-cjk`,
          onInput: next => setDraft(current => ({ ...current, [group.cjk]: next })),
          onPick: () => setPicker({ field: group.cjk, label: `${group.title} · ${t('cjk')}` }),
        }),
        h('label', { className: 'dshf-check' },
        h('input', {
          type: 'checkbox',
          checked: draft[group.follow.field] === true,
          onChange: event => setDraft(current => ({ ...current, [group.follow.field]: event.target.checked })),
        }),
        group.follow.label,
        ),
        h('datalist', { id: `dshf-list-${group.key}-latin` }, (fonts ?? []).map(name => h('option', { key: name, value: name }))),
        h('datalist', { id: `dshf-list-${group.key}-cjk` }, (fonts ?? []).map(name => h('option', { key: name, value: name }))),
        )),
        draft === null ? null : (() => {
          const image = wallpaperImage(draft)
          const mode = draft.wallpaperMode === 'url' ? 'url' : 'file'
          return h('section', { className: 'dshf-card' },
          h('div', { className: 'dshf-cardTitle' }, t('groupWallpaper')),
          h('div', { className: 'dshf-cardHint' }, t('groupWallpaperHint')),
          h('label', { className: 'dshf-check' },
          h('input', {
            type: 'checkbox',
            checked: draft.wallpaperEnabled === true,
            onChange: event => setDraft(current => ({ ...current, wallpaperEnabled: event.target.checked })),
          }),
          t('wallpaperEnabled'),
          ),
          image === '' ? null : h('div', { className: 'dshf-wpMedia' },
          h('img', { className: 'dshf-wpThumb', src: image, alt: '' }),
          h('div', { className: 'dshf-wpMeta' }, mode === 'url' ? draft.wallpaperUrl : (wpFile?.name ?? t('wallpaperLocal'))),
          ),
          h('div', { className: 'dshf-row' },
          h('div', { className: 'dshf-rowTop' },
          h('span', { className: 'dshf-tag' }, t('wallpaperMode')),
          h('div', { className: 'dshf-seg' },
          h('button', {
            type: 'button',
            className: `dshf-segBtn${mode === 'file' ? ' dshf-segBtnActive' : ''}`,
            onClick: () => setDraft(current => ({ ...current, wallpaperMode: 'file', wallpaperUrl: '' })),
          }, t('wallpaperModeFile')),
          h('button', {
            type: 'button',
            className: `dshf-segBtn${mode === 'url' ? ' dshf-segBtnActive' : ''}`,
            onClick: () => setDraft(current => ({ ...current, wallpaperMode: 'url', wallpaperData: '' })),
          }, t('wallpaperModeUrl')),
          ),
          ),
          ),
          presets?.wallpapers?.length ? h('div', { className: 'dshf-row' },
          h('div', { className: 'dshf-rowTop' },
          h('span', { className: 'dshf-tag' }, t('wallpaperPresets')),
          h('div', { className: 'dshf-wpPresets' }, presets.wallpapers.map(item => h('button', {
            type: 'button',
            key: item.id,
            title: item.name,
            className: `dshf-wpPreset${draft.wallpaperMode === 'file' && draft.wallpaperData === item.data ? ' dshf-wpPresetOn' : ''}`,
            style: { backgroundImage: `url("${item.data}")` },
            onClick: () => setDraft(current => (current === null ? current : {
              ...current,
              wallpaperEnabled: true,
              wallpaperMode: 'file',
              wallpaperUrl: '',
              wallpaperData: item.data,
            })),
          }, h('span', { className: 'dshf-wpPresetName' }, item.label)))),
          ),
          ) : null,
          mode === 'file' ? h('div', { className: 'dshf-row' },
          h('div', { className: 'dshf-rowTop' },
          h('span', { className: 'dshf-tag' }, t('wallpaperLocal')),
          h('button', { type: 'button', className: 'dshf-btn', disabled: wpBusy, onClick: () => fileRef.current?.click() }, t('wallpaperChoose')),
          ),
          ) : h('div', { className: 'dshf-row' },
          h('input', {
            className: 'dshf-input',
            spellcheck: false,
            placeholder: t('wallpaperUrlPh'),
            value: draft.wallpaperUrl ?? '',
            onInput: event => setDraft(current => ({ ...current, wallpaperMode: 'url', wallpaperUrl: event.target.value, wallpaperData: '' })),
          }),
          ),
          h('div', { className: 'dshf-row' },
          h('div', { className: 'dshf-rowTop' },
          h('span', { className: 'dshf-tag' }, t('wallpaperOpacity')),
          h('input', {
            type: 'range',
            className: 'dshf-range',
            min: 0,
            max: 100,
            step: 5,
            value: typeof draft.wallpaperOpacity === 'number' ? draft.wallpaperOpacity : DEFAULTS.wallpaperOpacity,
            onInput: event => setDraft(current => ({ ...current, wallpaperOpacity: Number(event.target.value) })),
          }),
          h('span', { className: 'dshf-status' }, `${typeof draft.wallpaperOpacity === 'number' ? draft.wallpaperOpacity : DEFAULTS.wallpaperOpacity}%`),
          ),
          ),
          image === '' ? null : h('div', { className: 'dshf-row' },
          h('div', { className: 'dshf-rowTop' },
          h('button', { type: 'button', className: 'dshf-btn', onClick: removeWallpaper }, t('wallpaperRemove')),
          ),
          ),
          h('p', { className: 'dshf-note' }, t('wallpaperNote')),
          h('input', {
            ref: fileRef,
            type: 'file',
            accept: 'image/*',
            style: { display: 'none' },
            onChange: event => {
              const file = event.target.files?.[0] ?? null
              event.target.value = ''
              void pickWallpaper(file)
            },
          }),
          )
        })(),
        draft === null ? null : h('div', { className: 'dshf-foot' },
        h('button', { type: 'button', className: 'dshf-btn dshf-btnPrimary', disabled: busy || !dirty, onClick: () => void save() }, t('save')),
        h('button', { type: 'button', className: 'dshf-btn', disabled: busy, onClick: reset }, t('reset')),
        dirty ? h('span', { className: 'dshf-status' }, t('dirty')) : null,
        fonts ? h('span', { className: 'dshf-status' }, t('pickerCount', { count: fonts.length })) : null,
        ),
        h('p', { className: 'dshf-note' }, t('note')),
        ),
        ),
        picker === null ? null : h(FontPicker, {
          t,
          fonts,
          bundled: presets?.fonts ?? null,
          busy,
          fieldLabel: picker.label,
          error: null,
          onPick: name => {
            setDraft(current => (current === null ? current : { ...current, [picker.field]: name }))
            setPicker(null)
          },
          onClose: () => setPicker(null),
          onRefresh: () => {
            setFonts(null)
            setBusy(true)
            refreshFonts().then(payload => setFonts(payload.fonts ?? [])).catch(error => {
              setMessage({ kind: 'error', text: t('scanFailed', { message: String(error?.message ?? error) }) })
              setFonts([])
            }).finally(() => setBusy(false))
          },
        }),
        )
      }
    }

    function makeIcon() {
      return function FontsIcon({ size }) {
        const edge = size ?? 18
        return h('svg', {
          width: edge, height: edge, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true,
          style: { display: 'block' },
        },
        h('path', { d: 'M3 19.5 9.4 4.5h1.2L17 19.5', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('path', { d: 'M5.6 15.2h8.8', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        h('path', { d: 'M18.6 11.4v8.1M18.6 11.4c2.1 0 2.9 1.4 2.9 3.1 0 2-1.2 3.2-2.9 3.2', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        )
      }
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        // Locale: registered dictionaries drive every visible string.
        let t = (key, params) => {
          const template = DICT.zh[key] ?? key
          if (!params) return template
          return template.replace(/\{(\w+)\}/g, (match, name) => String(params[name] ?? match))
        }
        const locale = ctx.get('locale')
        if (locale !== undefined) {
          try {
            ctx.effect(() => locale.register(LOCALE_NS, { zh: DICT.zh, en: DICT.en }), 'dsh-fonts-wallpaper: locale dictionaries')
            if (typeof locale.bind === 'function') t = locale.bind(LOCALE_NS)
          } catch { /* the fallback dictionary stays active */ }
        }

        // One package-owned stylesheet carries the active font stacks.
        let styleEl = null
        const applyCss = css => {
          if (!css) {
            if (styleEl !== null) { styleEl.remove(); styleEl = null }
            return
          }
          if (styleEl === null) {
            styleEl = document.createElement('style')
            styleEl.setAttribute('data-dsh-fonts-wallpaper', '')
            document.head.appendChild(styleEl)
          }
          styleEl.textContent = css
        }

        // Wallpaper: the host pre-paint tag (#dsh-fonts-wallpaper) carries the
        // static rules and the saved variables at boot. The live applier owns
        // the variables inline on <html> (which win over the tag) and ALWAYS
        // keeps its own static-CSS copy at the end of <head>, so an updated
        // rule set wins the cascade over a stale host tag after a plain page
        // refresh — no host restart required for CSS-only changes.
        let wpEl = null
        const WP_VARS = ['--dsh-wp-image', '--dsh-wp-opacity']
        const clearWallpaperDom = () => {
          if (wpEl !== null) { wpEl.remove(); wpEl = null }
          for (const name of WP_VARS) document.documentElement.style.removeProperty(name)
          document.getElementById('dsh-fonts-wallpaper')?.remove()
        }
        const applyWallpaper = config => {
          const c = { ...DEFAULTS, ...(config ?? {}) }
          const image = wallpaperImage(c)
          if (c.wallpaperEnabled !== true || image === '') { clearWallpaperDom(); return }
          document.documentElement.style.setProperty('--dsh-wp-image', `url("${cssUrlEscape(image)}")`)
          document.documentElement.style.setProperty('--dsh-wp-opacity', String(Math.max(0, Math.min(100, Number(c.wallpaperOpacity) || 0)) / 100))
          if (wpEl === null) {
            wpEl = document.createElement('style')
            wpEl.setAttribute('data-dsh-fonts-wallpaper', '')
            document.head.appendChild(wpEl)
          }
          wpEl.textContent = WALLPAPER_CSS
        }
        ctx.effect(() => {
          let disposed = false
          let activated = false
          apiGet(ROUTE_CONFIG).then(value => {
            if (disposed || !value?.ok) return
            activated = true
            applyCss(value.css ?? buildCss(value.config))
            applyWallpaper(value.config)
          }).catch(() => { /* the panel reports the unreachable service */ })
          return () => {
            disposed = true
            if (activated) {
              if (styleEl !== null) { styleEl.remove(); styleEl = null }
              clearWallpaperDom()
            }
          }
        }, 'dsh-fonts-wallpaper: active font stylesheet')

        ctx.effect(() => {
          const styles = ctx.get('styles')
          if (styles !== undefined && typeof styles.insert === 'function') return styles.insert(PANEL_CSS)
          const element = document.createElement('style')
          element.setAttribute('data-dsh-fonts-wallpaper-panel', '')
          element.textContent = PANEL_CSS
          document.head.appendChild(element)
          return () => element.remove()
        }, 'dsh-fonts-wallpaper: panel stylesheet')

        const hooks = {
          t,
          applyCss,
          applyWallpaper,
          readConfig: () => apiGet(ROUTE_CONFIG),
          writeConfig: config => apiPost(ROUTE_CONFIG, { config }),
          readFonts: () => apiGet(ROUTE_FONTS),
          refreshFonts: () => apiPost(ROUTE_FONTS, {}),
          readPresets: () => apiGet(ROUTE_PRESETS),
          readFace: () => apiGet(ROUTE_FACE),
        }

        const Panel = makePanel(hooks)
        const Icon = makeIcon()

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
        }, Panel))
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 20,
          label: () => t('panel'),
        }, Icon))
      },
    }
  },
})
