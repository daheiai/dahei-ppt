import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { initProjectCommand } from "./init-project.js";

describe("initProjectCommand", () => {
  it("creates a local project with metadata and script file", async () => {
    const projectsDir = await mkdtemp(join(tmpdir(), "dahei-ppt-cli-"));

    const result = await initProjectCommand([
      "--name",
      "sample",
      "--title",
      "Sample Video",
      "--projects-dir",
      projectsDir
    ]);

    expect(result.projectRoot).toBe(join(projectsDir, "sample"));
    expect(await readFile(join(result.projectRoot, "metadata.yaml"), "utf8")).toContain(
      "title: Sample Video"
    );
    expect(await readFile(join(result.projectRoot, "script.md"), "utf8")).toBe("");
  });
});
