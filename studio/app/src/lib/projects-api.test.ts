import { describe, expect, it } from "vitest";
import {
  fetchSegmentDetail,
  generateHtmlForSegment,
  normalizeProjectDetailResponse,
  normalizeProjectsResponse,
  renderSegment
} from "./projects-api.js";

describe("normalizeProjectsResponse", () => {
  it("normalizes project list responses from the Studio API", () => {
    expect(
      normalizeProjectsResponse({
        projects: [
          {
            id: "sample",
            title: "Sample Video",
            root: "/tmp/sample"
          }
        ]
      })
    ).toEqual([
      {
        id: "sample",
        title: "Sample Video",
        root: "/tmp/sample"
      }
    ]);
  });

  it("normalizes project detail responses with visual routing", () => {
    const visualRouting = {
      segments: [
        {
          id: "segment_01",
          source_block_ids: ["block_01"],
          source_text: "第一段",
          boundary_action: "keep",
          boundary_reason: "完整",
          visual_mode: "animation",
          visual_mode_reason: "适合解释",
          animation_candidate: true,
          user_status: "accepted"
        }
      ]
    };

    expect(
      normalizeProjectDetailResponse({
        id: "sample",
        title: "Sample Video",
        root: "/tmp/sample",
        script: "第一段",
        visualRouting,
        segments: []
      })
    ).toMatchObject({
      id: "sample",
      script: "第一段",
      visualRouting
    });
  });

  it("calls animation segment workflow endpoints", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = async (url: string, init?: RequestInit) => {
      calls.push({ url, init });

      if (url.endsWith("/generate-html")) {
        return jsonResponse({ ok: true, stdout: "html" });
      }

      if (url.endsWith("/render")) {
        return jsonResponse({ ok: true, stdout: "render" });
      }

      return jsonResponse({
        id: "segment_01",
        root: "/tmp/sample/segments/segment_01-animation",
        productionPlanMarkdown: "# plan",
        productionPlan: { pages: [] },
        slidesHtml: "<!doctype html>"
      });
    };

    await expect(fetchSegmentDetail("sample", "segment_01", fetcher as typeof fetch)).resolves.toMatchObject({
      id: "segment_01",
      productionPlanMarkdown: "# plan"
    });
    await expect(generateHtmlForSegment("sample", "segment_01", fetcher as typeof fetch)).resolves.toMatchObject({
      stdout: "html"
    });
    await expect(renderSegment("sample", "segment_01", fetcher as typeof fetch)).resolves.toMatchObject({
      stdout: "render"
    });
    expect(calls.map((call) => `${call.init?.method ?? "GET"} ${call.url}`)).toEqual([
      "GET /api/projects/sample/segments/segment_01",
      "POST /api/projects/sample/segments/segment_01/generate-html",
      "POST /api/projects/sample/segments/segment_01/render"
    ]);
  });
});

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body
  } as Response;
}
