# ADR 0016: 渲染后端采用 HyperFrames

## 状态

Accepted

## 背景

`dahei-ppt` 的主产物是 HTML。升级目标是保留高质量 3:2 HTML，同时导出 4K60 MP4。渲染后端需要把 HTML 作为源文件，并支持稳定的逐帧渲染。

对比后：

- HyperFrames 以 HTML、CSS、媒体和可 seek 动画作为创作模型。
- Remotion 以 React 组件作为创作模型。
- 当前 `dahei-ppt` 已经是 HTML-first，迁移到 HyperFrames 成本更低。

## 决策

第一版渲染后端采用 HyperFrames。

CLI 仍保留后端抽象，便于未来接入 Playwright + ffmpeg 或 Remotion。

## 采用理由

- HTML 是主源文件。
- 无需把页面重写为 React。
- 适合 agent 生成和修改。
- HyperFrames 支持通过 CLI 预览和渲染。
- 渲染模型是逐帧 seek + Headless Chrome + FFmpeg。
- 后续 Studio 可以围绕 DOM 做预览和编辑。

## 需要验证

- 3:2 自定义画幅：3840x2560。
- 60fps 渲染。
- 现有 `dahei-ppt` HTML 如何改造成 HyperFrames composition。
- 手动控制 HTML 和渲染时间轴如何共存。
- Magic Move、淡入、滑入、连接线生长如何变成 seekable animation。
- 渲染输出写入项目内 `exports/`。

## 初始 CLI 目标

```bash
dahei-ppt render \
  --project studio/projects/2026-xx-sample \
  --backend hyperframes \
  --input slides.html \
  --output exports/render.mp4 \
  --fps 60 \
  --width 3840 \
  --height 2560
```

## 备选方案

- Playwright + ffmpeg：作为兜底后端。
- Remotion：暂作为研究参考，适合未来 React 组件化视频系统。

## 待继续追问

- HTML 手动预览和 HyperFrames 渲染是否使用同一个文件。
- 动画统一用 GSAP，还是先用 CSS/JS seek adapter。
- 是否需要新增 `hyperframes.html` 作为渲染专用文件。
