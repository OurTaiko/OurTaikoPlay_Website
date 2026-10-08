# OurTaikoPlay Website

OurTaikoPlay 的独立介绍与下载网站，简体中文，适配桌面和移动设备。

## 本地运行

需要 Node.js 22.12+。

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

`dist/` 是可发布到任意静态托管平台的构建结果。Vite 使用相对资源路径，支持根域名或子目录部署。网站无需服务端、账号或 API 密钥。

## 内容与下载

- `index.html`：导航、首屏、功能、下载、上手指南、友链。
- `credits.html`：素材来源和权利归属。
- `src/style.css`：响应式样式。
- `src/main.js`：移动导航。

Windows 与 Android 下载按钮始终指向 `https://github.com/OurTaiko/OurTaikoPlay/releases/tag/nightly`，由用户在发布页选择对应安装包。不请求 Release API，也不将链接替换为可能被滚动构建移除的安装包直链。iOS 使用既有 TestFlight 入口；macOS 当前引导至源码构建说明，不虚构安装包。

页面功能描述依据 OurTaikoPlay README；并未承诺尚未实现的双人演奏、段位模式、完整菜单翻译或浏览器版游戏。

## 设计与素材

- 布局参考：https://openumiguri.pingfanh.top/
- 素材来源：https://github.com/luluxia/donder-tool
- 来源提交：`1e46215b8dc9b8ed77370f6ea5e22c5201bc57b1`

只使用背景、图标、贴纸、难度图标及字体，未复制上游业务代码或产品 Logo。详见 [NOTICE](NOTICE) 和网站的素材致谢页面。

本仓库与 OurTaikoPlay 游戏仓库、Fanmade 前后端仓库相互独立。

## 国际化

支持简体中文 (`zh-Hans`)、英语 (`en`)、日语 (`ja`) 与韩语 (`ko`)，首页和素材致谢页共用 `src/locales/` 中的翻译。

访问时优先使用已保存的语言；否则按 `navigator.languages` 顺序匹配支持的语言（含地区变体，所有 `zh-*` 使用简体中文）。全部不匹配时回退到英语。顶部语言图标列出所有语言与“跟随浏览器”；手动选择写入 `localStorage`，选择跟随浏览器时移除覆盖。存储不可用时仍可在当前页切换。同步更新页面标题、描述、文档语言与无障碍标签。菜单支持方向键、Home/End、Escape 与点击外部关闭。

执行 `npm test` 检查语言匹配、选择记忆、存储异常和四语文案完整性。
