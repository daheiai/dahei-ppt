import { describe, expect, it } from "vitest";
import type { AiSettings } from "../settings/ai-settings.js";
import { planVisualRoutingWithAi } from "./visual-routing-ai-planner.js";

describe("planVisualRoutingWithAi", () => {
  it("includes provider, model, endpoint, and upstream message when OpenAI-compatible calls fail", async () => {
    const settings: AiSettings = {
      selectedProvider: "openai",
      providers: {
        openai: {
          baseUrl: "https://deepkey.top/v1",
          apiKey: "test-key",
          model: "gpt-5.5"
        },
        anthropic: {
          baseUrl: "https://api.anthropic.com/v1",
          apiKey: "",
          model: ""
        }
      }
    };
    const fetcher = async () =>
      ({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: "Server error, please try again later." } })
      }) as Response;

    await expect(planVisualRoutingWithAi("测试文案。", settings, fetcher as typeof fetch)).rejects.toThrow(
      "[openai gpt-5.5 @ https://deepkey.top/v1/chat/completions] 500: Server error, please try again later."
    );
  });
});
