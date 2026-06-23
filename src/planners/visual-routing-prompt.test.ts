import { describe, expect, it } from "vitest";
import { buildVisualRoutingPrompt } from "./visual-routing-prompt.js";

describe("buildVisualRoutingPrompt", () => {
  it("builds source blocks and asks for strict visual routing JSON", () => {
    const prompt = buildVisualRoutingPrompt("第一段。\n\n第二段。");

    expect(prompt.sourceBlocks).toEqual([
      { id: "block_01", text: "第一段。" },
      { id: "block_02", text: "第二段。" }
    ]);
    expect(prompt.system).toContain("精简");
    expect(prompt.user).toContain("visual_mode");
    expect(prompt.user).toContain("block_01");
  });
});
