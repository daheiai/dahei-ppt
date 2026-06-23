import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ProductionPlan } from "../../schema/index.js";
import { writeProductionPlan } from "../../projects/project-files.js";
import { renderHtmlPath, slidesHtmlPath } from "../../projects/project-paths.js";
import { generateHtmlCommand } from "./generate-html.js";

const plan: ProductionPlan = {
  video: {
    title: "成本对比",
    format: "3:2",
    fps: 60,
    width: 3840,
    height: 2560
  },
  pages: [
    {
      id: "page_01",
      source: "项目要求本身比较高",
      keep_reason: "建立成本讨论前提",
      purpose: "说明成本敏感性",
      visual_subject: "项目要求",
      semantic_type: "core_claim",
      template: "big_claim",
      text: {
        title: "项目要求越高，成本越关键"
      },
      duration: 3
    }
  ]
};

describe("generateHtmlCommand", () => {
  it("writes slides.html and render.html from a segment production plan", async () => {
    const segmentRoot = await mkdtemp(join(tmpdir(), "dahei-ppt-html-"));
    await writeProductionPlan(segmentRoot, plan);

    const result = await generateHtmlCommand(["--segment", segmentRoot]);

    expect(result.slidesHtmlPath).toBe(slidesHtmlPath(segmentRoot));
    expect(result.renderHtmlPath).toBe(renderHtmlPath(segmentRoot));
    expect(await readFile(slidesHtmlPath(segmentRoot), "utf8")).toContain("项目要求越高，成本越关键");
    expect(await readFile(renderHtmlPath(segmentRoot), "utf8")).toContain('data-composition-id="main"');
  });
});
