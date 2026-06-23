import { describe, expect, it } from "vitest";
import { normalizeProjectsResponse } from "./projects-api.js";

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
});
