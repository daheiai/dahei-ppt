import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ProductionPlan, VisualRoutingPlan } from "../schema/index.js";
import {
  createProject,
  createSegmentFromRoutingSegment,
  readScript,
  readVisualRouting,
  writeProductionPlan,
  writeScript,
  writeVisualRouting
} from "./project-files.js";
import { productionPlanYamlPath, scriptPath, visualRoutingYamlPath } from "./project-paths.js";

const routingPlan: VisualRoutingPlan = {
  segments: [
    {
      id: "segment_01",
      source_block_ids: ["block_01"],
      source_text: "GPT 一小时 10 块，Claude 最高可能 40 块。",
      boundary_action: "keep",
      boundary_reason: "完整的成本对比单元",
      visual_mode: "animation",
      visual_mode_reason: "数字倍数关系适合动画",
      animation_candidate: true,
      user_status: "accepted"
    }
  ]
};

const productionPlan: ProductionPlan = {
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
      source: "GPT 一小时 10 块",
      keep_reason: "成本基准必须保留",
      purpose: "建立 GPT 的价格基准",
      visual_subject: "10 元/小时",
      semantic_type: "number_argument",
      template: "number_scale",
      text: {
        title: "GPT：约 10 元/小时"
      },
      duration: 3
    }
  ]
};

describe("project file utilities", () => {
  it("creates project files and an animation segment with YAML plans", async () => {
    const projectsDir = await mkdtemp(join(tmpdir(), "dahei-ppt-projects-"));
    const project = await createProject({
      projectsDir,
      id: "sample",
      title: "Sample Video"
    });

    await writeScript(project.root, "完整文案");
    await writeVisualRouting(project.root, routingPlan);

    expect(await readScript(project.root)).toBe("完整文案");
    expect(await readVisualRouting(project.root)).toEqual(routingPlan);
    expect(await readFile(visualRoutingYamlPath(project.root), "utf8")).toContain("visual_mode: animation");

    const segment = await createSegmentFromRoutingSegment(project.root, routingPlan.segments[0]!);
    await writeProductionPlan(segment.root, productionPlan);

    expect(await readFile(scriptPath(segment.root), "utf8")).toBe(routingPlan.segments[0]!.source_text);
    expect(await readFile(productionPlanYamlPath(segment.root), "utf8")).toContain("number_scale");
  });
});
