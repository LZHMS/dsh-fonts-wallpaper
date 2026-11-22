// Rebuilds the bundled presets shipped under assets/.
//
// Prerequisites (all local, no network beyond pip):
//   python -m venv .venv && .venv/Scripts/python -m pip install fonttools
//   Resize the source wallpapers first (1600px long edge, JPEG q72) into
//   tmp/wallpapers/<name>.jpg - any image tool works, e.g. System.Drawing:
//   DrawImage onto a 1600px-wide bitmap with HighQualityBicubic.
//
// Run from the plugin directory:  node tools/bundle-assets.mjs
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC_FONT = process.env.DSH_FONTS_SRC_FONT
  // the upstream OFL font, e.g. https://github.com/lxgw/LxGWenKai-CJKVersion releases
  ?? path.join(process.env.LOCALAPPDATA ?? '', 'Microsoft/Windows/Fonts/LXGWWenKaiGBScreen.ttf')
const WALL_DIR = path.join(ROOT, 'tmp', 'wallpapers')
const WALLS = ['frieren-cherry-blossom.jpg', 'kimono-girl-lantern-night.jpg', 'mecha-girl-space.jpg']
const python = process.env.DSH_FONTS_PYTHON ?? 'python'

// 1) the character set: every GB2312 Han character (two-byte 0xB0A1..0xF7FE)
const chars = []
for (let hi = 0xb0; hi <= 0xf7; hi++) for (let lo = 0xa1; lo <= 0xfe; lo++) chars.push(Buffer.from([hi, lo]))
const text = Buffer.concat(chars).toString('gb2312')
const charFile = path.join(ROOT, 'tmp', 'subset-chars.txt')
fs.mkdirSync(path.dirname(charFile), { recursive: true })
fs.writeFileSync(charFile, text, 'utf8')

// 2) subset to WOFF2 (Latin + punctuation ranges come from --unicodes)
fs.mkdirSync(path.join(ROOT, 'assets', 'fonts'), { recursive: true })
execFileSync(python, ['-m', 'fontTools.subset', SRC_FONT,
  `--text-file=${charFile}`,
  '--unicodes=U+0020-007E,U+00A0-00FF,U+2000-206F,U+3000-303F,U+FF00-FFEF',
  '--flavor=woff2', '--no-hinting', '--desubroutinize',
  `--output-file=${path.join(ROOT, 'assets', 'fonts', 'lxgw-wenkai-gb-screen-subset.woff2')}`,
], { stdio: 'inherit' })

// 3) wallpapers
fs.mkdirSync(path.join(ROOT, 'assets', 'wallpapers'), { recursive: true })
for (const name of WALLS) {
  const src = path.join(WALL_DIR, name)
  if (!fs.existsSync(src)) throw new Error(`missing resized wallpaper: ${src}`)
  fs.copyFileSync(src, path.join(ROOT, 'assets', 'wallpapers', name))
}

// 4) the presets.js metadata must list exactly these files; keep them in sync.
console.log('font    ', fs.statSync(path.join(ROOT, 'assets/fonts/lxgw-wenkai-gb-screen-subset.woff2')).size, 'bytes,', text.length, 'characters')
for (const name of WALLS) console.log('wallpaper', name, fs.statSync(path.join(ROOT, 'assets/wallpapers', name)).size, 'bytes')
