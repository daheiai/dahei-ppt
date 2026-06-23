import { join } from "node:path";
import { readAiSettings, toPublicAiSettings, writeAiSettings } from "../settings/ai-settings.js";
import type { ApiResponse, StudioContext } from "../types.js";

export async function handleAiSettingsRoute(
  method: string,
  pathname: string,
  body: unknown,
  context: StudioContext
): Promise<ApiResponse | undefined> {
  if (pathname !== "/api/settings/ai") {
    return undefined;
  }

  const settingsPath = context.settingsPath ?? join("studio", "local", "ai-settings.yaml");

  if (method === "GET") {
    return { status: 200, body: toPublicAiSettings(await readAiSettings(settingsPath)) };
  }

  if (method === "PUT") {
    return { status: 200, body: await writeAiSettings(settingsPath, body) };
  }

  return { status: 405, body: { error: "Method is not allowed." } };
}
