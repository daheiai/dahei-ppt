export interface SourceBlock {
  id: string;
  text: string;
}

export interface VisualRoutingPrompt {
  system: string;
  user: string;
  sourceBlocks: SourceBlock[];
}

export const visualRoutingResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["segments"],
  properties: {
    segments: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "source_block_ids",
          "source_text",
          "boundary_action",
          "boundary_reason",
          "visual_mode",
          "visual_mode_reason",
          "animation_candidate",
          "user_status"
        ],
        properties: {
          id: { type: "string" },
          source_block_ids: { type: "array", minItems: 1, items: { type: "string" } },
          source_text: { type: "string" },
          boundary_action: { type: "string", enum: ["keep", "split", "merge"] },
          boundary_reason: { type: "string" },
          visual_mode: { type: "string", enum: ["talking_head", "animation", "web_source", "live_shoot"] },
          visual_mode_reason: { type: "string" },
          animation_candidate: { type: "boolean" },
          user_status: { type: "string", enum: ["pending", "accepted", "edited"] },
          material_suggestion: { type: "string" },
          notes: { type: "string" }
        }
      }
    }
  }
} as const;

export function buildVisualRoutingPrompt(script: string): VisualRoutingPrompt {
  const sourceBlocks = splitSourceBlocks(script);

  return {
    sourceBlocks,
    system: [
      "你是大黑视频的制作规划助手，负责把完整文案拆成画面制作分区。",
      "核心优先级：精简 > 讲清楚 > 美观 > 有趣。",
      "判断标准：删到只剩必要信息；每个动画页只服务一个视觉主角；观众需要知道看哪里、记住什么。",
      "画面类型：talking_head=人物出镜；animation=动画解释；web_source=网络素材/截图/新闻/网页；live_shoot=现实拍摄/小剧场/实物操作。",
      "输出只能是 JSON，字段名使用英文，展示文案和理由使用中文。"
    ].join("\n"),
    user: [
      "请根据下面的 source_blocks 生成 visual-routing JSON。",
      "",
      "分区规则：",
      "1. 默认尊重原文段落边界，必要时可 split 或 merge。",
      "2. 数字、对比、阈值、流程、结构、因果、抽象概念优先考虑 animation。",
      "3. 新闻、网页、截图、模型输出、榜单、公开素材优先考虑 web_source。",
      "4. 小剧场、实物、现实操作、生活场景优先考虑 live_shoot。",
      "5. 过渡、态度、连接、个人判断优先考虑 talking_head。",
      "6. source_block_ids 必须来自给定 blocks；source_text 只能来自对应原文。",
      "7. id 使用 segment_01、segment_02 递增；user_status 使用 pending。",
      "",
      "JSON schema:",
      JSON.stringify(visualRoutingResponseSchema),
      "",
      "source_blocks:",
      JSON.stringify(sourceBlocks, null, 2)
    ].join("\n")
  };
}

function splitSourceBlocks(script: string): SourceBlock[] {
  return script
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((text, index) => ({
      id: `block_${String(index + 1).padStart(2, "0")}`,
      text
    }));
}
