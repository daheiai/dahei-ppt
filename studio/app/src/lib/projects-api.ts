export interface StudioProject {
  id: string;
  title: string;
  root: string;
}

export type BoundaryAction = "keep" | "split" | "merge";
export type VisualMode = "talking_head" | "animation" | "web_source" | "live_shoot";
export type UserStatus = "pending" | "accepted" | "edited";

export interface VisualRoutingSegment {
  id: string;
  source_block_ids: string[];
  source_text: string;
  boundary_action: BoundaryAction;
  boundary_reason: string;
  visual_mode: VisualMode;
  visual_mode_reason: string;
  animation_candidate: boolean;
  user_status: UserStatus;
}

export interface VisualRoutingPlan {
  segments: VisualRoutingSegment[];
}

export interface SegmentSummary {
  id: string;
  directoryName: string;
  root: string;
}

export interface ProjectDetail extends StudioProject {
  script: string;
  visualRouting: VisualRoutingPlan | null;
  segments: SegmentSummary[];
}

export function normalizeProjectsResponse(input: unknown): StudioProject[] {
  if (!input || typeof input !== "object" || !Array.isArray((input as { projects?: unknown }).projects)) {
    throw new Error("Invalid projects response.");
  }

  return (input as { projects: unknown[] }).projects.map((project) => normalizeProject(project));
}

export function normalizeProjectDetailResponse(input: unknown): ProjectDetail {
  const project = normalizeProject(input);
  const record = input as Record<string, unknown>;

  return {
    ...project,
    script: typeof record.script === "string" ? record.script : "",
    visualRouting: record.visualRouting === null ? null : normalizeVisualRouting(record.visualRouting),
    segments: Array.isArray(record.segments) ? record.segments.map((segment) => normalizeSegmentSummary(segment)) : []
  };
}

export async function fetchProjects(fetcher: typeof fetch = fetch): Promise<StudioProject[]> {
  const response = await fetcher("/api/projects");

  if (!response.ok) {
    throw new Error(`Failed to load projects: ${response.status}`);
  }

  return normalizeProjectsResponse(await response.json());
}

export async function fetchProjectDetail(projectId: string, fetcher: typeof fetch = fetch): Promise<ProjectDetail> {
  const response = await fetcher(`/api/projects/${encodeURIComponent(projectId)}`);

  if (!response.ok) {
    throw new Error(`Failed to load project: ${response.status}`);
  }

  return normalizeProjectDetailResponse(await response.json());
}

export async function saveVisualRouting(
  projectId: string,
  visualRouting: VisualRoutingPlan,
  fetcher: typeof fetch = fetch
): Promise<VisualRoutingPlan> {
  const response = await fetcher(`/api/projects/${encodeURIComponent(projectId)}/visual-routing`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ visualRouting })
  });

  if (!response.ok) {
    throw new Error(`Failed to save visual routing: ${response.status}`);
  }

  return normalizeVisualRouting((await response.json()).visualRouting);
}

export async function createAnimationSegment(
  projectId: string,
  segmentId: string,
  fetcher: typeof fetch = fetch
): Promise<SegmentSummary> {
  const response = await fetcher(`/api/projects/${encodeURIComponent(projectId)}/segments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ segmentId })
  });

  if (!response.ok) {
    throw new Error(`Failed to create segment: ${response.status}`);
  }

  return normalizeSegmentSummary(await response.json());
}

function normalizeProject(input: unknown): StudioProject {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid project item.");
  }

  const project = input as Record<string, unknown>;

  if (typeof project.id !== "string" || typeof project.title !== "string" || typeof project.root !== "string") {
    throw new Error("Invalid project item.");
  }

  return {
    id: project.id,
    title: project.title,
    root: project.root
  };
}

function normalizeVisualRouting(input: unknown): VisualRoutingPlan {
  if (!input || typeof input !== "object" || !Array.isArray((input as { segments?: unknown }).segments)) {
    throw new Error("Invalid visual routing.");
  }

  return {
    segments: (input as { segments: unknown[] }).segments.map((segment) => normalizeVisualRoutingSegment(segment))
  };
}

function normalizeVisualRoutingSegment(input: unknown): VisualRoutingSegment {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid visual routing segment.");
  }

  const segment = input as Record<string, unknown>;

  if (
    typeof segment.id !== "string" ||
    !Array.isArray(segment.source_block_ids) ||
    typeof segment.source_text !== "string" ||
    !isBoundaryAction(segment.boundary_action) ||
    typeof segment.boundary_reason !== "string" ||
    !isVisualMode(segment.visual_mode) ||
    typeof segment.visual_mode_reason !== "string" ||
    typeof segment.animation_candidate !== "boolean" ||
    !isUserStatus(segment.user_status)
  ) {
    throw new Error("Invalid visual routing segment.");
  }

  return {
    id: segment.id,
    source_block_ids: segment.source_block_ids.filter((item): item is string => typeof item === "string"),
    source_text: segment.source_text,
    boundary_action: segment.boundary_action,
    boundary_reason: segment.boundary_reason,
    visual_mode: segment.visual_mode,
    visual_mode_reason: segment.visual_mode_reason,
    animation_candidate: segment.animation_candidate,
    user_status: segment.user_status
  };
}

function normalizeSegmentSummary(input: unknown): SegmentSummary {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid segment summary.");
  }

  const segment = input as Record<string, unknown>;
  const id = typeof segment.segmentId === "string" ? segment.segmentId : segment.id;
  const root = segment.segmentRoot ?? segment.root;

  if (typeof id !== "string" || typeof root !== "string") {
    throw new Error("Invalid segment summary.");
  }

  return {
    id,
    directoryName: typeof segment.directoryName === "string" ? segment.directoryName : id,
    root
  };
}

function isBoundaryAction(input: unknown): input is BoundaryAction {
  return input === "keep" || input === "split" || input === "merge";
}

function isVisualMode(input: unknown): input is VisualMode {
  return input === "talking_head" || input === "animation" || input === "web_source" || input === "live_shoot";
}

function isUserStatus(input: unknown): input is UserStatus {
  return input === "pending" || input === "accepted" || input === "edited";
}
