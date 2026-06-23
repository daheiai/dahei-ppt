import { mkdir, readFile, writeFile } from "node:fs/promises";
import YAML from "yaml";
import {
  assetsPath,
  exportsPath,
  metadataPath,
  productionPlanYamlPath,
  projectRootPath,
  scriptPath,
  segmentRootPath,
  segmentsRootPath,
  visualRoutingYamlPath
} from "./project-paths.js";
import {
  parseProductionPlan,
  parseVisualRouting,
  type ProductionPlan,
  type VisualRoutingPlan,
  type VisualRoutingSegment
} from "../schema/index.js";

export interface ProjectRef {
  id: string;
  root: string;
}

export interface SegmentRef {
  id: string;
  directoryName: string;
  root: string;
}

export interface CreateProjectOptions {
  projectsDir: string;
  id: string;
  title: string;
}

export async function createProject(options: CreateProjectOptions): Promise<ProjectRef> {
  const root = projectRootPath(options.projectsDir, options.id);

  await mkdir(root, { recursive: true });
  await mkdir(segmentsRootPath(root), { recursive: true });
  await writeFile(metadataPath(root), YAML.stringify({ id: options.id, title: options.title }), "utf8");
  await writeFile(scriptPath(root), "", "utf8");

  return { id: options.id, root };
}

export async function readScript(projectRoot: string): Promise<string> {
  return readFile(scriptPath(projectRoot), "utf8");
}

export async function writeScript(projectRoot: string, script: string): Promise<void> {
  await writeFile(scriptPath(projectRoot), script, "utf8");
}

export async function readVisualRouting(projectRoot: string): Promise<VisualRoutingPlan> {
  const raw = await readFile(visualRoutingYamlPath(projectRoot), "utf8");
  return parseVisualRouting(YAML.parse(raw));
}

export async function writeVisualRouting(
  projectRoot: string,
  routingPlan: VisualRoutingPlan
): Promise<void> {
  const parsed = parseVisualRouting(routingPlan);
  await writeFile(visualRoutingYamlPath(projectRoot), YAML.stringify(parsed), "utf8");
}

export async function createSegmentFromRoutingSegment(
  projectRoot: string,
  segment: VisualRoutingSegment
): Promise<SegmentRef> {
  const directoryName = `${segment.id}-${segment.visual_mode}`;
  const root = segmentRootPath(projectRoot, directoryName);

  await mkdir(root, { recursive: true });
  await mkdir(assetsPath(root), { recursive: true });
  await mkdir(exportsPath(root), { recursive: true });
  await writeFile(scriptPath(root), segment.source_text, "utf8");

  return { id: segment.id, directoryName, root };
}

export async function writeProductionPlan(
  segmentRoot: string,
  productionPlan: ProductionPlan
): Promise<void> {
  const parsed = parseProductionPlan(productionPlan);
  await writeFile(productionPlanYamlPath(segmentRoot), YAML.stringify(parsed), "utf8");
}

export async function readProductionPlan(segmentRoot: string): Promise<ProductionPlan> {
  const raw = await readFile(productionPlanYamlPath(segmentRoot), "utf8");
  return parseProductionPlan(YAML.parse(raw));
}
