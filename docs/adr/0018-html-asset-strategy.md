# ADR 0018: HTML 资源策略

## 状态

Accepted

## 背景

`slides.html` 和 `render.html` 来自同一个制作计划。两者共享视觉风格和模板，但控制逻辑不同。开发时如果完全复制 CSS/JS，会增加维护成本；交付时如果依赖外部文件，又会降低可移植性。

## 决策

开发时共用模板、CSS 和 JS。导出时内联为自包含 HTML。

## 规则

- 模板源码可以拆成模块。
- Studio 项目中的最终 HTML 应自包含。
- `slides.html` 和 `render.html` 都应能直接打开。
- `render.html` 可以引用本地素材文件。
- CSS/JS 公共逻辑由生成器注入，避免手写重复。

## 影响

- 需要一个生成器层，把模板和样式打包进 HTML。
- 模板维护在源码目录完成。
- 项目产物保持稳定可复制。
- 后续版本更新不会自动改变旧项目 HTML，旧项目需要显式重新生成。

## 待继续追问

- 生成器使用 Node/TypeScript，还是 Python。
- 模板源码目录放在 `templates/` 还是 `studio/templates/`。
- 旧项目是否需要记录生成器版本。
