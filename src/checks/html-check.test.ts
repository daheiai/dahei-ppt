import { describe, expect, it } from "vitest";
import { checkRenderHtml } from "./html-check.js";

describe("checkRenderHtml", () => {
  it("checks render root size and clip timing attributes", () => {
    const result = checkRenderHtml(`
      <div id="root" data-width="1920" data-height="1080">
        <section class="clip" data-start="0"></section>
      </div>
    `);

    expect(result.ok).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual([
      "invalid_render_size",
      "clip_missing_duration",
      "clip_missing_track"
    ]);
  });
});
