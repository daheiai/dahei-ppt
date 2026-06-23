# ADR 0019: 生成器运行时

## 状态

Accepted

## 背景

`dahei-ppt` 需要从制作计划生成 `slides.html` 和 `render.html`，并调用 HyperFrames 渲染 MP4。Studio 也会运行在前端/Node 生态中。

## 决策

生成器主链路使用 Node/TypeScript。

Python 可以作为辅助脚本，用于图片处理、表格读取、批量文件整理等周边任务。

## 影响

- HTML 模板、Studio、HyperFrames 调用保持同一生态。
- CLI 可以使用 Node/TypeScript 实现。
- 后续引入 React/Vite 或轻量 Web UI 更顺。
- Python 不承担核心渲染链路。

## 初始模块建议

```text
src/
  cli/
  generator/
  templates/
  renderers/
  studio/
scripts/
```

## 已定补充

- 包管理器使用 npm，见 ADR 0020。
- TypeScript 从第一版启用，见 ADR 0021。
- CLI 命令名称使用 `dahei-ppt`。
