# ADR 0023: 制作计划 Schema v1

## 状态

Accepted

## 背景

制作计划需要从讲稿自动拆解为页面计划，并驱动 `slides.html` 与 `render.html` 生成。第一版 schema 应覆盖常见知识类视频段落，同时保留扩展空间。

示例文案：

> 如果你的项目要求本身就比较高，假如跑1小时GPT大概能用10块钱的话，Claude得10~40块，那按照我上个月总共大概花了4000块，这个价格我还能承受的话，Claude翻个4倍的价格我就承受不了。而恰恰GPT在编程任务方面的能力可能还会更好，很难不选择它。

推荐拆解为 5 页：

1. 项目要求越高，模型成本越关键。
2. GPT：约 10 元/小时；Claude：10-40 元/小时。
3. 4000 元账单放大到最高约 16000 元。
4. 4000 可以承受，4 倍价格越过边界。
5. 编程能力也强，最终选择 GPT。

## 决策

制作计划 v1 使用固定核心字段 + 可选论证字段。

## 顶层结构

```yaml
video:
  title: "视频或片段标题"
  format: "3:2"
  fps: 60
  width: 3840
  height: 2560

pages:
  - id: page_01
    source: "原文片段"
    keep_reason: "这一页必须保留的理由"
    purpose: "这一页要讲清楚什么"
    visual_subject: "唯一视觉主角"
    semantic_type: "核心观点"
    template: "big_claim"
    text:
      title: "项目要求越高，模型成本越关键"
    duration: 3
```

## 页面必填字段

- `id`
- `source`
- `keep_reason`
- `purpose`
- `visual_subject`
- `semantic_type`
- `template`
- `text.title`
- `duration`

## 页面可选字段

```yaml
text:
  subtitle: "辅助短句"
  labels:
    - "标签"
motion: "淡入 | 滑入 | 连接 | 替换 | 聚焦"
continuity_group: "连续组 ID"
exit_policy: "fade | edge | dim | structure"
template_reason: "仅在选择不确定或页面复杂时填写"
assets:
  - type: "image"
    description: "素材需求"
```

## 数字论证可选字段

```yaml
numbers:
  - label: "GPT"
    value: 10
    unit: "元/小时"
  - label: "Claude"
    value: "10-40"
    unit: "元/小时"

calculation:
  expression: "4000 × 4 = 16000"
  meaning: "价格放大后的预算压力"

decision:
  winner: "GPT"
  reasons:
    - "成本更可控"
    - "编程能力足够强"
```

## 初始语义类型

- `core_claim`：核心观点
- `concept_definition`：概念定义
- `timeline_evolution`：时间演化
- `causal_relation`：因果关系
- `comparison_judgment`：对比判断
- `case_demo`：案例展示
- `data_explanation`：数据说明
- `number_argument`：数字论证
- `closing_claim`：结论收束

## 初始模板类型

- `big_claim`
- `compare`
- `number_scale`
- `threshold_line`
- `quote_punch`
- `timeline`
- `device_flow`
- `relationship_map`
- `screenshot_focus`
- `card_stack`

## 扩展原则

- 新文案暴露新结构时，再增加可选字段。
- 核心字段保持稳定。
- 模板枚举可以逐步扩展。
- Zod schema 负责校验必填字段和已知枚举。

## 待继续追问

- `duration` 单位固定为秒还是帧。
- 数字字段是否需要支持区间、近似值和货币符号。
