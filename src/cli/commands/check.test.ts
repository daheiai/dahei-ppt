import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { generateRenderHtml } from "../../generator/render-html.js";
import { generateSlidesHtml } from "../../generator/slides-html.js";
import { writeProductionPlan } from "../../projects/project-files.js";
import { renderHtmlPath, slidesHtmlPath } from "../../projects/project-paths.js";
import type { ProductionPlan } from "../../schema/index.js";
import { checkCommand } from "./check.js";

describe("checkCommand", () => {
  it("passes a complete generated segment", async () => {
    const segmentRoot = join(tmpdir(), `dahei-ppt-check-${Date.now()}`);
    const plan = samplePlan();
    await mkdir(segmentRoot, { recursive: true });
    await writeProductionPlan(segmentRoot, plan);
    await writeFile(slidesHtmlPath(segmentRoot), generateSlidesHtml(plan), "utf8");
    await writeFile(renderHtmlPath(segmentRoot), generateRenderHtml(plan), "utf8");

    await expect(checkCommand(["--segment", segmentRoot])).resolves.toMatchObject({
      ok: true,
      issueCount: 0
    });
  });
});

function samplePlan(): ProductionPlan {
  return {
    video: {
      title: "Sample",
      format: "3:2",
      fps: 60,
      width: 3840,
      height: 2560
    },
    pages: [
      {
        id: "page_01",
        source: "source",
        keep_reason: "kept",
        purpose: "purpose",
        visual_subject: "预算线",
        semantic_type: "number_argument",
        template: "number_scale",
        text: {
          title: "4000 到 16000"
        },
        duration: 3
      }
    ]
  };
}
