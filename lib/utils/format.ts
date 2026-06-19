import type { Verdict, RiskLevel, Confidence, EvidenceQuality, AssumptionStatus } from "../supabase/types";

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function shortenTxHash(hash: string): string {
  if (!hash) return "";
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function getVerdictColor(verdict: Verdict | null): string {
  switch (verdict) {
    case "EXECUTE": return "text-emerald-400";
    case "PAUSE": return "text-amber-400";
    case "REJECT": return "text-red-400";
    case "HUMAN_APPROVAL_REQUIRED": return "text-purple-400";
    default: return "text-slate-400";
  }
}

export function getVerdictBg(verdict: Verdict | null): string {
  switch (verdict) {
    case "EXECUTE": return "bg-emerald-500/20 border-emerald-500/30";
    case "PAUSE": return "bg-amber-500/20 border-amber-500/30";
    case "REJECT": return "bg-red-500/20 border-red-500/30";
    case "HUMAN_APPROVAL_REQUIRED": return "bg-purple-500/20 border-purple-500/30";
    default: return "bg-slate-500/20 border-slate-500/30";
  }
}

export function getVerdictLabel(verdict: Verdict | null): string {
  switch (verdict) {
    case "EXECUTE": return "Execute";
    case "PAUSE": return "Pause";
    case "REJECT": return "Reject";
    case "HUMAN_APPROVAL_REQUIRED": return "Human Approval Required";
    default: return "Pending";
  }
}

export function getVerdictMessage(verdict: Verdict | null): string {
  switch (verdict) {
    case "EXECUTE": return "GenLayer consensus says this action can proceed under the locked assumptions.";
    case "PAUSE": return "GenLayer consensus recommends pausing until stronger or fresher evidence is available.";
    case "REJECT": return "GenLayer consensus says this action should not execute under the current conditions.";
    case "HUMAN_APPROVAL_REQUIRED": return "GenLayer consensus recommends human approval before execution.";
    default: return "Awaiting GenLayer consensus decision.";
  }
}

export function getRiskColor(risk: RiskLevel | null): string {
  switch (risk) {
    case "LOW": return "text-emerald-400";
    case "MEDIUM": return "text-amber-400";
    case "HIGH": return "text-orange-400";
    case "CRITICAL": return "text-red-400";
    default: return "text-slate-400";
  }
}

export function getConfidenceColor(confidence: Confidence | null): string {
  switch (confidence) {
    case "HIGH": return "text-emerald-400";
    case "MEDIUM": return "text-amber-400";
    case "LOW": return "text-red-400";
    default: return "text-slate-400";
  }
}

export function getEvidenceQualityColor(quality: EvidenceQuality | null): string {
  switch (quality) {
    case "STRONG": return "text-emerald-400";
    case "GOOD": return "text-blue-400";
    case "LIMITED": return "text-amber-400";
    case "POOR": return "text-red-400";
    default: return "text-slate-400";
  }
}

export function getAssumptionStatusColor(status: AssumptionStatus): string {
  switch (status) {
    case "SUPPORTED": return "text-emerald-400";
    case "WEAKLY_SUPPORTED": return "text-amber-400";
    case "CONTRADICTED": return "text-red-400";
    case "UNKNOWN": return "text-slate-400";
    default: return "text-slate-400";
  }
}

export function getAssumptionStatusIcon(status: AssumptionStatus): string {
  switch (status) {
    case "SUPPORTED": return "✓";
    case "WEAKLY_SUPPORTED": return "~";
    case "CONTRADICTED": return "✗";
    case "UNKNOWN": return "?";
    default: return "•";
  }
}
