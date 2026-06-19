"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExecutionRequest, getContextLock } from "@/lib/supabase/queries";
import type { ExecutionRequest, ContextLock, ContractResult, EvidencePacket } from "@/lib/supabase/types";
import VerdictCard from "@/components/executions/VerdictCard";
import AssumptionCheckTable from "@/components/executions/AssumptionCheckTable";
import EvidencePanel from "@/components/executions/EvidencePanel";
import RawResultToggle from "@/components/executions/RawResultToggle";
import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate, shortenTxHash } from "@/lib/utils/format";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Shield, Clock } from "lucide-react";

export default function ExecutionResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [execution, setExecution] = useState<ExecutionRequest | null>(null);
  const [lock, setLock] = useState<ContextLock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const execData = await getExecutionRequest(id);
        setExecution(execData);
        if (execData?.lock_id) {
          const lockData = await getContextLock(execData.lock_id);
          setLock(lockData);
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <div className="text-center py-12"><p className="text-slate-400">Loading result...</p></div>;
  if (!execution) return <div className="text-center py-12"><p className="text-slate-400">Execution not found.</p></div>;

  const contractResult = execution.contract_raw_result as ContractResult | null;
  const evidencePacket = execution.evidence_packet as EvidencePacket;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {lock && (
        <Link href={`/locks/${lock.id}`} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to {lock.title}
        </Link>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Execution Result</h1>
          <p className="text-sm text-slate-400 mt-1">GenLayer consensus-backed execution decision</p>
        </div>
        <StatusBadge status={execution.status} />
      </div>

      {/* MVP Disclaimer */}
      <Card className="p-4 bg-blue-500/5 border-blue-500/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            ContextLock does not execute the external action in this MVP. It produces the GenLayer-backed execution decision that an agent, user, or system can use before acting.
          </p>
        </div>
      </Card>

      {contractResult ? (
        <>
          <VerdictCard result={contractResult} />
          <AssumptionCheckTable checks={contractResult.assumption_checks || []} />
        </>
      ) : (
        <Card className="p-8 text-center">
          <Clock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">Awaiting GenLayer verdict...</p>
          {execution.status === "FAILED" && (
            <p className="text-sm text-red-400 mt-2">This execution request failed to get a verdict.</p>
          )}
        </Card>
      )}

      {evidencePacket && <EvidencePanel packet={evidencePacket} />}

      {/* Transaction Details */}
      <Card className="p-5">
        <h3 className="font-medium text-slate-200 mb-3">Transaction Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500 block">Request ID</span>
            <span className="text-slate-300 font-mono">{execution.contract_request_id || "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Transaction Hash</span>
            {execution.contract_tx_hash ? (
              <span className="text-blue-400 font-mono flex items-center gap-1">
                {shortenTxHash(execution.contract_tx_hash)}
                <ExternalLink className="w-3 h-3" />
              </span>
            ) : (
              <span className="text-slate-600">—</span>
            )}
          </div>
          <div>
            <span className="text-slate-500 block">Submitted</span>
            <span className="text-slate-300">{formatDate(execution.created_at)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Requested Action</span>
            <span className="text-slate-300 text-xs">{execution.requested_action}</span>
          </div>
        </div>
      </Card>

      {contractResult && <RawResultToggle result={contractResult} />}
    </div>
  );
}
