import type { ContractResult, EvidencePacket } from "../supabase/types";

export function simulateVerdict(
  requestId: string,
  lockId: string,
  ownerWallet: string,
  originalAssumptions: string,
  riskTolerance: string,
  evidencePacket: EvidencePacket,
): ContractResult {
  const assumptions = originalAssumptions
    .split(/[.\n]/)
    .map((a) => a.trim())
    .filter((a) => a.length > 5);

  const hasConflict = evidencePacket.sources.some(
    (s) =>
      s.summary.toLowerCase().includes("degraded") ||
      s.summary.toLowerCase().includes("incident") ||
      s.summary.toLowerCase().includes("outage") ||
      s.summary.toLowerCase().includes("disruption") ||
      s.summary.toLowerCase().includes("conflict")
  );

  const hasHighRisk =
    riskTolerance === "LOW" &&
    evidencePacket.sources.some(
      (s) =>
        s.summary.toLowerCase().includes("risk") ||
        s.summary.toLowerCase().includes("slow") ||
        s.summary.toLowerCase().includes("increased")
    );

  const hasBudgetConcern = Object.entries(evidencePacket.metrics || {}).some(
    ([k, v]) =>
      (k.includes("budget") || k.includes("cost") || k.includes("price")) &&
      (v.includes("80%") || v.includes("90%") || v.includes("exceed"))
  );

  let decision: ContractResult["decision"] = "EXECUTE";
  let confidence: ContractResult["confidence"] = "HIGH";
  let riskLevel: ContractResult["risk_level"] = "LOW";
  let evidenceQuality: ContractResult["evidence_quality"] = "GOOD";

  if (hasConflict && hasBudgetConcern) {
    decision = "HUMAN_APPROVAL_REQUIRED";
    confidence = "LOW";
    riskLevel = "HIGH";
    evidenceQuality = "LIMITED";
  } else if (hasConflict) {
    decision = "PAUSE";
    confidence = "MEDIUM";
    riskLevel = "MEDIUM";
    evidenceQuality = "GOOD";
  } else if (hasHighRisk) {
    decision = "PAUSE";
    confidence = "MEDIUM";
    riskLevel = "MEDIUM";
  } else if (hasBudgetConcern) {
    decision = "HUMAN_APPROVAL_REQUIRED";
    confidence = "MEDIUM";
    riskLevel = "HIGH";
  }

  const assumptionChecks = assumptions.map((assumption) => {
    const lower = assumption.toLowerCase();
    let status: "SUPPORTED" | "WEAKLY_SUPPORTED" | "CONTRADICTED" | "UNKNOWN" = "SUPPORTED";
    let note = "Evidence supports this assumption.";

    if (hasConflict && (lower.includes("outage") || lower.includes("incident") || lower.includes("status") || lower.includes("available") || lower.includes("disruption"))) {
      status = "WEAKLY_SUPPORTED";
      note = "Evidence shows some degradation or conflict related to this assumption.";
    } else if (hasHighRisk && lower.includes("risk")) {
      status = "WEAKLY_SUPPORTED";
      note = "Risk tolerance is low but some risk indicators are elevated.";
    } else if (hasBudgetConcern && (lower.includes("cost") || lower.includes("budget") || lower.includes("price"))) {
      status = "WEAKLY_SUPPORTED";
      note = "Budget or pricing is approaching limits.";
    }

    return { assumption, status, note };
  });

  const reasons: Record<string, string> = {
    EXECUTE: "All original assumptions remain supported by current evidence. Risk is within tolerance and no contradictions detected. Execution can proceed safely.",
    PAUSE: "Some evidence shows potential issues that may affect execution safety. While core assumptions hold, conditions are unstable enough to recommend pausing until clearer evidence is available.",
    REJECT: "Key assumptions are contradicted by current evidence. Risk exceeds tolerance and execution would be unsafe under current conditions.",
    HUMAN_APPROVAL_REQUIRED: "The case involves conflicting signals and elevated risk. Multiple factors require human judgment before proceeding with execution.",
  };

  const nextSteps: Record<string, string> = {
    EXECUTE: "Proceed with the action as planned.",
    PAUSE: "Wait for conditions to stabilize, then re-submit with fresh evidence.",
    REJECT: "Do not execute. Re-evaluate the action and update assumptions if conditions change.",
    HUMAN_APPROVAL_REQUIRED: "A human decision-maker should review this case and provide explicit approval or rejection.",
  };

  return {
    request_id: requestId,
    lock_id: lockId,
    owner_wallet: ownerWallet,
    decision,
    confidence,
    risk_level: riskLevel,
    reason_summary: reasons[decision],
    assumption_checks: assumptionChecks.length > 0
      ? assumptionChecks
      : [{ assumption: "General conditions", status: "SUPPORTED" as const, note: "No specific assumption violations detected." }],
    evidence_quality: evidenceQuality,
    recommended_next_step: nextSteps[decision],
    created_at: new Date().toISOString(),
  };
}
