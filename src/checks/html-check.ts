import { createResult, type QualityCheckResult, type QualityIssue } from "./types.js";

export function checkRenderHtml(html: string): QualityCheckResult {
  const issues: QualityIssue[] = [];
  const rootTag = findTag(html, "root");

  if (!rootTag) {
    issues.push({
      code: "missing_render_root",
      message: "render.html needs a root composition element.",
      path: "render.html#root",
      severity: "error"
    });
    return createResult(issues);
  }

  if (getAttribute(rootTag, "data-width") !== "3840" || getAttribute(rootTag, "data-height") !== "2560") {
    issues.push({
      code: "invalid_render_size",
      message: "Render composition must be 3840x2560.",
      path: "render.html#root",
      severity: "error"
    });
  }

  const clipTags = findClipTags(html);

  clipTags.forEach((clipTag, index) => {
    if (!getAttribute(clipTag, "data-start")) {
      issues.push({
        code: "clip_missing_start",
        message: "Clip needs data-start.",
        path: `render.html.clip[${index}]`,
        severity: "error"
      });
    }

    if (!getAttribute(clipTag, "data-duration")) {
      issues.push({
        code: "clip_missing_duration",
        message: "Clip needs data-duration.",
        path: `render.html.clip[${index}]`,
        severity: "error"
      });
    }

    if (!getAttribute(clipTag, "data-track-index")) {
      issues.push({
        code: "clip_missing_track",
        message: "Clip needs data-track-index.",
        path: `render.html.clip[${index}]`,
        severity: "error"
      });
    }
  });

  return createResult(issues);
}

function findTag(html: string, id: string): string | null {
  return html.match(new RegExp(`<[^>]+id=["']${id}["'][^>]*>`, "i"))?.[0] ?? null;
}

function findClipTags(html: string): string[] {
  return [...html.matchAll(/<[^>]+class=["'][^"']*\bclip\b[^"']*["'][^>]*>/gi)].map((match) => match[0]);
}

function getAttribute(tag: string, name: string): string | null {
  return tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1] ?? null;
}
