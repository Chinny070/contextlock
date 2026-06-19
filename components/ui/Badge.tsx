"use client";

import type { Verdict, RiskTolerance } from "@/lib/supabase/types";
import { getVerdictBg, getVerdictColor, getVerdictLabel, getRiskColor } from "@/lib/utils/format";

interface VerdictBadgeProps {
  verdict: Verdict | null;
  size?: "sm" | "md" | "lg";
}

export function VerdictBadge({ verdict, size = "md" }: VerdictBadgeProps) {
  const sizeClasses: Record<string, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded-full border ${getVerdictBg(verdict)} ${getVerdictColor(verdict)} ${sizeClasses[size]}`}
    >
      {getVerdictLabel(verdict)}
    </span>
  );
}

interface RiskBadgeProps {
  risk: RiskTolerance | null;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <span className={`inline-flex items-center font-mono text-xs px-2 py-0.5 rounded-full bg-slate-700/50 ${getRiskColor(risk)}`}>
      {risk || "N/A"}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    PAUSED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    ARCHIVED: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    DRAFT: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    SUBMITTED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    REVIEWING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    DECIDED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    FAILED: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span className={`inline-flex items-center font-mono text-xs px-2 py-0.5 rounded-full border ${colors[status] || colors.DRAFT}`}>
      {status}
    </span>
  );
}
