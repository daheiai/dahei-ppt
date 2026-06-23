# ADR 0011: Skill + Studio 双形态

## 状态

Accepted

## 背景

`dahei-ppt` 的目标已经从单次 HTML 生成扩展到完整制作流程：文案输入、内容拆解、制作计划确认、HTML 预览、4K60 MP4 导出、素材管理和版本管理。

纯 skill 适合被 Codex 调用和执行自动化任务。中控台适合管理多个项目、多个画面段落和长期生产流程。

## 决策

`dahei-ppt` 升级为双形态：

1. Skill：智能执行入口。
2. Studio：本地可视化生产工作台。

Skill 负责：

- 读取讲稿或文案。
- 生成制作计划。
- 生成高质量 3:2 HTML。
- 调用渲染脚本导出 4K60 MP4。
- 写入项目文件。

Studio 负责：

- 管理视频项目。
- 管理画面段落。
- 展示和编辑制作计划。
- 预览 HTML。
- 触发 MP4 导出。
- 管理模型配置。
- 管理素材目录。
- 查看历史版本和关键帧拼图。

## 第一版 Studio 范围

第一版只保留最短闭环：

1. 项目列表
2. 文案输入
3. 制作计划确认
4. HTML 预览
5. MP4 导出

## 仓库策略

Studio 第一版放在当前 `dahei-ppt` 仓库的子目录中。等 Studio 功能稳定、发布节奏和 skill 明显分离后，再拆成独立仓库。

推荐目录：

```text
studio/
  app/
  scripts/
  projects/
```

## 目录建议

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
  app/
  scripts/
```

## 原则

- Skill 是脑。
- Studio 是工作台。
- HTML 仍是主源文件。
- MP4 是可复现导出物。
- Studio 不替代 Codex，而是承接 Codex 产物和工作流。

## 待继续追问

- Studio 第一版使用纯本地文件，还是需要轻量数据库。
- Studio 第一版是否需要真实渲染 MP4，还是先只做项目管理和 HTML 预览。
