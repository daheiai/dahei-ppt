import { parseVisualRouting, type VisualMode, type VisualRoutingPlan } from "../schema/index.js";

interface VisualModeDecision {
  visual_mode: VisualMode;
  visual_mode_reason: string;
  animation_candidate: boolean;
  material_suggestion?: string;
}

export function planVisualRoutingFromScript(script: string): VisualRoutingPlan {
  const blocks = splitSourceBlocks(script);
  const segments = blocks.map((sourceText, index) => {
    const decision = decideVisualMode(sourceText);
    const number = String(index + 1).padStart(2, "0");

    return {
      id: `segment_${number}`,
      source_block_ids: [`block_${number}`],
      source_text: sourceText,
      boundary_action: "keep" as const,
      boundary_reason: "原文段落已经形成独立表达单元，先保留边界。",
      visual_mode: decision.visual_mode,
      visual_mode_reason: decision.visual_mode_reason,
      animation_candidate: decision.animation_candidate,
      user_status: "pending" as const,
      ...(decision.material_suggestion ? { material_suggestion: decision.material_suggestion } : {})
    };
  });

  return parseVisualRouting({ segments });
}

export function formatVisualRoutingMarkdown(plan: VisualRoutingPlan): string {
  const lines = ["# 画面形态计划", ""];

  for (const segment of plan.segments) {
    lines.push(`## ${segment.id}`);
    lines.push("");
    lines.push(`- 画面形态：${visualModeLabel(segment.visual_mode)}`);
    lines.push(`- 边界动作：${boundaryActionLabel(segment.boundary_action)}`);
    lines.push(`- 分区理由：${segment.visual_mode_reason}`);
    lines.push(`- 边界理由：${segment.boundary_reason}`);
    lines.push(`- 动画候选：${segment.animation_candidate ? "是" : "否"}`);

    if (segment.material_suggestion) {
      lines.push(`- 素材建议：${segment.material_suggestion}`);
    }

    lines.push("");
    lines.push("> " + segment.source_text);
    lines.push("");
  }

  return lines.join("\n");
}

function splitSourceBlocks(script: string): string[] {
  return script
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);
}

function decideVisualMode(sourceText: string): VisualModeDecision {
  if (hasWebSourceSignal(sourceText)) {
    return {
      visual_mode: "web_source",
      visual_mode_reason: "这段的说服力来自外部证据或现场材料。",
      animation_candidate: false,
      material_suggestion: "检索对应网页、截图、新闻、模型输出或录屏素材。"
    };
  }

  if (hasLiveShootSignal(sourceText)) {
    return {
      visual_mode: "live_shoot",
      visual_mode_reason: "这段需要现实质感、实物操作或表演画面。",
      animation_candidate: false,
      material_suggestion: "准备拍摄清单和现场动作。"
    };
  }

  if (hasAnimationSignal(sourceText)) {
    return {
      visual_mode: "animation",
      visual_mode_reason: "这段包含数字、对比、尺度或因果关系，适合用动画讲清楚。",
      animation_candidate: true
    };
  }

  return {
    visual_mode: "talking_head",
    visual_mode_reason: "这段承担连接、态度表达或自然讲述功能。",
    animation_candidate: false
  };
}

function hasAnimationSignal(text: string): boolean {
  return /(\d|[0-9]|成本|价格|倍|对比|差异|流程|结构|关系|因果|评分|总分|阈值|边界|GPT|Claude)/i.test(
    text
  );
}

function hasWebSourceSignal(text: string): boolean {
  return /(截图|网页|新闻|链接|官网|榜单|地图|公开视频|历史素材|模型回答|测试录屏|引用)/.test(text);
}

function hasLiveShootSignal(text: string): boolean {
  return /(拍摄|小剧场|实物|现实操作|生活场景|整活|表演|演示一下)/.test(text);
}

function visualModeLabel(mode: VisualMode): string {
  const labels: Record<VisualMode, string> = {
    talking_head: "人物出镜",
    animation: "动画",
    web_source: "网络现场素材",
    live_shoot: "拍摄"
  };

  return labels[mode];
}

function boundaryActionLabel(action: "keep" | "split" | "merge"): string {
  const labels = {
    keep: "保留",
    split: "拆分",
    merge: "合并"
  };

  return labels[action];
}
