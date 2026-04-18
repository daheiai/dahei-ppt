# 大黑PPT 设计系统

## 配色方案

```css
:root {
  --bg-color: #FAF9F6;      /* 米白色背景（报纸质感） */
  --text-color: #1A1A1A;     /* 深黑色字体（高对比度） */
  --accent-color: #FF6B00;   /* 橙色高亮（重点强调） */
  --sub-text: #666666;       /* 次级文字（灰度降低） */
  --border-color: #eee;      /* 分隔线（极淡） */
  --banner-bg: #F2F0EB;      /* Banner/标签背景（略深米色） */
}
```

配色逻辑：暖色调米白 + 深黑文字 + 少量橙色点缀。
- 橙色仅用于：页面编号、强调标签、最高分、重点文字
- 背景色用于：页面底色
- banner-bg 用于：标签、提示词框、表格表头、分数卡片

## 画面比例

固定 3:2 比例（3840×2560 像素的视频画面）：

```css
.stage {
  width: 100vw;
  height: calc(100vw * 2 / 3);
  max-height: 100vh;
  max-width: calc(100vh * 3 / 2);
  position: relative;
  background: var(--bg-color);
  overflow: hidden;
}
```

外部 body 背景为黑色 `#000`，stage 居中显示。

## 字号规范

所有字号以手机小屏可读为标准，宁大勿小。

### 图文混排页（有图片的页面）
| 元素 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 封面标题 | 2.4rem - 3.6rem (clamp) | 800 | --text-color |
| 封面副标题 | 1.25rem | 400 | --sub-text |
| 页面编号 (ROUND XX) | 1.1rem - 1.3rem | 700 | --accent-color |
| 页面标题 | 1.8rem - 2.4rem (clamp) | 700 | --text-color |
| 提示词/引用正文 | 1.05rem - 1.1rem | 400 | --text-color |
| 提示词标签 (PROMPT) | 0.9rem | 700 | --accent-color |
| 图片下方模型标签 | 1rem | 600 | --sub-text |
| 分数数字 | 1.8rem | 800 | --text-color (最高分用 --accent-color) |
| 分数模型名 | 0.95rem | 600 | --sub-text |
| 表格正文 | 1.15rem | 400 | --text-color |
| 表格表头 | 1.1rem | 700 | --sub-text |
| 封面标签 | 1.35rem | 600 | --text-color |

### 纯文字/关键词页（无图片，纯排版）
纯文字页的字号必须大幅放大，让文字撑满画面：

| 元素 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 小标签（变化一/变化二） | 1.6rem | 700 | --accent-color |
| 页面大标题 | 4.0rem - 4.5rem | 800 | --text-color |
| 对比卡片标题（以前/现在） | 2.0rem - 2.2rem | 600 | --text-color |
| 对比卡片描述 | 1.5rem - 1.6rem | 400 | --sub-text |
| 引用金句标签 | 1.8rem | 500 | --text-color |
| 关键词药丸标签 | 1.7rem | 600 | --bg-color (深底反白) |
| 强调语/结论 | 2.4rem - 2.6rem | 700 | --accent-color 或 --text-color |
| 箭头/连接符 | 3.0rem+ | 700 | --accent-color |

**核心原则：纯文字页的标题至少 4rem，正文至少 1.6rem，强调语至少 2.4rem。宁可太大也不要太小。**

### 主视觉页（Hero Page）与背景词云

适用于：单页只突出一个核心主角，周围是名字云、关键词云、Agent 群像等陪衬层。

| 元素 | 字号/规则 | 说明 |
|------|-----------|------|
| 中心主标题 | 5.2rem - 7.8rem | 允许非常大，必须成为唯一视觉中心 |
| 中心小标签/短句 | 1.1rem - 1.2rem | 最多一行，默认可省略 |
| 背景大词 | 2.2rem - 3.2rem | 画面中少量较大的陪衬词 |
| 背景中词 | 1.5rem - 2.1rem | 作为主体密度来源 |
| 背景小词 | 0.95rem - 1.35rem | 只补密度，不承担阅读重点 |

