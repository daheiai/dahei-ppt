import { spawn } from "node:child_process";
import { access, copyFile, cp, mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { assetsPath, exportsPath, renderHtmlPath } from "../../projects/project-paths.js";
import { requireOption } from "../args.js";

export interface RenderRunner {
  run(command: string, args: string[], options: { cwd: string }): Promise<void>;
}

export interface RenderResult {
  outputPath: string;
}

const defaultRunner: RenderRunner = {
  run(command, args, options) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options.cwd,
        stdio: "inherit"
      });

      child.on("error", reject);
      child.on("exit", (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
      });
    });
  }
};

export async function renderCommand(
  args: string[] = [],
  runner: RenderRunner = defaultRunner
): Promise<RenderResult> {
  const segmentRoot = resolve(requireOption(args, "--segment"));
  const outputDirectory = exportsPath(segmentRoot);
  const outputPath = join(outputDirectory, "render.mp4");
  const renderEntryPath = renderHtmlPath(segmentRoot);
  const renderProjectRoot = await mkdtemp(join(tmpdir(), "dahei-ppt-hf-render-"));

  await access(renderEntryPath);
  await mkdir(outputDirectory, { recursive: true });
  await copyFile(renderEntryPath, join(renderProjectRoot, "index.html"));
  await copyAssetsIfPresent(segmentRoot, renderProjectRoot);
  await runner.run("npx", ["hyperframes", "render", ".", "-o", outputPath, "--fps", "60"], {
    cwd: renderProjectRoot
  });

  return { outputPath };
}

async function copyAssetsIfPresent(segmentRoot: string, renderProjectRoot: string): Promise<void> {
  try {
    await access(assetsPath(segmentRoot));
    await cp(assetsPath(segmentRoot), assetsPath(renderProjectRoot), { recursive: true });
  } catch {
    // Assets are optional for text-only animation segments.
  }
}
