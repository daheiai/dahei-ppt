import { describe, expect, it } from "vitest";
import { planProductionFromScript } from "./production-plan-planner.js";

const costScript =
  "如果你的项目要求本身就比较高，假如跑1小时GPT大概能用10块钱的话，Claude得10~40块，那按照我上个月总共大概花了4000块，这个价格我还能承受的话，Claude翻个4倍的价格我就承受不了。而恰恰GPT在编程任务方面的能力可能还会更好，很难不选择它。";

describe("planProductionFromScript", () => {
  it("splits the GPT vs Claude cost argument into five focused pages", () => {
    const plan = planProductionFromScript(costScript, "GPT vs Claude 成本选择");

    expect(plan.video).toMatchObject({
      format: "3:2",
      fps: 60,
      width: 3840,
      height: 2560
    });
    expect(plan.pages).toHaveLength(5);
    expect(plan.pages.map((page) => page.visual_subject)).toEqual([
      "项目要求",
      "10 元/小时 vs 10-40 元/小时",
      "4000 元到 16000 元",
      "预算承受边界",
      "GPT"
    ]);
    expect(plan.pages.every((page) => page.duration > 0)).toBe(true);
  });
});
