import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { handleStudioApiRequest } from "../index.js";
import type { StudioContext } from "../types.js";

describe("AI settings api", () => {
  it("returns default provider settings with hidden api keys", async () => {
    const context = createTestContext();

    const response = await handleStudioApiRequest({
      method: "GET",
      pathname: "/api/settings/ai",
      body: null,
      context
    });

    expect(response).toMatchObject({
      status: 200,
      body: {
        selectedProvider: "openai",
        providers: {
          openai: {
            baseUrl: "https://api.openai.com/v1",
            model: "",
            apiKey: "",
            hasApiKey: false
          },
          anthropic: {
            baseUrl: "https://api.anthropic.com/v1",
            model: "",
            apiKey: "",
            hasApiKey: false
          }
        }
      }
    });
  });

  it("persists provider settings and masks stored api keys on read", async () => {
    const settingsPath = join(tmpdir(), `dahei-ppt-ai-settings-${Date.now()}`, "ai-settings.yaml");
    await mkdir(join(settingsPath, ".."), { recursive: true });
    const context = createTestContext(settingsPath);

    const saveResponse = await handleStudioApiRequest({
      method: "PUT",
      pathname: "/api/settings/ai",
      body: {
        selectedProvider: "anthropic",
        providers: {
          openai: {
            baseUrl: "https://openai.example/v1",
            apiKey: "openai-key",
            model: "gpt-manual"
          },
          anthropic: {
            baseUrl: "https://anthropic.example/v1",
            apiKey: "anthropic-key",
            model: "claude-manual"
          }
        }
      },
      context
    });
    expect(saveResponse.status).toBe(200);

    const readResponse = await handleStudioApiRequest({
      method: "GET",
      pathname: "/api/settings/ai",
      body: null,
      context
    });

    expect(readResponse).toMatchObject({
      status: 200,
      body: {
        selectedProvider: "anthropic",
        providers: {
          openai: { apiKey: "", hasApiKey: true, model: "gpt-manual" },
          anthropic: { apiKey: "", hasApiKey: true, model: "claude-manual" }
        }
      }
    });
    expect(await readFile(settingsPath, "utf8")).toContain("apiKey: openai-key");
  });
});

function createTestContext(settingsPath?: string): StudioContext {
  return {
    projectsDir: join(tmpdir(), `dahei-ppt-projects-${Date.now()}`),
    settingsPath,
    commandRunner: {
      async run() {
        return { stdout: "", stderr: "" };
      }
    }
  };
}
