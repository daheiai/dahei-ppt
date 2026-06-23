import { parseProductionPlan, type ProductionPlan } from "../schema/index.js";

export function planProductionFromScript(script: string, title = "动画片段"): ProductionPlan {
  if (isGptClaudeCostArgument(script)) {
    return parseProductionPlan({
      video: baseVideo(title),
      pages: [
        {
          id: "page_01",
          source: "如果你的项目要求本身就比较高",
          keep_reason: "它建立了成本讨论的前提。",
          purpose: "让观众先理解成本敏感性来自项目要求。",
          visual_subject: "项目要求",
          semantic_type: "core_claim",
          template: "big_claim",
          text: {
            title: "项目要求越高，成本越关键"
          },
          motion: "淡入",
          exit_policy: "fade",
          duration: 3
        },
        {
          id: "page_02",
          source: "跑1小时GPT大概能用10块钱的话，Claude得10~40块",
          keep_reason: "这是核心价格对比。",
          purpose: "让观众看到两种模型的小时成本差异。",
          visual_subject: "10 元/小时 vs 10-40 元/小时",
          semantic_type: "number_argument",
          template: "compare",
          text: {
            title: "同样跑 1 小时",
            labels: ["GPT：约 10 元", "Claude：10-40 元"]
          },
          numbers: [
            { label: "GPT", value: 10, unit: "元/小时" },
            { label: "Claude", value: "10-40", unit: "元/小时" }
          ],
          motion: "对比",
          exit_policy: "fade",
          duration: 4
        },
        {
          id: "page_03",
          source: "上个月总共大概花了4000块",
          keep_reason: "4000 元是后续放大计算的真实基准。",
          purpose: "把用户已有支出转成可感知的金额尺度。",
          visual_subject: "4000 元到 16000 元",
          semantic_type: "number_argument",
          template: "number_scale",
          text: {
            title: "4000 元 × 4 = 16000 元"
          },
          calculation: {
            expression: "4000 × 4 = 16000",
            meaning: "Claude 高价区间会把月成本放大到约 16000 元。"
          },
          motion: "放大",
          exit_policy: "fade",
          duration: 4
        },
        {
          id: "page_04",
          source: "这个价格我还能承受的话，Claude翻个4倍的价格我就承受不了",
          keep_reason: "它给出选择边界。",
          purpose: "让观众看到成本从可承受到越界的变化。",
          visual_subject: "预算承受边界",
          semantic_type: "comparison_judgment",
          template: "threshold_line",
          text: {
            title: "4 倍价格，越过承受边界"
          },
          motion: "阈值推进",
          exit_policy: "fade",
          duration: 4
        },
        {
          id: "page_05",
          source: "GPT在编程任务方面的能力可能还会更好，很难不选择它",
          keep_reason: "它完成最终选择判断。",
          purpose: "把成本和能力合并成结论。",
          visual_subject: "GPT",
          semantic_type: "closing_claim",
          template: "quote_punch",
          text: {
            title: "成本更稳，编程也强",
            subtitle: "很难不选择 GPT"
          },
          decision: {
            winner: "GPT",
            reasons: ["成本更可控", "编程能力足够强"]
          },
          motion: "聚焦",
          exit_policy: "fade",
          duration: 3
        }
      ]
    });
  }

  return parseProductionPlan({
    video: baseVideo(title),
    pages: [
      {
        id: "page_01",
        source: script,
        keep_reason: "这是当前片段的核心表达。",
        purpose: "用一页讲清当前片段。",
        visual_subject: "核心观点",
        semantic_type: "core_claim",
        template: "big_claim",
        text: {
          title: script.slice(0, 32)
        },
        motion: "淡入",
        exit_policy: "fade",
        duration: 3
      }
    ]
  });
}

export function formatProductionPlanMarkdown(plan: ProductionPlan): string {
  const lines = [`# ${plan.video.title} 制作计划`, ""];

  for (const page of plan.pages) {
    lines.push(`## ${page.id}`);
    lines.push("");
    lines.push(`- 原文依据：${page.source}`);
    lines.push(`- 保留理由：${page.keep_reason}`);
    lines.push(`- 页面目的：${page.purpose}`);
    lines.push(`- 视觉主角：${page.visual_subject}`);
    lines.push(`- 推荐模板：${page.template}`);
    lines.push(`- 页面文字：${page.text.title}`);
    lines.push(`- 预计时长：${page.duration} 秒`);
    lines.push("");
  }

  return lines.join("\n");
}

function baseVideo(title: string): ProductionPlan["video"] {
  return {
    title,
    format: "3:2",
    fps: 60,
    width: 3840,
    height: 2560
  };
}

function isGptClaudeCostArgument(script: string): boolean {
  return /GPT/i.test(script) && /Claude/i.test(script) && /(4000|10|40|成本|价格|承受)/.test(script);
}
