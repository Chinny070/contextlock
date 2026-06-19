"use client";

import type { ContractResult } from "@/lib/supabase/types";
import Card from "../ui/Card";
import { VerdictBadge } from "../ui/Badge";
import { getVerdictMessage, getConfidenceColor, getRiskColor, getEvidenceQualityColor } from "@/lib/utils/format";
import { Scale, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";

export default function VerdictCard({ result }: { result: ContractResult }) {
  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-3">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">GenLayer Consensus Decision</p>
        <VerdictBadge verdict={result.decision} size="lg" />
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          {getVerdictMessage(result.decision)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-slate-900/50 rounded-lg">
          <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-slate-500" />
          <p className="text-xs text-slate-500 mb-1">Confidence</p>
          <p className={`font-mono font-semibold ${getConfidenceColor(result.confidence)}`}>
            {result.confidence}
          </p>
        </div>
        <div className="text-center p-3 bg-slate-900/50 rounded-lg">
          <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-slate-500" />
          <p className="text-xs text-slate-500 mb-1">Risk Level</p>
          <p className={`font-mono font-semibold ${getRiskColor(result.risk_level)}`}>
            {result.risk_level}
          </p>
        </div>
        <div className="text-center p-3 bg-slate-900/50 rounded-lg">
          <Scale className="w-4 h-4 mx-auto mb-1 text-slate-500" />
          <p className="text-xs text-slate-500 mb-1">Evidence Quality</p>
          <p className={`font-mono font-semibold ${getEvidenceQualityColor(result.evidence_quality)}`}>
            {result.evidence_quality}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="font-medium text-slate-200">Reasoning</h3>
        </div>
        <p className="text-sm text-slate-400 bg-slate-900/50 p-4 rounded-lg">
          {result.reason_summary}
        </p>
      </div>

      {result.recommended_next_step && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-xs text-blue-400 font-mono mb-1">Recommended Next Step</p>
          <p className="text-sm text-slate-300">{result.recommended_next_step}</p>
        </div>
      )}
    </Card>
  );
}
