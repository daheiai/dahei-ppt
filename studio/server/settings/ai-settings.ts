import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import YAML from "yaml";
import { ApiError } from "../types.js";

export type AiProviderId = "openai" | "anthropic";

export interface AiProviderConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface AiSettings {
  selectedProvider: AiProviderId;
  providers: Record<AiProviderId, AiProviderConfig>;
}

export interface PublicAiProviderConfig extends AiProviderConfig {
  hasApiKey: boolean;
}

export interface PublicAiSettings {
  selectedProvider: AiProviderId;
  providers: Record<AiProviderId, PublicAiProviderConfig>;
}

export const defaultAiSettings: AiSettings = {
  selectedProvider: "openai",
  providers: {
    openai: {
      baseUrl: "https://api.openai.com/v1",
      apiKey: "",
      model: ""
    },
    anthropic: {
      baseUrl: "https://api.anthropic.com/v1",
      apiKey: "",
      model: ""
    }
  }
};

export async function readAiSettings(settingsPath: string): Promise<AiSettings> {
  try {
    const raw = YAML.parse(await readFile(settingsPath, "utf8"));
    return normalizeStoredSettings(raw);
  } catch {
    return cloneSettings(defaultAiSettings);
  }
}

export async function writeAiSettings(settingsPath: string, input: unknown): Promise<PublicAiSettings> {
  const existing = await readAiSettings(settingsPath);
  const next = normalizeIncomingSettings(input, existing);

  await mkdir(dirname(settingsPath), { recursive: true });
  await writeFile(settingsPath, YAML.stringify(next), "utf8");

  return toPublicAiSettings(next);
}

export function toPublicAiSettings(settings: AiSettings): PublicAiSettings {
  return {
    selectedProvider: settings.selectedProvider,
    providers: {
      openai: publicProvider(settings.providers.openai),
      anthropic: publicProvider(settings.providers.anthropic)
    }
  };
}

function publicProvider(provider: AiProviderConfig): PublicAiProviderConfig {
  return {
    baseUrl: provider.baseUrl,
    apiKey: "",
    hasApiKey: provider.apiKey.trim().length > 0,
    model: provider.model
  };
}

function normalizeIncomingSettings(input: unknown, existing: AiSettings): AiSettings {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ApiError(400, "AI settings must be an object.");
  }

  const record = input as Record<string, unknown>;
  const selectedProvider = normalizeProviderId(record.selectedProvider, existing.selectedProvider);
  const providers = record.providers && typeof record.providers === "object" ? (record.providers as Record<string, unknown>) : {};

  return {
    selectedProvider,
    providers: {
      openai: normalizeIncomingProvider(providers.openai, existing.providers.openai),
      anthropic: normalizeIncomingProvider(providers.anthropic, existing.providers.anthropic)
    }
  };
}

function normalizeIncomingProvider(input: unknown, existing: AiProviderConfig): AiProviderConfig {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ...existing };
  }

  const record = input as Record<string, unknown>;

  return {
    baseUrl: readString(record.baseUrl, existing.baseUrl),
    apiKey: typeof record.apiKey === "string" && record.apiKey.length > 0 ? record.apiKey : existing.apiKey,
    model: readString(record.model, existing.model)
  };
}

function normalizeStoredSettings(input: unknown): AiSettings {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return cloneSettings(defaultAiSettings);
  }

  const record = input as Record<string, unknown>;
  const providers = record.providers && typeof record.providers === "object" ? (record.providers as Record<string, unknown>) : {};

  return {
    selectedProvider: normalizeProviderId(record.selectedProvider, defaultAiSettings.selectedProvider),
    providers: {
      openai: normalizeStoredProvider(providers.openai, defaultAiSettings.providers.openai),
      anthropic: normalizeStoredProvider(providers.anthropic, defaultAiSettings.providers.anthropic)
    }
  };
}

function normalizeStoredProvider(input: unknown, fallback: AiProviderConfig): AiProviderConfig {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ...fallback };
  }

  const record = input as Record<string, unknown>;

  return {
    baseUrl: readString(record.baseUrl, fallback.baseUrl),
    apiKey: readString(record.apiKey, fallback.apiKey),
    model: readString(record.model, fallback.model)
  };
}

function normalizeProviderId(input: unknown, fallback: AiProviderId): AiProviderId {
  return input === "openai" || input === "anthropic" ? input : fallback;
}

function readString(input: unknown, fallback: string): string {
  return typeof input === "string" ? input.trim() : fallback;
}

function cloneSettings(settings: AiSettings): AiSettings {
  return {
    selectedProvider: settings.selectedProvider,
    providers: {
      openai: { ...settings.providers.openai },
      anthropic: { ...settings.providers.anthropic }
    }
  };
}
