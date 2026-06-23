import { writeFile } from "node:fs/promises";
import { generateSlidesHtml } from "../../generator/slides-html.js";
import { readProductionPlan } from "../../projects/project-files.js";
import { slidesHtmlPath } from "../../projects/project-paths.js";
import { requireOption } from "../args.js";

export interface GenerateHtmlResult {
  slidesHtmlPath: string;
}

export async function generateHtmlCommand(args: string[] = []): Promise<GenerateHtmlResult> {
  const segmentRoot = requireOption(args, "--segment");
  const productionPlan = await readProductionPlan(segmentRoot);
  const slidesPath = slidesHtmlPath(segmentRoot);

  await writeFile(slidesPath, generateSlidesHtml(productionPlan), "utf8");

  return {
    slidesHtmlPath: slidesPath
  };
}
