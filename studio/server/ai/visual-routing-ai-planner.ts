import { buildVisualRoutingPrompt, visualRoutingResponseSchema } from "../../../src/planners/visual-routing-prompt.js";
import { parseVisualRouting, type VisualRoutingPlan } from "../../../src/schema/index.js";
import type { AiSettings } from "../settings/ai-settings.js";
import { ApiError } from "../types.js";

type FetchLike = typeof fetch;

export async function planVisualRoutingWithAi(
  script: string,
  settings: AiSettings,
  fetcher: FetchLike = fetch
): Promise<VisualRoutingPlan> {
  const prompt = buildVisualRoutingPrompt(script);
  const provider = settings.providers[settings.selectedProvider];

  if (!provider.apiKey.trim()) {
    throw new ApiError(400, `${settings.selectedProvider} API Key is required.`);
  }

  if (!provider.model.trim()) {
    throw new ApiError(400, `${settings.selectedProvider} model is required.`);
  }

  const jsonText =
    settings.selectedProvider === "openai"
      ? await callOpenAi(provider.baseUrl, provider.apiKey, provider.model, prompt.system, prompt.user, fetcher)
      : await callAnthropic(provider.baseUrl, provider.apiKey, provider.model, prompt.system, prompt.user, fetcher);

  return parseVisualRouting(parseJsonObject(jsonText));
}

async function callOpenAi(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string,
  fetcher: FetchLike
): Promise<string> {
  const endpoint = `${trimTrailingSlash(baseUrl)}/chat/completions`;
  const response = await fetcher(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "visual_routing_plan",
          strict: false,
          schema: visualRoutingResponseSchema
        }
      }
    })
  });

  const body = (await response.json()) as any;

  if (!response.ok) {
    throw upstreamApiError("openai", model, endpoint, response.status, body?.error?.message ?? "OpenAI request failed.");
  }

  const content = body?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new ApiError(502, "OpenAI response did not contain JSON text.");
  }

  return content;
}

async function callAnthropic(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  user: string,
  fetcher: FetchLike
): Promise<string> {
  const endpoint = `${trimTrailingSlash(baseUrl)}/messages`;
  const response = await fetcher(endpoint, {
    method: "POST",
    headers: {
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      model,
      system,
      messages: [{ role: "user", content: user }],
      max_tokens: 4000,
      temperature: 0.2
    })
  });

  const body = (await response.json()) as any;

  if (!response.ok) {
    throw upstreamApiError(
      "anthropic",
      model,
      endpoint,
      response.status,
      body?.error?.message ?? "Anthropic request failed."
    );
  }

  const text = body?.content?.find((part: any) => part?.type === "text")?.text;

  if (typeof text !== "string") {
    throw new ApiError(502, "Anthropic response did not contain JSON text.");
  }

  return text;
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)?.[1];
  return JSON.parse(fenced ?? trimmed);
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function upstreamApiError(provider: string, model: string, endpoint: string, status: number, message: string): ApiError {
  return new ApiError(status, `[${provider} ${model} @ ${endpoint}] ${status}: ${message}`);
}
