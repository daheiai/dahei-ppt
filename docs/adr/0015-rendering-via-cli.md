# ADR 0015: Studio 通过 CLI 渲染

## 状态

Accepted

## 背景

Studio 需要导出 MP4，但渲染涉及浏览器、逐帧截图、ffmpeg、帧率、分辨率和临时文件管理。把这些逻辑放进 UI 会增加复杂度，也会让 Codex 调试更困难。

## 决策

Studio 通过命令行脚本触发渲染。

流程：

```text
Studio UI
  -> 调用渲染 CLI
  -> CLI 打开 slides.html
  -> CLI 逐帧截图或调用渲染工具
  -> CLI 调用 ffmpeg 合成 MP4
  -> 输出到项目 exports/
  -> Studio 读取渲染状态和产物
```

## 影响

- 渲染逻辑独立于 UI。
- Codex 可以直接运行和调试渲染脚本。
- Studio 第一版只需要传参、显示状态、打开结果。
- 未来切换 Playwright、HyperFrames、Remotion 时，只改 CLI 层。
- CLI 是稳定边界。

## 初始 CLI 设想

```bash
dahei-ppt render \
  --project studio/projects/2026-xx-sample \
  --input slides.html \
  --output exports/render.mp4 \
  --fps 60 \
  --width 3840 \
  --height 2560
```

## 第一版实现

- 初始渲染后端采用 HyperFrames，见 ADR 0016。
- 渲染时长来自 `render.html` 的 `data-duration`，源头是制作计划的 `duration` 汇总。
- Studio 通过本地 Node API 启动 CLI，并读取渲染日志与退出状态。
- 输出统一写入项目内 `exports/`。
