# ADR 0013: 生成产物 Git 策略

## 状态

Accepted

## 背景

Studio 会生成 MP4、帧序列、关键帧拼图等大文件。这些文件体积大、变化频繁，进入 Git 会拖慢仓库并制造噪音。

## 决策

Git 只跟踪源码、文档、制作计划和 HTML。

默认忽略：

- MP4
- MOV
- 帧序列
- 关键帧拼图
- 临时渲染目录
- 缓存文件

## 影响

- `slides.html` 可以进入 Git。
- `production-plan.md` 和 `production-plan.yaml` 可以进入 Git。
- `exports/render.mp4` 不进入 Git。
- `exports/contact-sheet.jpg` 不进入 Git。
- 需要分享视频时，通过文件系统、网盘或发布流程处理。

## 待继续追问

- Studio 是否需要显示本地产物存在状态。
