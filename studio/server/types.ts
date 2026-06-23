export interface CommandResult {
  stdout: string;
  stderr: string;
}

export interface CommandRunner {
  run(args: string[]): Promise<CommandResult>;
}

export interface StudioContext {
  projectsDir: string;
  settingsPath?: string;
  commandRunner: CommandRunner;
}

export interface ApiResponse {
  status: number;
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

export function assertRecord(input: unknown, label: string): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ApiError(400, `${label} must be an object.`);
  }

  return input as Record<string, unknown>;
}

export function requireStringField(input: Record<string, unknown>, field: string): string {
  const value = input[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${field} must be a non-empty string.`);
  }

  return value;
}

export function safePathPart(value: string, label: string): string {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value)) {
    throw new ApiError(400, `${label} contains unsupported characters.`);
  }

  return value;
}
