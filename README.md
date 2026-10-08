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
