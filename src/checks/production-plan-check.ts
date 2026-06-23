import type { ProductionPlan } from "../schema/index.js";
import { createResult, type QualityCheckResult, type QualityIssue } from "./types.js";

const maxTitleLength = 18;
const maxTotalDuration = 180;
const knownTemplates = new Set([
  "big_claim",
  "compare",
  "number_scale",
  "threshold_line",
  "quote_punch",
  "timeline",
  "device_flow",
  "relationship_map",
  "screenshot_focus",
  "card_stack"
]);

export function checkProductionPlan(plan: ProductionPlan): QualityCheckResult {
  const issues: QualityIssue[] = [];
  let totalDuration = 0;

  plan.pages.forEach((page, index) => {
    const path = `pages[${index}]`;
    totalDuration += page.duration;

    if (page.text.title.length > maxTitleLength) {
      issues.push({
        code: "page_title_too_long",
        message: `Page title is longer than ${maxTitleLength} characters.`,
        path: `${path}.text.title`,
        severity: "warning"
      });
    }

    if (page.duration <= 0) {
      issues.push({
        code: "invalid_duration",
        message: "Page duration must be positive seconds.",
        path: `${path}.duration`,
        severity: "error"
      });
    }

    if (!page.visual_subject.trim()) {
      issues.push({
        code: "missing_visual_subject",
        message: "Each page needs one visual subject.",
        path: `${path}.visual_subject`,
        severity: "error"
      });
    }

    if (!knownTemplates.has(page.template)) {
      issues.push({
        code: "unknown_template",
        message: `Unknown template: ${page.template}`,
        path: `${path}.template`,
        severity: "error"
      });
    }
  });

  if (totalDuration > maxTotalDuration) {
    issues.push({
      code: "total_duration_too_long",
      message: `Total duration is longer than ${maxTotalDuration} seconds.`,
      path: "pages",
      severity: "warning"
    });
  }

  return createResult(issues);
}
