import { writeFile } from "node:fs/promises";
import { planVisualRoutingFromScript, formatVisualRoutingMarkdown } from "../../planners/visual-routing-planner.js";
import { readScript, writeVisualRouting } from "../../projects/project-files.js";
import { visualRoutingMarkdownPath, visualRoutingYamlPath } from "../../projects/project-paths.js";
import { requireOption } from "../args.js";

export interface PlanRoutingResult {
  segmentsCount: number;
  yamlPath: string;
  markdownPath: string;
}

export async function planRoutingCommand(args: string[] = []): Promise<PlanRoutingResult> {
  const projectRoot = requireOption(args, "--project");
  const script = await readScript(projectRoot);
  const plan = planVisualRoutingFromScript(script);
  const markdownPath = visualRoutingMarkdownPath(projectRoot);
  const yamlPath = visualRoutingYamlPath(projectRoot);

  await writeVisualRouting(projectRoot, plan);
  await writeFile(markdownPath, formatVisualRoutingMarkdown(plan), "utf8");

  return {
    segmentsCount: plan.segments.length,
    yamlPath,
    markdownPath
  };
}
