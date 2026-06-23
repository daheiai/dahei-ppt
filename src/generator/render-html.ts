import { hyperframesRuntime } from "../templates/hyperframes-runtime.js";
import type { ProductionPlan, ProductionPlanPage } from "../schema/index.js";

export function generateRenderHtml(plan: ProductionPlan): string {
  const totalDuration = sumDurations(plan);
  const clips = plan.pages
    .map((page, index) => renderClip(page, startTimeFor(plan, index)))
    .join("\n");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=${plan.video.width}, height=${plan.video.height}">
    <title>${escapeHtml(plan.video.title)}</title>
    <style>
${renderStyle(plan)}
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-width="${plan.video.width}"
      data-height="${plan.video.height}"
      data-duration="${totalDuration}"
      data-fps="${plan.video.fps}"
    >
${clips}
    </div>
    <script>
${hyperframesRuntime(totalDuration)}
    </script>
  </body>
</html>
`;
}

function renderClip(page: ProductionPlanPage, start: number): string {
  return `      <section id="${escapeHtml(page.id)}" class="clip" data-start="${start}" data-duration="${page.duration}" data-track-index="1">
        <div class="page-inner ${escapeHtml(page.template)}">
${renderPageContent(page)}
        </div>
      </section>`;
}

function renderPageContent(page: ProductionPlanPage): string {
  if (page.template === "compare") {
    return renderComparePage(page);
  }

  if (page.template === "threshold_line") {
    return `          <div class="threshold">
            <h1>${escapeHtml(page.text.title)}</h1>
            <div class="threshold-track"><div class="threshold-fill"></div></div>
          </div>`;
  }

  return `          <h1>${escapeHtml(page.text.title)}</h1>${renderSubtitle(page)}`;
}

function renderComparePage(page: ProductionPlanPage): string {
  const cards = (page.text.labels ?? [])
    .map((label) => {
      const [name, value] = label.split("：");
      return `            <div class="compare-card" data-label="${escapeHtml(label)}">
              <span>${escapeHtml(name ?? label)}</span>
              <strong>${escapeHtml(value ?? "")}</strong>
            </div>`;
    })
    .join("\n");

  return `          <h1>${escapeHtml(page.text.title)}</h1>
          <div class="compare-grid">
${cards}
          </div>`;
}

function renderSubtitle(page: ProductionPlanPage): string {
  if (!page.text.subtitle) {
    return "";
  }

  return `\n          <p>${escapeHtml(page.text.subtitle)}</p>`;
}

function renderStyle(plan: ProductionPlan): string {
  return `
* {
  box-sizing: border-box;
}

html,
body {
  width: ${plan.video.width}px;
  height: ${plan.video.height}px;
  margin: 0;
  overflow: hidden;
}

body {
  background: #faf9f6;
  color: #1a1a1a;
  font-family: "Noto Sans JP", Inter, sans-serif;
}

#root {
  position: relative;
  width: ${plan.video.width}px;
  height: ${plan.video.height}px;
  overflow: hidden;
  background: #faf9f6;
}

.clip {
  position: absolute;
  inset: 0;
  display: grid;
  align-items: center;
  padding: 9% 10% 12%;
  opacity: 0;
}

.clip.active {
  opacity: 1;
}

.page-inner {
  display: grid;
  gap: 108px;
}

h1 {
  max-width: 86%;
  margin: 0;
  font-size: 176px;
  line-height: 0.98;
  letter-spacing: 0;
  font-weight: 850;
}

p {
  margin: 0;
  color: #6f6a61;
  font-size: 72px;
  line-height: 1.18;
  letter-spacing: 0;
  font-weight: 650;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 82px;
  max-width: 86%;
}

.compare-card {
  min-height: 520px;
  border: 6px solid rgba(26, 26, 26, 0.14);
  border-radius: 8px;
  padding: 96px;
  display: grid;
  align-content: center;
  gap: 42px;
  background: rgba(255, 255, 255, 0.44);
}

.compare-card strong {
  color: #ff6b00;
  font-size: 132px;
  line-height: 1;
  letter-spacing: 0;
}

.compare-card span {
  color: #6f6a61;
  font-size: 58px;
  line-height: 1.18;
}

.threshold {
  width: min(86%, 2400px);
  display: grid;
  gap: 76px;
}

.threshold-track {
  height: 54px;
  border-radius: 999px;
  background: rgba(26, 26, 26, 0.14);
}

.threshold-fill {
  width: 74%;
  height: 100%;
  border-radius: inherit;
  background: #ff6b00;
}
`;
}

function startTimeFor(plan: ProductionPlan, index: number): number {
  return plan.pages.slice(0, index).reduce((sum, page) => sum + page.duration, 0);
}

function sumDurations(plan: ProductionPlan): number {
  return plan.pages.reduce((sum, page) => sum + page.duration, 0);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
