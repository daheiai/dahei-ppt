# dahei-ppt Studio v1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the first usable `dahei-ppt` Studio workflow: full script planning, color-coded visual routing, animation segment production plans, 3:2 HTML preview, and HyperFrames MP4 export.

**Architecture:** Keep `dahei-ppt` as Skill + Studio. The skill remains the brain for content planning and generation; Studio becomes the local production workbench. Source files stay in project folders, and generated videos stay in each project's `exports/`.

**Tech Stack:** Node.js, TypeScript, npm, Zod, Vite, React, HyperFrames CLI, self-contained HTML output.

---

## Implementation Principles

- Preserve the current dahei style: 3:2 canvas, warm off-white background, black text, orange emphasis, large typography, strong whitespace.
- Keep one visual subject per page.
- Use the delete test before generating pages: remove every word, element, or page that can disappear while the logic still holds.
- Use original paragraphs as the first segmentation layer; let AI propose split and merge; let the user confirm.
- Produce human-readable Markdown and machine-readable YAML at every planning layer.
- Keep `slides.html` for manual preview and `render.html` for HyperFrames export.

## Target Project Shape

```text
studio/
  app/
  server/
  projects/
    2026-06-23-sample-video/
      metadata.yaml
      script.md
      visual-routing.md
      visual-routing.yaml
      segments/
        segment_03-animation/
          script.md
          production-plan.md
          production-plan.yaml
          slides.html
          render.html
          assets/
          exports/
```

## Task 1: Scaffold Node/TypeScript Workspace

