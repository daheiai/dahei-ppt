import { z } from "zod";

export const semanticTypeSchema = z.enum([
  "core_claim",
  "concept_definition",
  "timeline_evolution",
  "causal_relation",
  "comparison_judgment",
  "case_demo",
  "data_explanation",
  "number_argument",
  "closing_claim"
]);

export const templateSchema = z.enum([
  "big_claim",
  "compare",
  "number_scale",
  "threshold_line",
  "quote_punch",
  "timeline",
  "device_flow",
  "relationship_map",
  "screenshot_focus",
  "card_stack"
]);

export const exitPolicySchema = z.enum(["fade", "edge", "dim", "structure"]);

const textSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  labels: z.array(z.string().min(1)).optional()
});

const assetSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(1)
});

const numberItemSchema = z.object({
  label: z.string().min(1),
  value: z.union([z.number(), z.string().min(1)]),
  unit: z.string().min(1)
});

export const productionPlanPageSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  keep_reason: z.string().min(1),
  purpose: z.string().min(1),
  visual_subject: z.string().min(1),
  semantic_type: semanticTypeSchema,
  template: templateSchema,
  text: textSchema,
  duration: z.number().positive(),
  motion: z.string().optional(),
  continuity_group: z.string().optional(),
  exit_policy: exitPolicySchema.optional(),
  template_reason: z.string().optional(),
  assets: z.array(assetSchema).optional(),
  numbers: z.array(numberItemSchema).optional(),
  calculation: z
    .object({
      expression: z.string().min(1),
      meaning: z.string().min(1)
    })
    .optional(),
  decision: z
    .object({
      winner: z.string().min(1),
      reasons: z.array(z.string().min(1)).min(1)
    })
    .optional()
});

export const productionPlanSchema = z.object({
  video: z.object({
    title: z.string().min(1),
    format: z.literal("3:2"),
    fps: z.number().positive(),
    width: z.number().int().positive(),
    height: z.number().int().positive()
  }),
  pages: z.array(productionPlanPageSchema).min(1)
});

export type SemanticType = z.infer<typeof semanticTypeSchema>;
export type TemplateName = z.infer<typeof templateSchema>;
export type ExitPolicy = z.infer<typeof exitPolicySchema>;
export type ProductionPlanPage = z.infer<typeof productionPlanPageSchema>;
export type ProductionPlan = z.infer<typeof productionPlanSchema>;

export function parseProductionPlan(input: unknown): ProductionPlan {
  return productionPlanSchema.parse(input);
}
