import type { VisualMode } from "./projects-api.js";

export interface VisualModeMeta {
  id: VisualMode;
  label: string;
  toneClass: string;
}

export const VISUAL_MODE_OPTIONS: VisualModeMeta[] = [
  { id: "talking_head", label: "人物出镜", toneClass: "mode-talking-head" },
  { id: "animation", label: "动画", toneClass: "mode-animation" },
  { id: "web_source", label: "网络素材", toneClass: "mode-web-source" },
  { id: "live_shoot", label: "拍摄", toneClass: "mode-live-shoot" }
];

export function getVisualModeMeta(mode: VisualMode): VisualModeMeta {
  return VISUAL_MODE_OPTIONS.find((option) => option.id === mode) ?? VISUAL_MODE_OPTIONS[0]!;
}
