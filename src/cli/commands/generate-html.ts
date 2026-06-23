import { writeFile } from "node:fs/promises";
import { generateRenderHtml } from "../../generator/render-html.js";
import { generateSlidesHtml } from "../../generator/slides-html.js";
import { readProductionPlan } from "../../projects/project-files.js";
import { renderHtmlPath, slidesHtmlPath } from "../../projects/project-paths.js";
import { requireOption } from "../args.js";

export interface GenerateHtmlResult {
  slidesHtmlPath: string;
  renderHtmlPath: string;
}

export async function generateHtmlCommand(args: string[] = []): Promise<GenerateHtmlResult> {
  const segmentRoot = requireOption(args, "--segment");
  const productionPlan = await readProductionPlan(segmentRoot);
  const slidesPath = slidesHtmlPath(segmentRoot);
  const renderPath = renderHtmlPath(segmentRoot);

  await writeFile(slidesPath, generateSlidesHtml(productionPlan), "utf8");
  await writeFile(renderPath, generateRenderHtml(productionPlan), "utf8");

  return {
    slidesHtmlPath: slidesPath,
    renderHtmlPath: renderPath
  };
}
