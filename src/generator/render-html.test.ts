import { describe, expect, it } from "vitest";
import type { ProductionPlan } from "../schema/index.js";
import { generateRenderHtml } from "./render-html.js";

const plan: ProductionPlan = {
  video: {
    title: "成本对比",
    format: "3:2",
    fps: 60,
    width: 3840,
    height: 2560
  },
  pages: [
    {
      id: "page_01",
      source: "项目要求本身比较高",
      keep_reason: "建立成本讨论前提",
      purpose: "说明成本敏感性",
      visual_subject: "项目要求",
      semantic_type: "core_claim",
      template: "big_claim",
      text: {
        title: "项目要求越高，成本越关键"
      },
      duration: 3
    },
    {
      id: "page_02",
      source: "GPT 10 元，Claude 10-40 元",
      keep_reason: "核心价格对比",
      purpose: "说明小时成本差异",
      visual_subject: "10 元/小时 vs 10-40 元/小时",
      semantic_type: "number_argument",
      template: "compare",
      text: {
        title: "同样跑 1 小时",
        labels: ["GPT：约 10 元", "Claude：10-40 元"]
      },
      duration: 4
    }
  ]
};

describe("generateRenderHtml", () => {
  it("renders a HyperFrames composition with timed clips and seekable timeline", () => {
    const html = generateRenderHtml(plan);

    expect(html).toContain('data-composition-id="main"');
    expect(html).toContain('data-width="3840"');
    expect(html).toContain('data-height="2560"');
    expect(html).toContain('data-duration="7"');
    expect(html).toContain('data-fps="60"');
    expect(html).toContain('class="clip" data-start="0" data-duration="3" data-track-index="1"');
    expect(html).toContain('class="clip" data-start="3" data-duration="4" data-track-index="1"');
    expect(html).toContain('window.__timelines["main"]');
    expect(html).toContain("seek(time)");
  });
});
