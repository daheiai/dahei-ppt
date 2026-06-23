# ADR 0012: Studio 存储策略

## 状态

Accepted

## 背景

Studio 需要管理文案、制作计划、HTML、MP4、关键帧拼图和素材。第一版目标是快速跑通创作闭环，降低系统复杂度。

## 决策

第一版使用纯本地文件。

未来项目数量、状态查询和跨项目搜索变复杂后，再引入 SQLite 作为索引和状态层。

## 第一版项目结构

```text
studio/
  projects/
    2026-xx-sample/
      script.md
      production-plan.md
      production-plan.yaml
      slides.html
      assets/
      exports/
        render.mp4
        contact-sheet.jpg
```

## 原则

- Markdown/YAML/HTML/MP4 都是可见文件。
- Codex 可以直接读写项目文件。
- Git 可以跟踪文档、计划和 HTML。
- 大体积 MP4 可按需要忽略或单独管理。
- SQLite 只在文件浏览和状态管理成为瓶颈时加入。

## 影响

- Studio 第一版不需要迁移系统。
- 项目可以直接复制、备份、归档。
- 渲染产物放在项目内 `exports/` 目录。
- 后续引入 SQLite 时，数据库应只保存索引，不取代源文件。

## 待继续追问

- 每个项目是否需要 `metadata.yaml`。
- 是否需要项目模板目录。
