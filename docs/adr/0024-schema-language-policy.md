# ADR 0024: Schema 语言策略

## 状态

Accepted

## 背景

制作计划同时服务机器生成和人工确认。机器需要稳定字段，用户需要自然可读的中文展示。

## 决策

机器字段使用英文。Markdown 展示使用中文。

示例：

```yaml
semantic_type: "number_argument"
template: "threshold_line"
exit_policy: "fade"
```

Markdown 展示：

| 字段 | 展示 |
| --- | --- |
| `number_argument` | 数字论证 |
| `threshold_line` | 阈值线 |
| `fade` | 淡出 |

## 影响

- Zod schema 使用英文枚举。
- YAML 使用英文枚举。
- Markdown 制作计划显示中文名称。
- Studio UI 显示中文名称。
- 代码中维护英文到中文的映射表。

## 待继续追问

- 初始枚举映射表放在 schema 文件，还是单独放在 i18n 文件。
