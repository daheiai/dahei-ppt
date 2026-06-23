# ADR 0017: 同源双 HTML 产物

## 状态

Accepted

## 背景

`dahei-ppt` 需要同时支持人工手动预览和 HyperFrames 渲染。手动预览依赖按键推进，渲染依赖固定时间轴和可 seek 动画。把两种模式塞进同一个 HTML 会增加状态复杂度。

## 决策

从同一个制作计划生成两个 HTML 文件：

1. `slides.html`：手动预览版。
2. `render.html`：HyperFrames 渲染版。

两者共享内容、视觉风格和模板，但控制方式不同。

## 文件职责

### slides.html

- 给创作者检查画面。
- 保留方向键、空格和回退键。
- 支持手动截图和手动录屏。
- 可以包含轻量调试能力，但画面本身保持干净。

### render.html

- 给 HyperFrames 渲染。
- 使用固定时间轴。
- 使用 `data-composition-id`、`data-width`、`data-height` 等 composition 属性。
- 使用 `data-start`、`data-duration`、`data-track-index` 控制元素时间。
- 动画必须可 seek。

## 影响

- 制作计划成为真正的单一来源。
- 模板需要支持两种输出模式。
- 手动控制逻辑只进入 `slides.html`。
- HyperFrames timing 逻辑只进入 `render.html`。
- 质量检查需要比较两份 HTML 的关键视觉一致性。

## 项目结构

```text
studio/projects/2026-xx-sample/
  script.md
  production-plan.md
  production-plan.yaml
  slides.html
  render.html
  assets/
  exports/
```

## 待继续追问

- 两份 HTML 是否共用 CSS 文件，还是都自包含。
- 模板代码如何避免重复。
- 视觉一致性检查如何做。
