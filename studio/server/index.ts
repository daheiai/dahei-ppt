import { spawn } from "node:child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { planVisualRoutingWithAi } from "./ai/visual-routing-ai-planner.js";
import { handleAiSettingsRoute } from "./routes/ai-settings.js";
import { handleProjectRoute } from "./routes/projects.js";
import { handleSegmentRoute } from "./routes/segments.js";
import { readAiSettings } from "./settings/ai-settings.js";
import { ApiError, type ApiResponse, type CommandRunner, type StudioContext } from "./types.js";

export type { CommandRunner } from "./types.js";

export interface CreateStudioServerOptions {
  projectsDir?: string;
  port?: number;
  commandRunner?: CommandRunner;
}

export interface StudioServer {
  url: string;
  close(): Promise<void>;
}

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

export async function createStudioServer(options: CreateStudioServerOptions = {}): Promise<StudioServer> {
  const settingsPath = join("studio", "local", "ai-settings.yaml");
  const context: StudioContext = {
    projectsDir: options.projectsDir ?? "studio/projects",
    settingsPath,
    aiVisualRoutingPlanner: {
      async plan(script) {
        return planVisualRoutingWithAi(script, await readAiSettings(settingsPath));
      }
    },
    commandRunner: options.commandRunner ?? createDefaultCommandRunner()
  };
  const server = createServer((request, response) => {
    void handleRequest(request, response, context);
  });

  await new Promise<void>((resolve) => {
    server.listen(options.port ?? 4173, "127.0.0.1", resolve);
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : options.port;

  return {
    url: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      })
  };
}

function createDefaultCommandRunner(): CommandRunner {
  return {
    run(args) {
      return new Promise((resolve, reject) => {
        const child = spawn("npm", ["run", "dahei-ppt", "--", ...args], {
          cwd: repoRoot,
          stdio: ["ignore", "pipe", "pipe"]
        });
        let stdout = "";
        let stderr = "";

        child.stdout?.on("data", (chunk) => {
          stdout += String(chunk);
        });
        child.stderr?.on("data", (chunk) => {
          stderr += String(chunk);
        });
        child.on("error", reject);
        child.on("exit", (code) => {
          if (code === 0) {
            resolve({ stdout, stderr });
            return;
          }

          reject(new Error(stderr || `dahei-ppt exited with code ${code ?? "unknown"}`));
        });
      });
    }
  };
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  context: StudioContext
): Promise<void> {
  try {
    if (request.method === "OPTIONS") {
      writeJson(response, { status: 204 });
      return;
    }

    const url = new URL(request.url ?? "/", "http://localhost");
    const method = request.method ?? "GET";
    const body = await readJsonBody(request);
    writeJson(response, await handleStudioApiRequest({ method, pathname: url.pathname, body, context }));
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message = error instanceof Error ? error.message : String(error);
    writeJson(response, { status, body: { error: message } });
  }
}

export async function handleStudioApiRequest(options: {
  method: string;
  pathname: string;
  body: unknown;
  context: StudioContext;
}): Promise<ApiResponse> {
  return (
    (await handleAiSettingsRoute(options.method, options.pathname, options.body, options.context)) ??
    (await handleProjectRoute(options.method, options.pathname, options.body, options.context)) ??
    (await handleSegmentRoute(options.method, options.pathname, options.body, options.context)) ?? {
      status: 404,
      body: { error: "Route was not found." }
    }
  );
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return null;
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function writeJson(response: ServerResponse, apiResponse: ApiResponse): void {
  const body = apiResponse.body === undefined ? "" : JSON.stringify(apiResponse.body);

  response.writeHead(apiResponse.status, {
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8"
  });
  response.end(body);
}

async function main(): Promise<void> {
  const server = await createStudioServer({ port: Number(process.env.PORT ?? 4173) });
  process.stdout.write(`dahei-ppt Studio API: ${server.url}\n`);
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === entryPoint) {
  void main();
}
