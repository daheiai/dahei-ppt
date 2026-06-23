import { writeFile } from "node:fs/promises";
import {
  formatProductionPlanMarkdown,
  planProductionFromScript
} from "../../planners/production-plan-planner.js";
import {
  createSegmentFromRoutingSegment,
  readVisualRouting,
  writeProductionPlan
} from "../../projects/project-files.js";
import {
  productionPlanMarkdownPath,
  productionPlanYamlPath
} from "../../projects/project-paths.js";
import { requireOption } from "../args.js";

export interface CreateSegmentResult {
  segmentRoot: string;
  productionPlanYamlPath: string;
  productionPlanMarkdownPath: string;
}

export async function createSegmentCommand(args: string[] = []): Promise<CreateSegmentResult> {
  const projectRoot = requireOption(args, "--project");
  const segmentId = requireOption(args, "--segment");
  const routingPlan = await readVisualRouting(projectRoot);
  const segment = routingPlan.segments.find((item) => item.id === segmentId);

  if (!segment) {
    throw new Error(`Unknown segment: ${segmentId}`);
  }

  if (segment.visual_mode !== "animation") {
    throw new Error(`Segment ${segmentId} is ${segment.visual_mode}; only animation segments enter production.`);
  }

  const segmentRef = await createSegmentFromRoutingSegment(projectRoot, segment);
  const productionPlan = planProductionFromScript(segment.source_text, `${segment.id} 动画片段`);
  const markdownPath = productionPlanMarkdownPath(segmentRef.root);
  const yamlPath = productionPlanYamlPath(segmentRef.root);

  await writeProductionPlan(segmentRef.root, productionPlan);
  await writeFile(markdownPath, formatProductionPlanMarkdown(productionPlan), "utf8");

  return {
    segmentRoot: segmentRef.root,
    productionPlanYamlPath: yamlPath,
    productionPlanMarkdownPath: markdownPath
  };
}
