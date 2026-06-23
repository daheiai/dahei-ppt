export interface StudioProject {
  id: string;
  title: string;
  root: string;
}

export function normalizeProjectsResponse(input: unknown): StudioProject[] {
  if (!input || typeof input !== "object" || !Array.isArray((input as { projects?: unknown }).projects)) {
    throw new Error("Invalid projects response.");
  }

  return (input as { projects: unknown[] }).projects.map((project) => normalizeProject(project));
}

export async function fetchProjects(fetcher: typeof fetch = fetch): Promise<StudioProject[]> {
  const response = await fetcher("/api/projects");

  if (!response.ok) {
    throw new Error(`Failed to load projects: ${response.status}`);
  }

  return normalizeProjectsResponse(await response.json());
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
