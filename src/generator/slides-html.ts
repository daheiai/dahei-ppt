import { baseStyle } from "../templates/base-style.js";
import { slidesRuntime } from "../templates/slides-runtime.js";
import type { ProductionPlan, ProductionPlanPage } from "../schema/index.js";

export function generateSlidesHtml(plan: ProductionPlan): string {
  const pages = plan.pages.map(renderPage).join("\n");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(plan.video.title)}</title>
    <style>
${baseStyle}
    </style>
  </head>
  <body>
    <main class="stage" data-format="3:2">
${pages}
      <div class="progress" aria-hidden="true"><div class="progress-bar"></div></div>
    </main>
    <script>
${slidesRuntime}
    </script>
  </body>
</html>
`;
}

function renderPage(page: ProductionPlanPage, index: number): string {
  const activeClass = index === 0 ? " active" : "";

  return `      <section class="page${activeClass}" data-page-id="${escapeHtml(page.id)}">
        <div class="page-inner ${escapeHtml(page.template)}">
${renderPageContent(page)}
        </div>
      </section>`;
}

function renderPageContent(page: ProductionPlanPage): string {
  if (page.template === "compare") {
    return renderComparePage(page);
  }

  if (page.template === "number_scale") {
    return renderNumberScalePage(page);
  }

  if (page.template === "threshold_line") {
    return renderThresholdPage(page);
  }

  if (page.template === "quote_punch") {
    return renderQuotePage(page);
  }

  return `          <h1 class="headline">${escapeHtml(page.text.title)}</h1>${renderSubtitle(page)}`;
}

function renderComparePage(page: ProductionPlanPage): string {
  const labels = page.text.labels ?? [];
  const cards = labels
    .map((label) => {
      const [name, value] = label.split("：");
      return `            <div class="compare-card" data-label="${escapeHtml(label)}">
              <span>${escapeHtml(name ?? label)}</span>
              <strong>${escapeHtml(value ?? "")}</strong>
            </div>`;
    })
    .join("\n");

  return `          <h1 class="headline">${escapeHtml(page.text.title)}</h1>
          <div class="compare-grid">
${cards}
          </div>`;
}

function renderNumberScalePage(page: ProductionPlanPage): string {
  return `          <div class="number-scale">
            <h1 class="headline">${escapeHtml(page.text.title)}</h1>
${renderSubtitle(page)}
          </div>`;
}

function renderThresholdPage(page: ProductionPlanPage): string {
  return `          <div class="threshold">
            <h1 class="headline">${escapeHtml(page.text.title)}</h1>
            <div class="threshold-track"><div class="threshold-fill"></div></div>
          </div>`;
}

function renderQuotePage(page: ProductionPlanPage): string {
  return `          <div class="quote">
            <h1 class="headline">${escapeHtml(page.text.title)}</h1>
${renderSubtitle(page)}
          </div>`;
}

function renderSubtitle(page: ProductionPlanPage): string {
  if (!page.text.subtitle) {
    return "";
  }

  return `\n          <p class="subtitle">${escapeHtml(page.text.subtitle)}</p>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
