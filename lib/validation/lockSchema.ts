import { z } from "zod";

export const createLockSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  category: z.string().min(1, "Category is required"),
  actor_type: z.enum(["USER", "AI_AGENT", "BOT", "DAO", "SYSTEM"]),
  action_description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  original_assumptions: z.string().min(10, "Assumptions must be at least 10 characters").max(3000),
  execution_constraints: z.string().min(10, "Constraints must be at least 10 characters").max(2000),
  risk_tolerance: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  human_approval_policy: z.string().min(5, "Approval policy is required").max(1000),
  default_evidence_urls: z.array(z.string().url("Must be a valid URL")),
});

export type CreateLockInput = z.infer<typeof createLockSchema>;

export const CATEGORY_OPTIONS = [
  { value: "COMPUTE_PURCHASE", label: "Compute Purchase" },
  { value: "TREASURY_MANAGEMENT", label: "Treasury Management" },
  { value: "DEPLOYMENT", label: "Deployment" },
  { value: "TRADE_EXECUTION", label: "Trade Execution" },
  { value: "INVENTORY_PURCHASE", label: "Inventory Purchase" },
  { value: "SUBSCRIPTION_RENEWAL", label: "Subscription Renewal" },
  { value: "AI_AGENT_WORKFLOW", label: "AI Agent Workflow" },
  { value: "MARKET_ORDER", label: "Market Order" },
  { value: "INVOICE_PAYMENT", label: "Invoice Payment" },
  { value: "OTHER", label: "Other" },
];

export const ACTOR_TYPE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "AI_AGENT", label: "AI Agent" },
  { value: "BOT", label: "Bot" },
  { value: "DAO", label: "DAO" },
  { value: "SYSTEM", label: "System" },
];

export const RISK_TOLERANCE_OPTIONS = [
  { value: "LOW", label: "Low", description: "Minimal risk acceptable" },
  { value: "MEDIUM", label: "Medium", description: "Moderate risk acceptable" },
  { value: "HIGH", label: "High", description: "Significant risk acceptable" },
  { value: "CRITICAL", label: "Critical", description: "Maximum risk tolerance" },
];
