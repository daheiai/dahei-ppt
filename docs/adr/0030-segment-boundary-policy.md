# ADR 0030: 整片规划的段落边界策略

## 状态

Accepted

## 背景

整片规划入口需要把完整文案切成可制作的画面段落。原文段落通常保留了作者的表达节奏；AI 适合提出拆分、合并和画面形态建议；最终边界需要创作者确认，避免一开始就破坏文案的逻辑结构。

## 决策

整片规划入口采用“原文段落优先，AI 建议拆分/合并，用户确认”的段落边界策略。

流程：

1. 系统按原文段落生成初始块。
2. AI 阅读全文后，为每个初始块提出保留、拆分或合并建议。
3. Studio 展示 AI 建议和画面形态颜色。
4. 用户确认后生成正式 `visual-routing.yaml`。
5. 正式分段作为后续动画制作、素材检索和拍摄计划的来源。

## YAML 结构

```yaml
segments:
  - id: segment_01
    source_block_ids:
      - block_01
    source_text: "原文段落"
    boundary_action: "keep"
    boundary_reason: "这一段已经是完整表达单元"
    visual_mode: "animation"
    visual_mode_reason: "包含数字对比和选择判断"
    animation_candidate: true
    user_status: "pending"
```

## 边界动作

- `keep`：沿用原文段落。
- `split`：把一个原文段落拆成多个画面段落。
- `merge`：把相邻原文段落合成一个画面段落。

## Studio 规则

- 左侧全文视图以块为单位显示。
- 点击块后，右侧显示边界建议、画面形态和理由。
- 用户可确认、拆分、合并、改色和备注。
- 确认后的段落拥有稳定 `segment_id`。
- 动画段落在右侧提供“进入动画制作”按钮。

## 影响

- `script.md` 保留完整原文。
- `visual-routing.yaml` 保存正式画面形态计划。
- `visual-routing.md` 保存中文展示版。
- 动画段落可以派生为独立制作片段。
- AI 后续生成制作计划时使用用户确认后的段落边界。
