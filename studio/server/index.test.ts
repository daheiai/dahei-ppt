import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { visualRoutingYamlPath } from "../../src/projects/project-paths.js";
import { handleStudioApiRequest, type CommandRunner } from "./index.js";
import type { StudioContext } from "./types.js";

describe("studio local api", () => {
  it("creates projects and persists script plus visual routing edits", async () => {
    const projectsDir = join(tmpdir(), `dahei-ppt-studio-${Date.now()}`);
    await mkdir(projectsDir, { recursive: true });
    const context = createTestContext(projectsDir);

    const created = await requestJson(context, "/api/projects", {
      method: "POST",
      body: { id: "sample", title: "Sample Video" }
    });
    expect(created).toMatchObject({ id: "sample", title: "Sample Video" });

    await requestJson(context, "/api/projects/sample/script", {
      method: "PUT",
      body: { script: "讲稿第一段。" }
    });

    const routing = sampleRoutingPlan();
    await requestJson(context, "/api/projects/sample/visual-routing", {
      method: "PUT",
      body: { visualRouting: routing }
    });

    const project = await requestJson(context, "/api/projects/sample");
    expect(project).toMatchObject({
      id: "sample",
      title: "Sample Video",
      script: "讲稿第一段。",
      visualRouting: routing
    });
    expect(await readFile(visualRoutingYamlPath(join(projectsDir, "sample")), "utf8")).toContain(
      "visual_mode: animation"
    );
  });

  it("runs segment production actions through the command runner", async () => {
    const projectsDir = join(tmpdir(), `dahei-ppt-studio-actions-${Date.now()}`);
    const calls: string[][] = [];
    const commandRunner: CommandRunner = {
      async run(args) {
        calls.push(args);
        return { stdout: "ok\n", stderr: "" };
      }
    };
    const context = createTestContext(projectsDir, commandRunner);

    await requestJson(context, "/api/projects", {
      method: "POST",
      body: { id: "sample", title: "Sample Video" }
    });
    await requestJson(context, "/api/projects/sample/visual-routing", {
      method: "PUT",
      body: { visualRouting: sampleRoutingPlan() }
    });

    const createdSegment = await requestJson(context, "/api/projects/sample/segments", {
      method: "POST",
      body: { segmentId: "segment_01" }
    });
    expect(createdSegment).toMatchObject({
      segmentId: "segment_01",
      segmentRoot: join(projectsDir, "sample", "segments", "segment_01-animation")
    });

    await requestJson(context, "/api/projects/sample/segments/segment_01/generate-html", {
      method: "POST"
    });
    await requestJson(context, "/api/projects/sample/segments/segment_01/render", {
      method: "POST"
    });

    expect(calls).toEqual([
      ["create-segment", "--project", join(projectsDir, "sample"), "--segment", "segment_01"],
      [
        "generate-html",
        "--segment",
        join(projectsDir, "sample", "segments", "segment_01-animation")
      ],
      ["render", "--segment", join(projectsDir, "sample", "segments", "segment_01-animation")]
    ]);
  });

  it("returns segment production detail and slides html", async () => {
    const projectsDir = join(tmpdir(), `dahei-ppt-studio-detail-${Date.now()}`);
    const context = createTestContext(projectsDir);

    await requestJson(context, "/api/projects", {
      method: "POST",
      body: { id: "sample", title: "Sample Video" }
    });
    await requestJson(context, "/api/projects/sample/visual-routing", {
      method: "PUT",
      body: { visualRouting: sampleRoutingPlan() }
    });
    await requestJson(context, "/api/projects/sample/segments", {
      method: "POST",
      body: { segmentId: "segment_01" }
    });

    const detail = await requestJson(context, "/api/projects/sample/segments/segment_01");

    expect(detail).toMatchObject({
      id: "segment_01",
      productionPlanMarkdown: expect.any(String),
      slidesHtml: null
    });
  });
});

async function requestJson(
  context: StudioContext,
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<any> {
  const response = await handleStudioApiRequest({
    method: options.method ?? "GET",
    pathname: path,
    body: options.body ?? null,
    context
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${response.status}: ${JSON.stringify(response.body)}`);
  }

  return response.body ?? null;
}

function createTestContext(projectsDir: string, commandRunner?: CommandRunner): StudioContext {
  return {
    projectsDir,
    commandRunner:
      commandRunner ??
      ({
        async run(args) {
          if (args[0] === "create-segment") {
            const { createSegmentCommand } = await import("../../src/cli/commands/create-segment.js");
            await createSegmentCommand(args.slice(1));
          }

          return { stdout: "", stderr: "" };
        }
      } satisfies CommandRunner)
  };
}

function sampleRoutingPlan() {
  return {
    segments: [
      {
        id: "segment_01",
        source_block_ids: ["block_01"],
        source_text: "讲稿第一段。",
        boundary_action: "keep",
        boundary_reason: "单段表达完整。",
        visual_mode: "animation",
        visual_mode_reason: "适合用画面解释。",
        animation_candidate: true,
        user_status: "accepted"
      }
    ]
  };
}
