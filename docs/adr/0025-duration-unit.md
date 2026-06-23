# ADR 0025: Duration 单位

## 状态

Accepted

## 背景

制作计划需要描述每页或镜头的预计时长。用户确认制作计划时，秒比帧更直观。渲染时可以根据 fps 转换为帧数。

## 决策

`duration` 使用秒作为单位。

## 影响

- YAML 中 `duration: 4` 表示 4 秒。
- Markdown 制作计划显示为“4 秒”。
- 渲染阶段使用 `duration * fps` 转换为帧数。
- fps 改变时，制作计划的时间含义保持稳定。

## 示例

```yaml
fps: 60
pages:
  - id: page_01
    duration: 4
```

渲染时对应 240 帧。
