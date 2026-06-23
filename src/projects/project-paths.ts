import { join } from "node:path";

export function projectRootPath(projectsDir: string, projectId: string): string {
  return join(projectsDir, projectId);
}

export function metadataPath(projectRoot: string): string {
  return join(projectRoot, "metadata.yaml");
}

export function scriptPath(projectRoot: string): string {
  return join(projectRoot, "script.md");
}

export function visualRoutingYamlPath(projectRoot: string): string {
  return join(projectRoot, "visual-routing.yaml");
}

export function visualRoutingMarkdownPath(projectRoot: string): string {
  return join(projectRoot, "visual-routing.md");
}

export function segmentsRootPath(projectRoot: string): string {
  return join(projectRoot, "segments");
}

export function segmentRootPath(projectRoot: string, segmentDirectoryName: string): string {
  return join(segmentsRootPath(projectRoot), segmentDirectoryName);
}

export function productionPlanYamlPath(segmentRoot: string): string {
  return join(segmentRoot, "production-plan.yaml");
}

export function productionPlanMarkdownPath(segmentRoot: string): string {
  return join(segmentRoot, "production-plan.md");
}

export function slidesHtmlPath(segmentRoot: string): string {
  return join(segmentRoot, "slides.html");
}

export function renderHtmlPath(segmentRoot: string): string {
  return join(segmentRoot, "render.html");
}

export function assetsPath(root: string): string {
  return join(root, "assets");
}

export function exportsPath(root: string): string {
  return join(root, "exports");
}