**关键经验：**
- 如果是全屏录屏，背景词云默认会显得偏小，不能按普通网页视觉判断
- 词云层优先使用“统一倍率放大”而不是逐个词手调
- 推荐做法：先确定一套基础字号，然后整体乘以 `1.35` 到 `1.4`
- 当前已验证的舒适值：`1.4`
- 只有当 `1.35-1.4` 后仍然显得空，才继续提高密度

## 布局规范

### 页面内边距
```css
.slide { padding: 28px 40px 20px; }
```

### 主视觉页布局

- 中心只放一个主标题容器，不要堆多层说明文字
- 主容器可以有轻微实体感，但不要再套第二层外框形成“框中框”
- 四角和页脚默认留空，不主动放角标、来源、页眉页脚
- 背景词云应当错落分布，避免规则阵列和均匀排布

### 标准内容页结构（从上到下）
1. 页面编号 + 标题（flex-shrink: 0）
2. 提示词框（flex-shrink: 0，完整显示不截断）
3. 原图区域（如有，flex-shrink: 0）
4. 图片区域（flex: 1，自适应剩余空间）
5. 分数栏（flex-shrink: 0）

### 图片尺寸限制
```css
.image-card img { max-height: 38vh; }     /* 模型生成图 */
.original-card img { max-height: 22vh; }  /* 原图（更小） */
```

### 图片并排布局（推荐）
每页最多并排 2-3 张图。超过 2 张时拆分为多页，每页 2 张效果最佳：
```css
.img-row {
  flex: 1; display: flex; gap: 20px;
  align-items: center; min-height: 0;
}
.img-row .img-cell {
  flex: 1; min-width: 0; height: 100%;
  overflow: hidden; border-radius: 12px;
  border: 1px solid var(--border-color); background: #fff;
}
.img-row .img-cell img {
  width: 100%; height: 100%;
  object-fit: contain; display: block;
}
```

### 图片网格布局（4张以上时备用）
如果必须在一页放 4 张图，必须显式设置 `grid-template-rows`，否则图片会撑开导致下面的行溢出不可见：
```css
/* 错误 - 下面两行会被挤出画面 */
display: grid; grid-template-columns: 1fr 1fr; gap: 14px;

/* 正确 - 显式限制行高 */
display: grid;
grid-template-columns: 1fr 1fr;
grid-template-rows: 1fr 1fr;
gap: 14px;
min-height: 0;  /* 关键：允许 flex 子项收缩 */
```
每个格子也需要 `min-height: 0` 才能正确收缩。

### 长文本分栏布局
当提示词特别长时，使用左右分栏：
```css
.slide.wide-prompt .content-row {
  display: flex;
  gap: 16px;
  flex: 1;
}
.slide.wide-prompt .prompt-box {
  flex: 0 0 30%;    /* 左侧提示词占 30% */
}
.slide.wide-prompt .image-area {
  flex: 1;          /* 右侧图片占剩余空间 */
}
```

## 动画规范

