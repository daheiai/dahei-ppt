import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createProject, writeScript, writeVisualRouting } from "../../projects/project-files.js";
import { productionPlanMarkdownPath, productionPlanYamlPath, scriptPath } from "../../projects/project-paths.js";
import { planVisualRoutingFromScript } from "../../planners/visual-routing-planner.js";
import { createSegmentCommand } from "./create-segment.js";

const costScript =
  "如果你的项目要求本身就比较高，假如跑1小时GPT大概能用10块钱的话，Claude得10~40块，那按照我上个月总共大概花了4000块，这个价格我还能承受的话，Claude翻个4倍的价格我就承受不了。而恰恰GPT在编程任务方面的能力可能还会更好，很难不选择它。";

describe("createSegmentCommand", () => {
  it("creates an animation segment and writes production plan files", async () => {
    const projectsDir = await mkdtemp(join(tmpdir(), "dahei-ppt-segment-"));
    const project = await createProject({ projectsDir, id: "sample", title: "Sample" });
    await writeScript(project.root, costScript);
    await writeVisualRouting(project.root, planVisualRoutingFromScript(costScript));

    const result = await createSegmentCommand(["--project", project.root, "--segment", "segment_01"]);

    expect(result.segmentRoot).toBe(join(project.root, "segments", "segment_01-animation"));
    expect(await readFile(scriptPath(result.segmentRoot), "utf8")).toBe(costScript);
    expect(await readFile(productionPlanYamlPath(result.segmentRoot), "utf8")).toContain(
      "template: number_scale"
    );
    expect(await readFile(productionPlanMarkdownPath(result.segmentRoot), "utf8")).toContain(
      "制作计划"
    );
  });
});
