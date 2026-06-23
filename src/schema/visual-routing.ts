import { z } from "zod";

export const visualModeSchema = z.enum(["talking_head", "animation", "web_source", "live_shoot"]);
export const boundaryActionSchema = z.enum(["keep", "split", "merge"]);
export const userStatusSchema = z.enum(["pending", "accepted", "edited"]);

export const visualRoutingSegmentSchema = z.object({
  id: z.string().min(1),
  source_block_ids: z.array(z.string().min(1)).min(1),
  source_text: z.string().min(1),
  boundary_action: boundaryActionSchema,
  boundary_reason: z.string().min(1),
  visual_mode: visualModeSchema,
  visual_mode_reason: z.string().min(1),
  animation_candidate: z.boolean(),
  user_status: userStatusSchema,
  material_suggestion: z.string().optional(),
  notes: z.string().optional()
});

export const visualRoutingPlanSchema = z.object({
  segments: z.array(visualRoutingSegmentSchema)
});

export type VisualMode = z.infer<typeof visualModeSchema>;
export type BoundaryAction = z.infer<typeof boundaryActionSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type VisualRoutingSegment = z.infer<typeof visualRoutingSegmentSchema>;
export type VisualRoutingPlan = z.infer<typeof visualRoutingPlanSchema>;

export function parseVisualRouting(input: unknown): VisualRoutingPlan {
  return visualRoutingPlanSchema.parse(input);
}
