import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import YAML from "yaml";
import { formatVisualRoutingMarkdown } from "../../../src/planners/visual-routing-planner.js";
import {
  createProject,
  readScript,
  readVisualRouting,
  writeScript,
  writeVisualRouting
} from "../../../src/projects/project-files.js";
import {
  metadataPath,
  projectRootPath,
  scriptPath,
  segmentsRootPath,
  visualRoutingMarkdownPath,
  visualRoutingYamlPath
} from "../../../src/projects/project-paths.js";
import { parseVisualRouting } from "../../../src/schema/index.js";
import {
  ApiError,
  assertRecord,
  requireStringField,
  safePathPart,
  type ApiResponse,
  type StudioContext
} from "../types.js";

export async function handleProjectRoute(
  method: string,
  pathname: string,
  body: unknown,
  context: StudioContext
): Promise<ApiResponse | undefined> {
  if (pathname === "/api/projects" && method === "GET") {
    return { status: 200, body: { projects: await listProjects(context.projectsDir) } };
  }

  if (pathname === "/api/projects" && method === "POST") {
    const payload = assertRecord(body, "request body");
    const id = safePathPart(requireStringField(payload, "id"), "id");
    const title = typeof payload.title === "string" && payload.title.trim() ? payload.title : id;
    const project = await createProject({ projectsDir: context.projectsDir, id, title });

    return { status: 201, body: { id, title, root: project.root } };
  }

  if (pathname === "/api/projects/import-script" && method === "POST") {
    const payload = assertRecord(body, "request body");
    const id = safePathPart(requireStringField(payload, "id"), "id");
    const title = typeof payload.title === "string" && payload.title.trim() ? payload.title : id;
    const script = requireStringField(payload, "script");
    const project = await createProject({ projectsDir: context.projectsDir, id, title });

    await writeScript(project.root, script);
    const visualRouting = await requireAiPlanner(context).plan(script);
    await writeVisualRouting(project.root, visualRouting);
    await writeFile(visualRoutingMarkdownPath(project.root), formatVisualRoutingMarkdown(visualRouting), "utf8");

    return { status: 201, body: await readProjectDetail(context.projectsDir, id) };
  }

  const scriptMatch = pathname.match(/^\/api\/projects\/([^/]+)\/script$/);
  if (scriptMatch && method === "PUT") {
    const projectRoot = resolveProjectRoot(context.projectsDir, scriptMatch[1]!);
    const payload = assertRecord(body, "request body");
    const script = requireStringField(payload, "script");
    await writeScript(projectRoot, script);

    return { status: 200, body: { ok: true } };
  }

  const visualRoutingMatch = pathname.match(/^\/api\/projects\/([^/]+)\/visual-routing$/);
  if (visualRoutingMatch && method === "PUT") {
    const projectRoot = resolveProjectRoot(context.projectsDir, visualRoutingMatch[1]!);
    const payload = assertRecord(body, "request body");
    const visualRouting = parseVisualRouting(payload.visualRouting);

    await writeVisualRouting(projectRoot, visualRouting);
    await writeFile(visualRoutingMarkdownPath(projectRoot), formatVisualRoutingMarkdown(visualRouting), "utf8");

    return { status: 200, body: { ok: true, visualRouting } };
  }

  const projectMatch = pathname.match(/^\/api\/projects\/([^/]+)$/);
  if (projectMatch && method === "GET") {
    return { status: 200, body: await readProjectDetail(context.projectsDir, projectMatch[1]!) };
  }

  return undefined;
}

function requireAiPlanner(context: StudioContext) {
  if (!context.aiVisualRoutingPlanner) {
    throw new ApiError(500, "AI visual routing planner is not configured.");
  }

  return context.aiVisualRoutingPlanner;
}

function resolveProjectRoot(projectsDir: string, rawProjectId: string): string {
  const projectId = safePathPart(decodeURIComponent(rawProjectId), "project id");
  return projectRootPath(projectsDir, projectId);
}

async function listProjects(projectsDir: string): Promise<Array<{ id: string; title: string; root: string }>> {
  await mkdir(projectsDir, { recursive: true });
  const entries = await readdir(projectsDir, { withFileTypes: true });
  const projects = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => readProjectSummary(join(projectsDir, entry.name)))
  );

  return projects.filter((project): project is { id: string; title: string; root: string } => Boolean(project));
}

async function readProjectSummary(projectRoot: string): Promise<{ id: string; title: string; root: string } | null> {
  try {
    const metadata = YAML.parse(await readFile(metadataPath(projectRoot), "utf8")) as {
      id?: unknown;
      title?: unknown;
    };

    if (typeof metadata.id !== "string") {
      return null;
    }

    return {
      id: metadata.id,
      title: typeof metadata.title === "string" ? metadata.title : metadata.id,
      root: projectRoot
    };
  } catch {
    return null;
  }
}

async function readProjectDetail(projectsDir: string, rawProjectId: string): Promise<Record<string, unknown>> {
  const projectRoot = resolveProjectRoot(projectsDir, rawProjectId);
  const summary = await readProjectSummary(projectRoot);

  if (!summary) {
    throw new ApiError(404, "Project was not found.");
  }

  return {
    ...summary,
    script: await readOptionalText(scriptPath(projectRoot)),
    visualRouting: await readOptionalVisualRouting(projectRoot),
    segments: await listSegments(projectRoot)
  };
}

async function readOptionalText(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

async function readOptionalVisualRouting(projectRoot: string): Promise<unknown> {
  try {
    await access(visualRoutingYamlPath(projectRoot));
    return await readVisualRouting(projectRoot);
  } catch {
    return null;
  }
}

async function listSegments(projectRoot: string): Promise<Array<{ id: string; directoryName: string; root: string }>> {
  try {
    const segmentEntries = await readdir(segmentsRootPath(projectRoot), { withFileTypes: true });

    return segmentEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        id: entry.name.replace(/-[^-]+$/, ""),
        directoryName: entry.name,
        root: join(segmentsRootPath(projectRoot), entry.name)
      }));
  } catch {
    return [];
  }
}
