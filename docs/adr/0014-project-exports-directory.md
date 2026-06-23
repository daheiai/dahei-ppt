# ADR 0014: 项目导出目录

## 状态

Accepted

## 背景

每个 Studio 项目会生成 MP4、帧序列、关键帧拼图和临时渲染文件。导出物应跟随项目目录，方便复制、归档和清理。

## 决策

每个项目使用 `exports/` 作为统一导出目录。

示例：

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
        frames/
```

## 影响

- 所有大体积导出物默认写入项目内 `exports/`。
- Git 默认忽略 `exports/`。
- 项目源文件和导出物位于同一项目目录。
- Studio 可以通过检测 `exports/` 判断是否已有本地导出。

## 待继续追问

- 是否需要保留 `exports/.gitkeep`。
- 是否需要按导出时间生成子目录。
