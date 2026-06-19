import type { ContextLock, EvidencePacket } from "../supabase/types";
import type { ExecutionReviewParams } from "./contract";

export function buildExecutionPacket(
  requestId: string,
  lock: ContextLock,
  requestedAction: string,
  currentContextSummary: string,
  changedConditions: string,
  evidencePacket: EvidencePacket,
): ExecutionReviewParams {
  return {
    requestId,
    lockId: lock.id,
    ownerWallet: lock.owner_wallet,
    actionTitle: lock.title,
    actionDescription: lock.action_description,
    originalAssumptions: lock.original_assumptions,
    executionConstraints: lock.execution_constraints,
    riskTolerance: lock.risk_tolerance,
    humanApprovalPolicy: lock.human_approval_policy,
    requestedAction,
    currentContextSummary,
    changedConditions,
    evidencePacket: JSON.stringify({
      ...evidencePacket,
      generatedAt: new Date().toISOString(),
    }),
  };
}