**Files:**

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/index.ts`
- Create: `src/cli/index.ts`
- Create: `src/schema/index.ts`

**Step 1: Add package scripts**

Add scripts:

```json
{
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "dev:studio": "tsx studio/server/index.ts",
    "dahei-ppt": "tsx src/cli/index.ts"
  }
}
```

**Step 2: Add dependencies**

Run:

```bash
npm install zod yaml
npm install -D typescript tsx @types/node
```

**Step 3: Verify**

Run:

```bash
npm run typecheck
```

Expected: TypeScript completes.

**Step 4: Commit**

```bash
git add package.json package-lock.json tsconfig.json src
git commit -m "chore: scaffold typescript workspace"
```

## Task 2: Define Visual Routing Schema

**Files:**

- Create: `src/schema/visual-routing.ts`
- Create: `src/schema/visual-routing.test.ts`
- Modify: `src/schema/index.ts`

**Step 1: Write schema**

Define:

- `visual_mode`: `talking_head | animation | web_source | live_shoot`
- `boundary_action`: `keep | split | merge`
- `user_status`: `pending | accepted | edited`

Required fields:

- `id`
- `source_block_ids`
- `source_text`
- `boundary_action`
- `boundary_reason`
- `visual_mode`
- `visual_mode_reason`
- `animation_candidate`
- `user_status`

**Step 2: Add parser helper**

Export:

```ts
export function parseVisualRouting(input: unknown): VisualRoutingPlan
```

**Step 3: Verify**

Run:

```bash
npm run typecheck
```

Expected: schema types compile.

**Step 4: Commit**

```bash
git add src/schema
git commit -m "feat: add visual routing schema"
```

## Task 3: Define Production Plan Schema

**Files:**

- Create: `src/schema/production-plan.ts`
- Create: `src/schema/production-plan.test.ts`
- Modify: `src/schema/index.ts`

**Step 1: Implement Zod schema**

Match ADR 0023:

- `video.title`
- `video.format`
- `video.fps`
- `video.width`
- `video.height`
- `pages[].id`
- `pages[].source`
- `pages[].keep_reason`
- `pages[].purpose`
- `pages[].visual_subject`
- `pages[].semantic_type`
- `pages[].template`
- `pages[].text.title`
- `pages[].duration`

**Step 2: Add enums**

Semantic type enum:

```ts
core_claim
concept_definition
timeline_evolution
causal_relation
comparison_judgment
case_demo
data_explanation
number_argument
closing_claim
```

Template enum:

```ts
big_claim
compare
number_scale
threshold_line
quote_punch
timeline
device_flow
relationship_map
screenshot_focus
card_stack
```

**Step 3: Verify**

Run:

```bash
npm run typecheck
```

Expected: schema types compile.

**Step 4: Commit**

```bash
git add src/schema
git commit -m "feat: add production plan schema"
```

## Task 4: Add Project File Utilities

**Files:**

- Create: `src/projects/project-paths.ts`
- Create: `src/projects/project-files.ts`
- Create: `src/projects/project-files.test.ts`

**Step 1: Implement path helpers**

Create helpers for:

- project root
- `script.md`
- `visual-routing.yaml`
- `visual-routing.md`
- segment root
- `production-plan.yaml`
- `slides.html`
- `render.html`
- `assets/`
- `exports/`

**Step 2: Implement read and write helpers**

Use Node `fs/promises`.

Helpers:

- `createProject`
- `readScript`
- `writeScript`
- `readVisualRouting`
- `writeVisualRouting`
- `createSegmentFromRoutingSegment`
- `writeProductionPlan`

**Step 3: Verify**

Run:

```bash
npm run typecheck
```

Expected: project helpers compile.

**Step 4: Commit**

```bash
git add src/projects
git commit -m "feat: add project file utilities"
```

## Task 5: Build CLI Skeleton

**Files:**

- Modify: `src/cli/index.ts`
- Create: `src/cli/commands/init-project.ts`
- Create: `src/cli/commands/plan-routing.ts`
- Create: `src/cli/commands/create-segment.ts`
- Create: `src/cli/commands/generate-html.ts`
- Create: `src/cli/commands/render.ts`

**Step 1: Add commands**

Initial command list:

```bash
dahei-ppt init-project --name sample
dahei-ppt plan-routing --project studio/projects/sample
dahei-ppt create-segment --project studio/projects/sample --segment segment_03
dahei-ppt generate-html --segment studio/projects/sample/segments/segment_03-animation
dahei-ppt render --segment studio/projects/sample/segments/segment_03-animation
```

**Step 2: Implement argument parsing**

Use a small local parser first. Keep command arguments explicit.

**Step 3: Verify**

Run:

```bash
npm run dahei-ppt -- init-project --name sample
```

Expected: sample project folder is created.

**Step 4: Commit**

```bash
git add src/cli
git commit -m "feat: add dahei-ppt cli skeleton"
```

## Task 6: Implement Visual Routing Planner Stub

**Files:**

- Create: `src/planners/visual-routing-planner.ts`
- Modify: `src/cli/commands/plan-routing.ts`

**Step 1: Split original paragraphs into source blocks**

Read `script.md`, split by blank lines, create stable `block_01`, `block_02` ids.

**Step 2: Add heuristic visual mode suggestion**

First pass rules:

- numbers, comparisons, costs, thresholds -> `animation`
- screenshots, web pages, model output, news references -> `web_source`
- skit, real operation, physical demo -> `live_shoot`
- transitions, subjective judgment, intro/outro -> `talking_head`

**Step 3: Write Markdown and YAML**

Output:

- `visual-routing.yaml`
- `visual-routing.md`

**Step 4: Verify with sample script**

Use the GPT vs Claude cost paragraph from ADR 0023.

Expected: plan marks the paragraph as `animation` with `animation_candidate: true`.

**Step 5: Commit**

```bash
git add src/planners src/cli/commands/plan-routing.ts
git commit -m "feat: add visual routing planner"
```

## Task 7: Implement Production Plan Planner Stub

**Files:**

- Create: `src/planners/production-plan-planner.ts`
- Modify: `src/cli/commands/create-segment.ts`

**Step 1: Convert animation segment to pages**

For the sample paragraph, generate five pages:

1. Project requirement raises cost sensitivity.
2. GPT is about 10 yuan/hour; Claude is 10-40 yuan/hour.
3. 4000 yuan can become 16000 yuan.
4. 4000 yuan is acceptable; 4x crosses the budget line.
5. GPT also has strong coding ability, so it becomes the choice.

**Step 2: Write plan files**

Output:

- `production-plan.yaml`
- `production-plan.md`

**Step 3: Validate through Zod**

Run parser before writing files.

**Step 4: Commit**

```bash
git add src/planners src/cli/commands/create-segment.ts
git commit -m "feat: add production plan planner"
```

## Task 8: Generate Manual Preview HTML

**Files:**

- Create: `src/generator/slides-html.ts`
- Create: `src/templates/base-style.ts`
- Create: `src/templates/slides-runtime.ts`
- Modify: `src/cli/commands/generate-html.ts`

**Step 1: Generate `slides.html`**

Use current `dahei-ppt` rules:

- fixed 3:2 stage
- keyboard next and previous
- page fade transition
- bottom progress bar
- no creator-facing text inside the stage

**Step 2: Implement initial templates**

Support:

- `big_claim`
- `compare`
- `number_scale`
- `threshold_line`
- `quote_punch`

**Step 3: Verify locally**

Open `slides.html` in a browser.

Expected: arrow keys move through the five sample pages.

**Step 4: Commit**

```bash
git add src/generator src/templates src/cli/commands/generate-html.ts
git commit -m "feat: generate manual preview html"
```

## Task 9: Generate HyperFrames Render HTML

**Files:**

- Create: `src/generator/render-html.ts`
- Create: `src/templates/hyperframes-runtime.ts`
- Modify: `src/cli/commands/generate-html.ts`

**Step 1: Generate `render.html`**

Root requirements:

- `data-composition-id="main"`
- `data-width="3840"`
- `data-height="2560"`
- `data-duration` equals total page duration
- `data-fps="60"`

Clip requirements:

- direct child clips under root
- `class="clip"`
- `data-start`
- `data-duration`
- `data-track-index`

**Step 2: Register GSAP timeline**

Use a paused seekable timeline:

```js
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
window.__timelines.main = tl;
```

**Step 3: Verify with HyperFrames lint**

Run:

```bash
npx hyperframes lint .
```

Expected: lint completes for the sample segment.

**Step 4: Commit**

```bash
git add src/generator src/templates src/cli/commands/generate-html.ts
git commit -m "feat: generate hyperframes render html"
```

## Task 10: Wrap HyperFrames Render

**Files:**

- Modify: `src/cli/commands/render.ts`

**Step 1: Spawn HyperFrames CLI**

Command shape:

```bash
npx hyperframes render render.html -o exports/render.mp4
```

Run with segment directory as `cwd`.

**Step 2: Add preflight**

Check:

- `render.html` exists
- `exports/` exists or can be created
- output path ends with `.mp4`

**Step 3: Verify**

Run:

```bash
npm run dahei-ppt -- render --segment studio/projects/sample/segments/segment_03-animation
```

Expected: `exports/render.mp4` is created.

**Step 4: Commit**

```bash
git add src/cli/commands/render.ts
git commit -m "feat: wrap hyperframes rendering"
```

## Task 11: Scaffold Studio Local Server

**Files:**

- Create: `studio/server/index.ts`
- Create: `studio/server/routes/projects.ts`
- Create: `studio/server/routes/segments.ts`
- Modify: `package.json`

**Step 1: Add local API**

Routes:

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id/script`
- `PUT /api/projects/:id/visual-routing`
- `POST /api/projects/:id/segments`
- `POST /api/projects/:id/segments/:segmentId/generate-html`
- `POST /api/projects/:id/segments/:segmentId/render`

