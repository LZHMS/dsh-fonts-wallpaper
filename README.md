# dsh-fonts-wallpaper

**自定义字体 · 全局壁纸** — Custom fonts & a global wallpaper for DeepSeek Harness.

一张图片垫在整个应用界面之后，侧栏、会话、代码块都透出壁纸的颜色；同时可以为界面、对话、代码分别指定西文与中文字体。

<img src="docs/hero.jpg" alt="启用全局壁纸后的应用界面：左侧导航、中间会话、右侧字体与壁纸面板，背景是一张壁纸" width="1280" />

---

## ✨ 功能 Features

| | 说明 | Description |
|---|---|---|
| 🖼 **全局壁纸** | 本地图片或网络地址，铺在整个应用界面之后（侧栏、会话、文件预览块全部生效） | A local image or a URL, fixed behind the whole app — sidebar, conversation and preview panes included |
| 🎚 **不透明度** | 滑块实时调节，一键启用 / 停用 | A live opacity slider with a one-click enable toggle |
| 🔤 **分区字体** | 界面、对话、代码三组，各设西文 + 中文字体，带实时预览 | Interface / conversation / code, each with its own Latin + CJK face and a live preview |
| 📋 **本机字体表** | 读取系统注册表与字体目录，1,200+ 字体可选，支持搜索 | Built from the Windows font registry and font folders — 1,200+ faces, searchable |

## 🔤 字体 Font panels

界面、对话、代码三组各有一行西文、一行中文，每一行下面都是该字体的真实预览 `永字八法 ABCDEFG abcdefg 0123456789`。

<img src="docs/fonts.jpg" alt="字体与壁纸面板：三组字体卡片，西文与中文字体选择框，以及每行的预览效果" width="1100" />

## 🎨 壁纸示例 Wallpapers

本机 9 张壁纸（`jpg` / `webp` 均可）都可以作为全局壁纸：

<img src="docs/gallery.jpg" alt="9 张壁纸缩略图，3 行 3 列方格展示" width="1272" />

同一张壁纸垫在界面之后、不同不透明度下的观感：

<img src="docs/gallery-mock.jpg" alt="9 张壁纸在应用界面中的效果，3 行 3 列方格展示，标注不透明度" width="1272" />

<sub>示例壁纸为个人收藏图片，仅用于演示效果。</sub>

## 🚀 安装 Install

1. 在本仓库的 **Releases** 下载 `local-dsh-fonts-wallpaper-<version>.tgz`（也可在仓库目录执行 `npm pack` 自行打包），然后在 DSH 桌面端打开 **插件管理 → 添加插件**，选择该文件。
   <sub>包名以 `@local/` 作用域开头，未发布到 npmjs，请直接从本仓库安装。</sub>
2. 安装后**完整退出并重启应用**（字体与壁纸文案在启动时读取）。
3. 左侧边栏出现 **「字体与壁纸」** 入口，打开即可上传本地图片、粘贴图片地址、调节不透明度。

## 🧭 使用 Usage

- **全局壁纸**：选择「本地图片」（自动压缩为最长边 2000px 的 JPEG 后随配置保存在本机）或「网络地址」（每次加载页面时重新获取）；「移除壁纸」恢复默认背景。
- **字体**：「界面字体」影响标题、按钮与侧栏；「对话字体」影响消息气泡与输入框；「代码字体」影响代码块与终端。勾选「跟随」可与品牌字标、输入框、终端联动。

## 🔒 隐私与覆盖 Privacy

- 字体列表只读取本机字体注册表键与字体目录，不做任何网络请求。
- 本地壁纸经压缩后与插件配置一同保存在本机（profile 的 `cordis.patch.yml`）；网络壁纸只保存 URL。**不向外部发送任何数据。**
- 启用后，**设置 → 通用 → 字体** 中的字体字段会被本插件覆盖（字号仍生效）；停用插件即恢复内置字体栈。

## 📄 许可 License

[MIT](LICENSE) © 2026 ZHaoLi
