import { describe, expect, it } from "vitest";
import { parseVisualRouting } from "./visual-routing.js";

describe("parseVisualRouting", () => {
  it("accepts an animation segment with boundary and user review fields", () => {
    const plan = parseVisualRouting({
      segments: [
        {
          id: "segment_01",
          source_block_ids: ["block_01"],
          source_text: "GPT 一小时大概 10 块，Claude 可能到 40 块。",
          boundary_action: "keep",
          boundary_reason: "这一段已经是完整的成本对比单元",
          visual_mode: "animation",
          visual_mode_reason: "成本数字和倍数关系适合动画呈现",
          animation_candidate: true,
          user_status: "pending"
        }
      ]
    });

    expect(plan.segments[0]?.visual_mode).toBe("animation");
    expect(plan.segments[0]?.animation_candidate).toBe(true);
  });
});
