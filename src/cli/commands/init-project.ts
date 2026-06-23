import { createProject } from "../../projects/project-files.js";
import { readOption, requireOption } from "../args.js";

export interface InitProjectResult {
  projectRoot: string;
}

export async function initProjectCommand(args: string[]): Promise<InitProjectResult> {
  const id = requireOption(args, "--name");
  const title = readOption(args, "--title") ?? id;
  const projectsDir = readOption(args, "--projects-dir") ?? "studio/projects";
  const project = await createProject({ projectsDir, id, title });

  return { projectRoot: project.root };
}
