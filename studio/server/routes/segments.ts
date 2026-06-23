import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { readProductionPlan, readVisualRouting } from "../../../src/projects/project-files.js";
import {
  productionPlanMarkdownPath,
  projectRootPath,
  renderHtmlPath,
  segmentRootPath,
  segmentsRootPath,
  slidesHtmlPath
} from "../../../src/projects/project-paths.js";
import {
  ApiError,
  assertRecord,
  requireStringField,
  safePathPart,
  type ApiResponse,
  type StudioContext
} from "../types.js";

export async function handleSegmentRoute(
  method: string,
  pathname: string,
  body: unknown,
  context: StudioContext
): Promise<ApiResponse | undefined> {
  const createMatch = pathname.match(/^\/api\/projects\/([^/]+)\/segments$/);
  if (createMatch && method === "POST") {
    const projectRoot = resolveProjectRoot(context.projectsDir, createMatch[1]!);
    const payload = assertRecord(body, "request body");
    const segmentId = safePathPart(requireStringField(payload, "segmentId"), "segment id");
    const segmentRoot = await resolveSegmentRoot(projectRoot, segmentId);

    await context.commandRunner.run(["create-segment", "--project", projectRoot, "--segment", segmentId]);

    return { status: 201, body: { segmentId, segmentRoot } };
  }

  const detailMatch = pathname.match(/^\/api\/projects\/([^/]+)\/segments\/([^/]+)$/);
  if (detailMatch && method === "GET") {
    const projectRoot = resolveProjectRoot(context.projectsDir, detailMatch[1]!);
    const segmentId = safePathPart(decodeURIComponent(detailMatch[2]!), "segment id");
    const segmentRoot = await resolveSegmentRoot(projectRoot, segmentId);

    return {
      status: 200,
      body: {
        id: segmentId,
        root: segmentRoot,
        productionPlanMarkdown: await readOptionalText(productionPlanMarkdownPath(segmentRoot)),
        productionPlan: await readOptionalProductionPlan(segmentRoot),
        slidesHtml: await readOptionalText(slidesHtmlPath(segmentRoot)),
        hasRenderHtml: await pathExists(renderHtmlPath(segmentRoot))
      }
    };
  }

  const actionMatch = pathname.match(/^\/api\/projects\/([^/]+)\/segments\/([^/]+)\/(generate-html|render)$/);
  if (actionMatch && method === "POST") {
    const projectRoot = resolveProjectRoot(context.projectsDir, actionMatch[1]!);
    const segmentId = safePathPart(decodeURIComponent(actionMatch[2]!), "segment id");
    const segmentRoot = await resolveSegmentRoot(projectRoot, segmentId);
    const command = actionMatch[3]!;

    const result = await context.commandRunner.run([command, "--segment", segmentRoot]);

    return { status: 200, body: { ok: true, segmentId, segmentRoot, stdout: result.stdout, stderr: result.stderr } };
  }

  return undefined;
}

async function readOptionalText(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return null;
  }
}

async function readOptionalProductionPlan(segmentRoot: string): Promise<unknown> {
  try {
    return await readProductionPlan(segmentRoot);
  } catch {
    return null;
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function resolveProjectRoot(projectsDir: string, rawProjectId: string): string {
  const projectId = safePathPart(decodeURIComponent(rawProjectId), "project id");
  return projectRootPath(projectsDir, projectId);
}

async function resolveSegmentRoot(projectRoot: string, segmentId: string): Promise<string> {
  try {
    const routingPlan = await readVisualRouting(projectRoot);
    const segment = routingPlan.segments.find((item) => item.id === segmentId);

    if (segment) {
      return segmentRootPath(projectRoot, `${segment.id}-${segment.visual_mode}`);
    }
  } catch {
    // Existing segment directories are enough for generate/render actions.
  }

  const existingDirectory = await findExistingSegmentDirectory(projectRoot, segmentId);

  if (existingDirectory) {
    return join(segmentsRootPath(projectRoot), existingDirectory);
  }

  throw new ApiError(404, "Segment was not found.");
}

async function findExistingSegmentDirectory(projectRoot: string, segmentId: string): Promise<string | null> {
  try {
    const entries = await readdir(segmentsRootPath(projectRoot), { withFileTypes: true });
    return entries.find((entry) => entry.isDirectory() && entry.name.startsWith(`${segmentId}-`))?.name ?? null;
  } catch {
    return null;
  }
}
