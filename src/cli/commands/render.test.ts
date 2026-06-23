import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderHtmlPath } from "../../projects/project-paths.js";
import { renderCommand, type RenderRunner } from "./render.js";

describe("renderCommand", () => {
  it("runs HyperFrames against render.html and writes exports/render.mp4", async () => {
    const segmentRoot = join(tmpdir(), `dahei-ppt-render-${Date.now()}`);
    await mkdir(segmentRoot, { recursive: true });
    await writeFile(renderHtmlPath(segmentRoot), "<!doctype html><html></html>", "utf8");
    const calls: Array<{ command: string; args: string[]; cwd: string }> = [];
    const runner: RenderRunner = {
      async run(command, args, options) {
        expect(await readFile(join(options.cwd, "index.html"), "utf8")).toContain("<!doctype html>");
        calls.push({ command, args, cwd: options.cwd });
      }
    };

    const result = await renderCommand(["--segment", segmentRoot], runner);

    expect(result.outputPath).toBe(join(segmentRoot, "exports", "render.mp4"));
    expect(calls[0]?.cwd).not.toBe(segmentRoot);
    expect(calls).toEqual([
      {
        command: "npx",
        args: ["hyperframes", "render", ".", "-o", result.outputPath, "--fps", "60"],
        cwd: calls[0]!.cwd
      }
    ]);
  });
});
