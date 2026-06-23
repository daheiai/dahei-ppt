import { describe, expect, it } from "vitest";
import { parseProductionPlan } from "./production-plan.js";

const validPlan = {
  video: {
    title: "GPT vs Claude 成本对比",
    format: "3:2",
    fps: 60,
    width: 3840,
    height: 2560
  },
  pages: [
    {
      id: "page_01",
      source: "如果你的项目要求本身就比较高",
      keep_reason: "它建立了成本讨论的前提",
      purpose: "让观众先理解成本敏感性来自项目要求",
      visual_subject: "项目要求",
      semantic_type: "core_claim",
      template: "big_claim",
      text: {
        title: "项目要求越高，成本越关键"
      },
      duration: 3
    }
  ]
};

describe("parseProductionPlan", () => {
  it("accepts a 3:2 production plan with required page fields", () => {
    const plan = parseProductionPlan(validPlan);

    expect(plan.video.width).toBe(3840);
    expect(plan.video.height).toBe(2560);
    expect(plan.pages[0]?.visual_subject).toBe("项目要求");
  });

  it("rejects unknown template names", () => {
    expect(() =>
      parseProductionPlan({
        ...validPlan,
        pages: [
          {
            ...validPlan.pages[0],
            template: "unknown_template"
          }
        ]
      })
    ).toThrow();
  });
});