### 逐步揭示
```css
.step {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.step.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 页面切换
```css
.slide {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.slide.active {
  opacity: 1;
}
```

### 连续同主题页面的动画处理
当多页属于同一主题（如截图分两页展示），后续页的标题不加 `.step` class，让标题随页面直接出现，避免重复渐入的突兀感：
```html
<!-- 第1页：标题有 step，首次渐入 -->
<div class="page-title step">...</div>

<!-- 第2页（同主题续页）：标题无 step，直接显示 -->
<div class="page-title">...</div>
```

### 神奇移动 (Magic Move)
当元素在页面切换时没有本质变化（如手机、电脑、logo等），不要让它们"消失再出现"，而是保持元素不变，只平滑改变位置。这是 Keynote 的 Magic Move 效果。

**核心思想**：元素作为独立层存在，不属于任何 `.page` 容器，通过 class 切换改变位置。

```css
/* 元素容器 */
.devices-wrapper {
    position: absolute;
    /* 第一页位置：居中 */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* 平滑过渡 */
    transition: top 0.8s ease, transform 0.8s ease;
    z-index: 20;
}

/* 第二页位置：移到底部 */
.devices-wrapper.bottom {
    top: 88%;
    transform: translate(-50%, -100%);
}
```

```javascript
function goToPage2() {
    // 1. 移动设备（添加 class 触发 CSS transition）
    devicesWrapper.classList.add('bottom');

    // 2. 显示新元素（如服务器）
    setTimeout(() => {
        serverCluster.classList.add('visible');
    }, 300);

    // 3. 设备移动完成后，绘制连接线
    setTimeout(() => {
        drawConnectionLines();
    }, 900);
}
```

**动画顺序**：元素移动 → 显示新元素 → 绘制连接线

### 连接线动画
使用 SVG `<path>` + `stroke-dasharray` 实现"生长"效果：

```css
.connection-line {
    stroke: #FF6B00;
    stroke-width: 4;
    fill: none;
    stroke-dasharray: 500;      /* 线段长度 */
    stroke-dashoffset: 500;     /* 初始偏移 = 完全隐藏 */
    filter: drop-shadow(0 0 4px #FF6B00);  /* 发光效果 */
}

.connection-line.animate {
    animation: drawLine 0.8s ease forwards;
}

@keyframes drawLine {
    to { stroke-dashoffset: 0; }  /* 偏移归零 = 完全显示 */
}
```

```javascript
// 绘制弧线连接（使用贝塞尔曲线 Q 命令）
function drawConnectionLines() {
    const stage = document.querySelector('.stage');
    const rect = stage.getBoundingClientRect();

    // 起点：设备顶部
    const deviceTop = rect.height * 0.88 - 200;
    const phoneX = rect.width * 0.31;
    const computerX = rect.width * 0.69;

    // 终点：服务器底部
    const serverBottom = rect.height * 0.10 + 120;
    const serverLeftX = rect.width / 2 - 82;
    const serverRightX = rect.width / 2 + 82;

    // 控制点（弧线弯曲程度）
    const controlY = (deviceTop + serverBottom) / 2;

    svg.innerHTML = `
        <path class="connection-line animate"
              d="M ${phoneX} ${deviceTop} Q ${phoneX} ${controlY} ${serverLeftX} ${serverBottom}"/>
        <path class="connection-line animate"
              d="M ${computerX} ${deviceTop} Q ${computerX} ${controlY} ${serverRightX} ${serverBottom}"
              style="animation-delay: 0.2s"/>
    `;
}
```

**注意**：连接线的起点终点坐标需要根据实际元素位置精确计算。

## 简笔画漫画风格

适用于：用漫画形式讲故事、解释概念、展示场景。

### 基础样式

```css
/* 线条样式 */
.stroke-main {
    stroke: #1A1A1A;
    stroke-width: 3;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* 填充样式 */
.fill-main { fill: #1A1A1A; }

/* 对话框 */
.speech-bubble {
    fill: #fff;
    stroke: #1A1A1A;
    stroke-width: 3;
}

/* 爆炸框（黑色背景+白字） */
.explosion-bubble { fill: #1A1A1A; }

/* 文字 */
.speech-text {
    font-family: "PingFang SC", sans-serif;
    font-size: 24px;
    font-weight: 700;
    fill: #1A1A1A;
}
```

### 人物绘制（火柴人风格）

**基本结构：**
```svg
<!-- 头：圆形 -->
<circle cx="100" cy="60" r="45" class="stroke-main"/>

<!-- 眼睛：两个小圆点 -->
<circle cx="85" cy="55" r="5" class="fill-main"/>
<circle cx="115" cy="55" r="5" class="fill-main"/>

<!-- 嘴巴：弧线 -->
<path d="M90 80 Q100 75, 110 80" class="stroke-main"/>

<!-- 身体：竖线 -->
<path d="M100 105 L100 200" class="stroke-main" stroke-width="4"/>

<!-- 手臂 -->
<path d="M100 130 L60 100" class="stroke-main" stroke-width="4"/>
<path d="M100 130 L140 160" class="stroke-main" stroke-width="4"/>

<!-- 腿 -->
<path d="M100 200 L70 280" class="stroke-main" stroke-width="4"/>
<path d="M100 200 L130 280" class="stroke-main" stroke-width="4"/>
```

**表情变化：**
| 表情 | 眉毛 | 眼睛 | 嘴巴 | 附加 |
|------|------|------|------|------|
| 思考 | 皱眉（向内倾斜） | 正常 | 微下弯 | 托腮动作 |
| 踌躇 | 皱眉 | 正常 | 平直 | 挠头+汗滴 |
| 激动 | 上扬 | 睁大（椭圆） | 张开（椭圆） | 手臂张开 |
| 疑惑 | 一高一低 | 正常 | 歪斜 | - |

**汗滴绘制：**
```svg
<ellipse cx="170" cy="50" rx="5" ry="10" class="fill-main"/>
```

### 漫画元素

**对话框（白色背景+黑边）：**
```svg
<path d="M0 20 Q0 0, 20 0 L380 0 Q400 0, 400 20 L400 80 Q400 100, 380 100 L210 100 L200 130 L190 100 L20 100 Q0 100, 0 80 Z"
      class="speech-bubble"/>
<text x="200" y="55" text-anchor="middle" class="speech-text">对话内容</text>
```

**思考框（可省略小气泡，更简洁）：**
```svg
<!-- 只需主气泡，不需要小圆点 -->
<path d="M0 60 Q0 0, 60 0 L340 0 Q400 0, 400 60 L400 120 Q400 180, 340 180 L120 180 L80 220 L90 180 L60 180 Q0 180, 0 120 Z"
      class="speech-bubble"/>
```

**爆炸框（星形，黑底白字）：**
```svg
<path d="M60 0 L85 40 L130 25 L120 75 L170 90 L120 110 L130 160 L85 145 L60 185 L35 145 L-10 160 L0 110 L-50 90 L0 75 L-10 25 L35 40 Z"
      class="explosion-bubble"/>
<text x="60" y="85" text-anchor="middle" class="speech-text explosion-text" font-size="18">文字</text>
```

### 构图原则

**位置规范：**
- 对话框：画面中上方（y: 20-30），避免与底部字幕重叠
- 主角：占画面 50%+，根据剧情居左/居中/居右
- 配角/物品：占画面 20-30%
- 多人场景：主角居中，配角围绕成圈

**常见构图模板：**

1. **单人思考**
   - 人物居左（占 60%）
   - 对话框右上方
   - 可选：小物品在右下角

2. **物品特写**
   - 物品居中放大
   - 对话框在上方
   - 人物可消失

3. **人机互动**
   - 人物一侧
   - 物品另一侧
   - 对话框上方

4. **多人围观**
   - 主角居中
   - 配角 8-12 人围绕成圈
   - 配角手持手机（黑色小矩形）

### 文字规范

| 元素 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| 对话框文字 | 24px | 700 | #1A1A1A |
| 爆炸框文字 | 18px | 700 | #fff |
| 代码文字 | 16px | 400 | #444 |

## 组件样式

### 提示词框
```css
.prompt-box {
  background: var(--banner-bg);
  border-radius: 10px;
  padding: 14px 22px;
  border-left: 4px solid var(--accent-color);
  /* 不设 max-height，完整显示 */
}
```

### 分数卡片
```css
.score-item {
  padding: 8px 22px;
  border-radius: 8px;
  background: var(--banner-bg);
  min-width: 160px;
}
/* 最高分橙色高亮 */
.score-item.winner .s-value {
  color: var(--accent-color);
}
```

### 图片卡片
```css
.image-card {
  flex: 1;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.image-card img {
  width: 100%;
  max-height: 38vh;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: #fff;
}
```

## 键盘控制

```javascript
// 右箭头 / 空格 / 回车 = 下一步
// 左箭头 / 退格 = 上一步
// Home = 第一页
// End = 最后一页（全部展开）
```

## 隐藏元素（录屏用途）

不显示页码指示器和按键提示：
```css
.page-indicator { display: none; }
.key-hint { display: none; }
```

仅保留底部进度条。
