# ADR 0008: 制作计划格式

## 状态

Accepted

## 背景

`dahei-ppt` 需要在生成 HTML 前展示一个可确认的中间产物。这个中间产物不是传统影视分镜板，不需要详细描述每一帧、镜头运动和构图细节。它更像制作计划：说明每页讲什么、打算怎么做、视觉主角是什么。

## 决策

中间产物命名为“制作计划”。

默认输出两种形式：

1. Markdown：用于人类阅读和确认。
2. YAML：用于机器读取和生成 HTML / MP4。

制作计划保持简洁，不做传统影视分镜板。

## Markdown 计划字段

- 页码
- 原文依据
- 保留理由
- 页面目的
- 视觉主角
- 推荐模板
- 模板理由：仅在选择不确定或页面复杂时显示
- 页面文字
- 动效方向
- 预计时长

## YAML 计划字段

```yaml
pages:
  - id: page_01
    source: "原文片段"
    keep_reason: "这一页必须保留的理由"
    purpose: "这一页要讲清楚什么"
    visual_subject: "唯一视觉主角"
    semantic_type: "核心观点 | 概念定义 | 时间演化 | 因果关系 | 对比判断 | 案例展示 | 数据说明 | 结论收束"
    template: "big_claim | timeline | device_flow | relationship_map | screenshot_focus | compare | card_stack | quote_punch"
    template_reason: "仅在选择不确定或页面复杂时填写"
    text:
      title: "页面主文字"
      subtitle: "辅助短句"
    motion: "淡入 | 滑入 | 连接 | 替换 | 聚焦"
    duration: 4
```

## 影响

- 文档和代码中优先使用“制作计划”。
- “分镜”保留为底层概念，但用户-facing 输出使用“制作计划”。
- 制作计划只描述足以决策和生成的内容。
- 详细动效参数进入模板或 YAML 扩展字段。

## 待继续追问

- 用户修改计划时，最常改的是页数、主角、模板，还是页面文字。