**Step 2: Call CLI from server**

Use `child_process.spawn`.

**Step 3: Verify**

Run:

```bash
npm run dev:studio
```

Expected: local server starts and exposes project list JSON.

**Step 4: Commit**

```bash
git add studio/server package.json
git commit -m "feat: add studio local api"
```

## Task 12: Scaffold Studio React App

**Files:**

- Create: `studio/app/index.html`
- Create: `studio/app/src/App.tsx`
- Create: `studio/app/src/main.tsx`
- Create: `studio/app/src/styles.css`
- Create: `studio/app/vite.config.ts`
- Modify: `package.json`

**Step 1: Install Vite and React**

Run:

```bash
npm install @vitejs/plugin-react vite react react-dom
npm install -D @types/react @types/react-dom
```

**Step 2: Add scripts**

```json
{
  "scripts": {
    "dev:app": "vite --config studio/app/vite.config.ts"
  }
}
```

**Step 3: Verify**

Run:

```bash
npm run dev:app
```

Expected: Studio UI opens with a project list placeholder.

**Step 4: Commit**

```bash
git add studio/app package.json package-lock.json
git commit -m "feat: scaffold studio react app"
```

## Task 13: Build Visual Routing Editor

**Files:**

- Create: `studio/app/src/components/VisualRoutingEditor.tsx`
- Create: `studio/app/src/components/SegmentPanel.tsx`
- Create: `studio/app/src/lib/visualMode.ts`
- Modify: `studio/app/src/App.tsx`
- Modify: `studio/app/src/styles.css`

