import { pathToFileURL } from "node:url";
import { checkCommand } from "./commands/check.js";
import { createSegmentCommand } from "./commands/create-segment.js";
import { generateHtmlCommand } from "./commands/generate-html.js";
import { initProjectCommand } from "./commands/init-project.js";
import { planRoutingCommand } from "./commands/plan-routing.js";
import { renderCommand } from "./commands/render.js";

export interface CliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export async function runCli(args: string[] = process.argv.slice(2)): Promise<CliResult> {
  const [command, ...commandArgs] = args;

  try {
    if (!command || command === "--help" || command === "-h") {
      return {
        exitCode: 0,
        stdout: helpText(),
        stderr: ""
      };
    }

    if (command === "init-project") {
      const result = await initProjectCommand(commandArgs);

      return {
        exitCode: 0,
        stdout: `Created project: ${result.projectRoot}\n`,
        stderr: ""
      };
    }

    if (command === "plan-routing") {
      const result = await planRoutingCommand(commandArgs);

      return {
        exitCode: 0,
        stdout: `Created visual routing plan: ${result.yamlPath}\n`,
        stderr: ""
      };
    }

    if (command === "create-segment") {
      const result = await createSegmentCommand(commandArgs);

      return {
        exitCode: 0,
        stdout: `Created animation segment: ${result.segmentRoot}\n`,
        stderr: ""
      };
    }

    if (command === "generate-html") {
      const result = await generateHtmlCommand(commandArgs);

      return {
        exitCode: 0,
        stdout: `Created HTML: ${result.slidesHtmlPath}\nCreated render HTML: ${result.renderHtmlPath}\n`,
        stderr: ""
      };
    }

    if (command === "render") {
      const result = await renderCommand(commandArgs);

      return {
        exitCode: 0,
        stdout: `Rendered MP4: ${result.outputPath}\n`,
        stderr: ""
      };
    }

    if (command === "check") {
      const result = await checkCommand(commandArgs);
      const output = result.ok
        ? "Checks passed\n"
        : `Checks found ${result.issueCount} issue(s):\n${result.issues
            .map((issue) => `- [${issue.severity}] ${issue.code} ${issue.path}: ${issue.message}`)
            .join("\n")}\n`;

      return {
        exitCode: result.ok ? 0 : 1,
        stdout: output,
        stderr: ""
      };
    }

    return {
      exitCode: 1,
      stdout: "",
      stderr: `Unknown command: ${command}\n`
    };
  } catch (error) {
    return {
      exitCode: 1,
      stdout: "",
      stderr: `${error instanceof Error ? error.message : String(error)}\n`
    };
  }
}

function helpText(): string {
  return [
    "dahei-ppt CLI",
    "",
    "Commands:",
    "  init-project --name <id> [--title <title>] [--projects-dir <dir>]",
    "  plan-routing --project <project>",
    "  create-segment --project <project> --segment <segment-id>",
    "  generate-html --segment <segment>",
    "  render --segment <segment>",
    "  check --segment <segment>"
  ].join("\n");
}

async function main(): Promise<void> {
  const result = await runCli();

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  process.exit(result.exitCode);
}

const entryPoint = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === entryPoint) {
  void main();
}
