import { z } from "zod";

export const evidenceSourceSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  url: z.string(),
  summary: z.string().min(1),
  freshness: z.string(),
});

export const createExecutionSchema = z.object({
  requested_action: z.string().min(10, "Describe what is about to happen").max(2000),
  executor_type: z.string().min(1, "Executor type is required"),
  current_context_summary: z.string().min(10, "Current context is required").max(3000),
  changed_conditions: z.string().max(2000),
  evidence_sources: z.array(evidenceSourceSchema).min(1, "At least one evidence source is required"),
  metrics: z.record(z.string(), z.string()),
  notes: z.string().max(1000),
});

export type CreateExecutionInput = z.infer<typeof createExecutionSchema>;