**Step 1: Build left full-script highlight view**

Colors:

- green: `talking_head`
- red: `animation`
- yellow: `web_source`
- purple: `live_shoot`

**Step 2: Build right editing panel**

Fields:

- boundary action
- boundary reason
- visual mode
- visual mode reason
- material suggestion
- notes
- enter animation production

**Step 3: Save edits**

Send updated YAML model through local API.

**Step 4: Verify**

Expected: changing a segment color updates the right panel and persists on reload.

**Step 5: Commit**

```bash
git add studio/app/src
git commit -m "feat: add visual routing editor"
```

## Task 14: Build Animation Segment Workflow

**Files:**

- Create: `studio/app/src/components/ProductionPlanView.tsx`
- Create: `studio/app/src/components/HtmlPreview.tsx`
- Create: `studio/app/src/components/RenderPanel.tsx`
- Modify: `studio/app/src/App.tsx`

**Step 1: Add enter animation production action**

Clicking an animation segment creates a segment project under `segments/`.

**Step 2: Show production plan**

Load `production-plan.md` and `production-plan.yaml`.

**Step 3: Show HTML preview**

Use an iframe for `slides.html`.

**Step 4: Add render button**

Call local API to generate `render.mp4`.

**Step 5: Verify**

Expected: sample segment moves from routing plan to preview and render.

**Step 6: Commit**

```bash
git add studio/app/src
git commit -m "feat: add animation segment workflow"
```

## Task 15: Add Quality Checks

**Files:**

- Create: `src/checks/production-plan-check.ts`
- Create: `src/checks/html-check.ts`
- Modify: `src/cli/index.ts`

**Step 1: Add production plan checks**

Check:

- one visual subject per page
- page title length
- duration is positive seconds
- total duration is plausible
- known template enum

**Step 2: Add HTML checks**

Check:

- `slides.html` exists
- `render.html` exists
- render root has `3840x2560`
- all render clips have start, duration, and track index

**Step 3: Add command**

```bash
dahei-ppt check --segment studio/projects/sample/segments/segment_03-animation
```

**Step 4: Commit**

```bash
git add src/checks src/cli
git commit -m "feat: add dahei-ppt quality checks"
```

## Task 16: End-to-End Sample

**Files:**

- Create: `examples/gpt-vs-claude-cost/script.md`
- Create: `docs/examples/gpt-vs-claude-cost.md`

**Step 1: Add sample script**

Use:

```text
如果你的项目要求本身就比较高，假如跑1小时GPT大概能用10块钱的话，Claude得10~40块，那按照我上个月总共大概花了4000块，这个价格我还能承受的话，Claude翻个4倍的价格我就承受不了。而恰恰GPT在编程任务方面的能力可能还会更好，很难不选择它。
```

**Step 2: Run full flow**

```bash
npm run dahei-ppt -- init-project --name gpt-vs-claude-cost
npm run dahei-ppt -- plan-routing --project studio/projects/gpt-vs-claude-cost
npm run dahei-ppt -- create-segment --project studio/projects/gpt-vs-claude-cost --segment segment_01
npm run dahei-ppt -- generate-html --segment studio/projects/gpt-vs-claude-cost/segments/segment_01-animation
npm run dahei-ppt -- check --segment studio/projects/gpt-vs-claude-cost/segments/segment_01-animation
```

**Step 3: Verify preview**

Open:

```text
studio/projects/gpt-vs-claude-cost/segments/segment_01-animation/slides.html
```

Expected: five-page 3:2 animation preview with manual keyboard control.

**Step 4: Verify render**

```bash
npm run dahei-ppt -- render --segment studio/projects/gpt-vs-claude-cost/segments/segment_01-animation
```

Expected: `exports/render.mp4` is created.

**Step 5: Commit**

```bash
git add examples docs/examples
git commit -m "test: add gpt vs claude cost sample"
```

## First Milestone Definition

The first milestone is complete when:

- A full script can become a color-coded visual routing plan.
- An animation segment can become a production plan.
- The production plan can generate `slides.html` and `render.html`.
- `slides.html` supports manual keyboard preview.
- `render.html` can render through HyperFrames into `exports/render.mp4`.
- Studio can display and edit the routing plan.
- Studio can enter animation production from a red segment.
