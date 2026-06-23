import { describe, expect, it } from "vitest";
import { getVisualModeMeta } from "./visualMode.js";

describe("getVisualModeMeta", () => {
  it("maps visual modes to Chinese labels and tone classes", () => {
    expect(getVisualModeMeta("talking_head")).toMatchObject({
      label: "人物出镜",
      toneClass: "mode-talking-head"
    });
    expect(getVisualModeMeta("animation")).toMatchObject({
      label: "动画",
      toneClass: "mode-animation"
    });
    expect(getVisualModeMeta("web_source")).toMatchObject({
      label: "网络素材",
      toneClass: "mode-web-source"
    });
    expect(getVisualModeMeta("live_shoot")).toMatchObject({
      label: "拍摄",
      toneClass: "mode-live-shoot"
    });
  });
});
