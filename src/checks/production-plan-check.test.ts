import { describe, expect, it } from "vitest";
import { checkProductionPlan } from "./production-plan-check.js";

describe("checkProductionPlan", () => {
  it("reports long titles and invalid durations", () => {
    const result = checkProductionPlan({
      video: {
        title: "Sample",
        format: "3:2",
        fps: 60,
        width: 3840,
        height: 2560
      },
      pages: [
        {
          id: "page_01",
          source: "source",
          keep_reason: "kept",
          purpose: "purpose",
          visual_subject: "one thing",
          semantic_type: "core_claim",
          template: "big_claim",
          text: {
            title: "这是一个非常非常非常非常非常非常长的标题"
          },
          duration: 0
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(["page_title_too_long", "invalid_duration"]);
  });
});
