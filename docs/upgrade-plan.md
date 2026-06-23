# dahei-ppt 升级路线图

## 目标

把 `dahei-ppt` 从“网页演示文稿生成器”逐步升级成“网页分镜动画生成器”。

核心方向：

- 保留现有风格：米白背景、深黑文字、橙色强调、大标题、大留白、单页一个重点。
- 固定 3:2 画幅，服务现有录屏和视频工作流。
- 继续使用 HTML/CSS/JS 作为主要产出形态。
- 从外部项目吸收分镜、模板、动效、渲染、设计规范经验。
- 每一步都形成可直接用于视频制作的成果。

## 当前研究资料

研究资料备份在当前工作目录外层：

- `../research_references/local_skills/dahei-ppt`
- `../research_references/repos/hyperframes`
- `../research_references/repos/remotion`
- `../research_references/repos/guizang-ppt-skill`
- `../research_references/repos/huashu-design`

本地视频样本：

- `../93a96201c37de8937b09909fcd76fa83.mp4`
- `../ad282687e8523132d10dbc17e6deea52.mp4`
- `../785dfadf1920437800dee4002c2f4a06.mp4`

已观察到的核心经验：

- 主物体跨镜头保留。
- 左侧或顶部章节标题承担结构提示。
- 画面文字极少，旁白承担解释。
- 动效集中在滑入、淡入、缩放、连线生长、背景慢移动。
- 信息以“一个场景一个动作”的方式推进。

## 参考项目吸收方向

### HyperFrames

吸收重点：

- HTML 直接作为视频画面。
- 时间轴和渲染链路面向 AI 生成。
- 动画状态可按时间 seek。
- 从预览到 MP4 的闭环体验。

适合沉淀到 `dahei-ppt` 的部分：

- 自动播放时间轴。
- HTML 到视频的渲染思路。
- 面向 agent 的生成约束。

### Remotion

吸收重点：

- 用组件表达画面。
- 用 frame 表达时间。
- 用 `Sequence` 表达分镜。
- 用可复用组件组织复杂视频。

适合沉淀到 `dahei-ppt` 的部分：

- 分镜结构。
- 模板组件化思维。
- 动画参数统一管理。

### guizang-ppt-skill

吸收重点：

- PPT skill 的结构化提示方式。
- 从内容到页面的规划流程。
- 对页面审美、字体、布局的约束表达。

适合沉淀到 `dahei-ppt` 的部分：

- 页面规划提示词。
- 设计规则写法。
- 可复制的生成流程。

### huashu-design

吸收重点：

- 设计语言沉淀方式。
- 组件、配色、排版、页面气质的规范化表达。
- 面向内容创作的视觉系统。

适合沉淀到 `dahei-ppt` 的部分：

- 更完整的设计系统。
- 模板风格命名。
- 视觉质量检查清单。

## 升级阶段

### 阶段 1：整理现有 dahei-ppt

目标：把现有 skill 变成一个稳定基线。

产出：

- `SKILL.md` 结构梳理。
- `reference/design_system.md` 升级。
- `reference/templates.md` 新增模板目录说明。
- `reference/quality_checklist.md` 新增视觉检查清单。

重点规则：

- 固定 3:2 画幅。
- 每页只有一个核心重点。
- 每页都要有旁白句。
- 画面文字服务视觉记忆点。
- 底部保留字幕安全区。

### 阶段 2：加入 storyboard 中间层

目标：让 AI 先做分镜，再写 HTML。

新增文件规范：

```yaml
video:
  title: 账号体系的变化
  format: "3:2"
  style: dahei-minimal

scenes:
  - id: scene_01
    type: timeline
    duration: 5
    narration: 早期互联网，QQ 是很多人的第一个身份入口。
    visual_focus: QQ 与微信的交接
    text:
      title: QQ 与微信
      subtitle: 身份入口的变化
    beats:
      - show_qq
      - show_year
      - show_wechat
```

产出：

- `reference/storyboard_schema.md`
- `examples/storyboard-basic.yaml`
- `examples/storyboard-from-script.md`

### 阶段 3：加入自动播放时间轴

目标：同一个 HTML 支持手动录屏和自动播放。

保留能力：

- 方向键逐步揭示。
- 空格进入下一步。
- 左箭头回退。

新增能力：

- `?autoplay=1` 自动播放。
- `?t=3.2` 定位到指定时间。
- 每个分镜有 `duration`。
- 每个元素有进入时间和退出时间。

示例：

```js
const timeline = [
  { at: 0.0, action: "show", target: "title" },
  { at: 0.8, action: "show", target: "phone" },
  { at: 1.6, action: "draw", target: "line" },
  { at: 2.4, action: "highlight", target: "keyword" }
];
```

### 阶段 4：沉淀核心模板库

目标：让常见视频段落可复用。

第一批模板：

1. `big_claim`：大字观点页
2. `timeline`：历史演化页
3. `device_flow`：手机、电脑、应用界面流程页
4. `relationship_map`：人物、机构、概念关系页
5. `screenshot_focus`：截图放大、框选、标注页
6. `compare`：前后、左右、方案对比页
7. `card_stack`：卡片递进页
8. `quote_punch`：结论收束页

每个模板包含：

- 适用场景。
- 输入字段。
- 默认布局。
- 默认动效。
- 字号和留白规则。
- 失败案例提醒。

### 阶段 5：建立视觉质量检查

目标：让每次生成都能通过基础审美检查。

检查项：

- 3:2 画幅完整显示。
- 字号适合手机观看。
- 文字量控制在一眼能读完。
- 主视觉高于几何中心。
- 底部留出字幕区。
- 动效节奏清楚。
- 同一个主物体跨场景移动时保持连续。
- 连线和箭头指向准确。

工具方向：

- 浏览器截图。
- 抽帧检查。
- 对关键帧做人工审阅。

### 阶段 6：自动导出视频

目标：从 HTML 到 MP4 形成闭环。

推荐路线：

1. Playwright 打开 HTML。
2. 按固定帧率截图。
3. ffmpeg 合成 MP4。
4. 输出预览图和关键帧拼图。

产出：

- `scripts/render_html_to_frames.py` 或 JS 版脚本。
- `scripts/frames_to_video.sh`
- `output/*.mp4`
- `output/contact_sheet.jpg`

## 第一轮实施建议

第一轮只做三件事：

1. 整理现有 `dahei-ppt` 规则。
2. 写 `storyboard_schema.md`。
3. 做一个 20 秒样片，覆盖 `big_claim`、`timeline`、`relationship_map` 三个模板。

样片目标：

- 固定 3:2。
- 使用本地视频样本的动效经验。
- 保持 `dahei-ppt` 的极简风格。
- 生成 HTML。
- 手动录屏即可进入视频剪辑流程。

## 后续工作顺序

1. 分析四个参考项目的文档和示例。
2. 提炼可吸收规则，写入 `docs/research-notes.md`。
3. 升级 `reference/design_system.md`。
4. 定义 `reference/storyboard_schema.md`。
5. 实作前三个模板。
6. 制作 20 秒样片。
7. 根据样片反馈继续扩展模板。
