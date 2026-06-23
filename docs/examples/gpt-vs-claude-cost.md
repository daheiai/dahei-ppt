# GPT vs Claude 成本片段样例

这个样例用于验证 dahei-ppt Studio v1 的第一条完整链路：

1. 完整讲稿进入视觉分区。
2. 红色动画片段进入制作计划。
3. 制作计划生成 `slides.html` 和 `render.html`。
4. `check` 命令检查页面原则和渲染 HTML。
5. HyperFrames 输出 3:2、3840x2560、60fps 的 MP4。

样例讲稿位于：

```text
examples/gpt-vs-claude-cost/script.md
```

生成后的项目位于：

```text
studio/projects/gpt-vs-claude-cost
```
