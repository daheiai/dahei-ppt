import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createProject, writeScript } from "../../projects/project-files.js";
import { visualRoutingMarkdownPath, visualRoutingYamlPath } from "../../projects/project-paths.js";
import { planRoutingCommand } from "./plan-routing.js";

describe("planRoutingCommand", () => {
  it("writes visual routing YAML and Markdown from project script", async () => {
    const projectsDir = await mkdtemp(join(tmpdir(), "dahei-ppt-routing-"));
    const project = await createProject({
      projectsDir,
      id: "sample",
      title: "Sample"
    });
    await writeScript(project.root, "GPT 一小时 10 块，Claude 最高可能 40 块。");

    const result = await planRoutingCommand(["--project", project.root]);

    expect(result.segmentsCount).toBe(1);
    expect(await readFile(visualRoutingYamlPath(project.root), "utf8")).toContain(
      "visual_mode: animation"
    );
    expect(await readFile(visualRoutingMarkdownPath(project.root), "utf8")).toContain("动画");
  });
});
