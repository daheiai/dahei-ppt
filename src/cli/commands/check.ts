import { access, readFile } from "node:fs/promises";
import { checkRenderHtml } from "../../checks/html-check.js";
import { checkProductionPlan } from "../../checks/production-plan-check.js";
import type { QualityIssue } from "../../checks/types.js";
import { readProductionPlan } from "../../projects/project-files.js";
import { renderHtmlPath, slidesHtmlPath } from "../../projects/project-paths.js";
import { requireOption } from "../args.js";

export interface CheckCommandResult {
  ok: boolean;
  issueCount: number;
  issues: QualityIssue[];
}

export async function checkCommand(args: string[] = []): Promise<CheckCommandResult> {
  const segmentRoot = requireOption(args, "--segment");
  const issues: QualityIssue[] = [];

  issues.push(...checkProductionPlan(await readProductionPlan(segmentRoot)).issues);
  issues.push(...(await checkSlidesHtml(segmentRoot)));
  issues.push(...(await checkRenderHtmlFile(segmentRoot)));

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    issueCount: issues.length,
    issues
  };
}

async function checkSlidesHtml(segmentRoot: string): Promise<QualityIssue[]> {
  try {
    await access(slidesHtmlPath(segmentRoot));
    return [];
  } catch {
    return [
      {
        code: "missing_slides_html",
        message: "slides.html is missing.",
        path: "slides.html",
        severity: "error"
      }
    ];
  }
}

async function checkRenderHtmlFile(segmentRoot: string): Promise<QualityIssue[]> {
  try {
    const html = await readFile(renderHtmlPath(segmentRoot), "utf8");
    return checkRenderHtml(html).issues;
  } catch {
    return [
      {
        code: "missing_render_html",
        message: "render.html is missing.",
        path: "render.html",
        severity: "error"
      }
    ];
  }
}
