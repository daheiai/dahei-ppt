import { describe, expect, it } from "vitest";
import { normalizeProjectDetailResponse, normalizeProjectsResponse } from "./projects-api.js";

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
});
