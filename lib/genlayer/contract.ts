import { callContractWrite, callContractRead } from "./client";
import type { ContractResult } from "../supabase/types";

export interface ExecutionReviewParams {
  requestId: string;
  lockId: string;
  ownerWallet: string;
  actionTitle: string;
  actionDescription: string;
  originalAssumptions: string;
  executionConstraints: string;
  riskTolerance: string;
  humanApprovalPolicy: string;
  requestedAction: string;
  currentContextSummary: string;
  changedConditions: string;
  evidencePacket: string;
}

export async function requestExecutionReview(params: ExecutionReviewParams): Promise<string> {
  const txHash = await callContractWrite(params.ownerWallet, "request_execution_review", [
    params.requestId,
    params.lockId,
    params.ownerWallet,
    params.actionTitle,
    params.actionDescription,
    params.originalAssumptions,
    params.executionConstraints,
    params.riskTolerance,
    params.humanApprovalPolicy,
    params.requestedAction,
    params.currentContextSummary,
    params.changedConditions,
    params.evidencePacket,
  ]);
  return txHash;
}

export async function getExecutionResult(requestId: string): Promise<ContractResult | null> {
  try {
    const raw = await callContractRead("get_execution_result", [requestId]);
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed.error) return null;
    return parsed as ContractResult;
  } catch {
    return null;
  }
}

export async function hasResult(requestId: string): Promise<boolean> {
  try {
    const raw = await callContractRead("has_result", [requestId]);
    return raw === "true" || raw === "True" || raw === "1";
  } catch {
    return false;
  }
}

export async function getDecision(requestId: string): Promise<string> {
  try {
    const raw = await callContractRead("get_decision", [requestId]);
    return typeof raw === "string" ? raw : "NOT_FOUND";
  } catch {
    return "NOT_FOUND";
  }
}
