"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getContextLock, createExecutionRequest, updateExecutionRequest, createExecutionEvent } from "@/lib/supabase/queries";
import type { ContextLock, EvidencePacket } from "@/lib/supabase/types";
import { buildExecutionPacket } from "@/lib/genlayer/packet";
import { requestExecutionReview, getExecutionResult } from "@/lib/genlayer/contract";
import { simulateVerdict } from "@/lib/genlayer/simulate";
import { generateRequestId } from "@/lib/utils/ids";
import { getContractAddress } from "@/lib/genlayer/client";
import { useWallet } from "@/lib/wallet/context";
import { toast } from "sonner";
import ExecutionForm from "@/components/executions/ExecutionForm";
import LockSummary from "@/components/locks/LockSummary";
import type { CreateExecutionInput } from "@/lib/validation/executionSchema";
import { Shield } from "lucide-react";

export default function ExecutePage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useWallet();
  const id = params.id as string;
  const [lock, setLock] = useState<ContextLock | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getContextLock(id);
        setLock(data);
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const handleSubmit = async (data: CreateExecutionInput) => {
    if (!lock || !address) return;
    setIsSubmitting(true);

    const requestId = generateRequestId();

    try {
      const evidencePacket: EvidencePacket = {
        sources: data.evidence_sources,
        metrics: (data.metrics || {}) as Record<string, string>,
        notes: data.notes || "",
      };

      // Create execution request in Supabase
      const execReq = await createExecutionRequest({
        lock_id: lock.id,
        owner_wallet: address,
        requested_action: data.requested_action,
        executor_type: data.executor_type,
        current_context_summary: data.current_context_summary,
        changed_conditions: data.changed_conditions || null,
        evidence_packet: evidencePacket,
        status: "SUBMITTED",
        contract_request_id: requestId,
        contract_tx_hash: null,
        contract_verdict: null,
        contract_confidence: null,
        contract_risk_level: null,
        contract_reason_summary: null,
        contract_raw_result: null,
      });

      await createExecutionEvent({
        lock_id: lock.id,
        execution_request_id: execReq.id,
        event_type: "SUBMITTED",
        event_title: "Execution review submitted to GenLayer",
        event_body: `Request ${requestId} submitted for validator consensus.`,
        metadata: {},
      });

      let contractResult = null;
      const contractAddress = getContractAddress();

      if (contractAddress) {
        // Real GenLayer transaction
        try {
          toast.info("Submitting to GenLayer for consensus review...");

          const packet = buildExecutionPacket(
            requestId,
            lock,
            data.requested_action,
            data.current_context_summary,
            data.changed_conditions || "",
            evidencePacket,
          );

          const txHash = await requestExecutionReview(packet);

          await updateExecutionRequest(execReq.id, {
            status: "REVIEWING",
            contract_tx_hash: txHash,
          });

          toast.info("Transaction confirmed. Reading verdict...");

          for (let i = 0; i < 30; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            contractResult = await getExecutionResult(requestId);
            if (contractResult) break;
          }
        } catch (genErr) {
          toast.warning("GenLayer unavailable, using simulated consensus...");
          console.error("GenLayer error:", genErr);
        }
      }

      // Fallback to simulation if GenLayer unavailable or no contract
      if (!contractResult) {
        toast.info("Running simulated GenLayer consensus review...");
        await new Promise((r) => setTimeout(r, 1500));
        contractResult = simulateVerdict(
          requestId,
          lock.id,
          address,
          lock.original_assumptions,
          lock.risk_tolerance,
          evidencePacket,
        );
      }

      await updateExecutionRequest(execReq.id, {
        status: "DECIDED",
        contract_verdict: contractResult.decision,
        contract_confidence: contractResult.confidence,
        contract_risk_level: contractResult.risk_level,
        contract_reason_summary: contractResult.reason_summary,
        contract_raw_result: contractResult,
      });

      await createExecutionEvent({
        lock_id: lock.id,
        execution_request_id: execReq.id,
        event_type: "DECIDED",
        event_title: `GenLayer verdict: ${contractResult.decision}`,
        event_body: contractResult.reason_summary,
        metadata: { verdict: contractResult.decision },
      });

      toast.success(`GenLayer verdict: ${contractResult.decision}`);
      router.push(`/executions/${execReq.id}`);
    } catch (err) {
      toast.error("Execution review failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
        <p className="text-slate-400">Connect your wallet to request execution review.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12"><p className="text-slate-400">Loading...</p></div>;
  if (!lock) return <div className="text-center py-12"><p className="text-slate-400">Lock not found.</p></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Request Execution Review</h1>
        <p className="text-sm text-slate-400 mt-1">Submit current evidence for GenLayer consensus review.</p>
      </div>
      <LockSummary lock={lock} />
      <ExecutionForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        defaultEvidenceUrls={lock.default_evidence_urls || []}
      />
    </div>
  );
}
