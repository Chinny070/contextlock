"use client";

import type { ContextLock } from "@/lib/supabase/types";
import Card from "../ui/Card";
import { StatusBadge, RiskBadge } from "../ui/Badge";
import { formatDate } from "@/lib/utils/format";
import { Shield, FileText, AlertTriangle, Scale } from "lucide-react";

export default function LockSummary({ lock }: { lock: ContextLock }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">{lock.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={lock.status} />
            <RiskBadge risk={lock.risk_tolerance} />
          </div>
        </div>
        <p className="text-slate-300 mb-4">{lock.action_description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500 block">Category</span>
            <span className="text-slate-200 font-mono">{lock.category}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Actor Type</span>
            <span className="text-slate-200 font-mono">{lock.actor_type}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Created</span>
            <span className="text-slate-200">{formatDate(lock.created_at)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Approval Policy</span>
            <span className="text-slate-200 text-xs">{lock.human_approval_policy}</span>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="font-medium text-slate-200">Original Assumptions</h3>
          </div>
          <p className="text-sm text-slate-400 whitespace-pre-wrap">{lock.original_assumptions}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-medium text-slate-200">Execution Constraints</h3>
          </div>
          <p className="text-sm text-slate-400 whitespace-pre-wrap">{lock.execution_constraints}</p>
        </Card>
      </div>

      {lock.default_evidence_urls && lock.default_evidence_urls.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-purple-400" />
            <h3 className="font-medium text-slate-200">Default Evidence Sources</h3>
          </div>
          <ul className="space-y-1">
            {lock.default_evidence_urls.map((url, i) => (
              <li key={i} className="text-sm text-blue-400 font-mono break-all">{url}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
