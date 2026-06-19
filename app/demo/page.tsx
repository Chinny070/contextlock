"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet/context";
import DemoTemplatePicker, { DemoTemplate } from "@/components/demo/DemoTemplatePicker";
import ExecutionForm from "@/components/executions/ExecutionForm";
import VerdictCard from "@/components/executions/VerdictCard";
import AssumptionCheckTable from "@/components/executions/AssumptionCheckTable";
import EvidencePanel from "@/components/executions/EvidencePanel";
import LockSummary from "@/components/locks/LockSummary";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createContextLock, createExecutionRequest, updateExecutionRequest, createExecutionEvent } from "@/lib/supabase/queries";
import { simulateVerdict } from "@/lib/genlayer/simulate";
import { buildExecutionPacket } from "@/lib/genlayer/packet";
import { requestExecutionReview, getExecutionResult } from "@/lib/genlayer/contract";
import { generateRequestId } from "@/lib/utils/ids";
import type { ContextLock, ContractResult, EvidencePacket } from "@/lib/supabase/types";
import type { CreateExecutionInput } from "@/lib/validation/executionSchema";
import { toast } from "sonner";
import { ArrowLeft, FlaskConical, Shield } from "lucide-react";

type DemoStep = "pick" | "review" | "result";

export default function DemoPage() {
  const { address } = useWallet();
  const router = useRouter();
  const [step, setStep] = useState<DemoStep>("pick");
  const [selectedTemplate, setSelectedTemplate] = useState<DemoTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ContractResult | null>(null);
  const [evidencePacket, setEvidencePacket] = useState<EvidencePacket | null>(null);

  const handleSelectTemplate = (template: DemoTemplate) => {
    setSelectedTemplate(template);
    setStep("review");
    setResult(null);
  };

  const demoLock: ContextLock | null = selectedTemplate
    ? {
        id: "demo-lock",
        owner_wallet: address || "0xDEMO",
        title: selectedTemplate.title,
        category: selectedTemplate.category,
        actor_type: selectedTemplate.actor_type as ContextLock["actor_type"],
        action_description: selectedTemplate.action_description,
        original_assumptions: selectedTemplate.original_assumptions,
        execution_constraints: selectedTemplate.execution_constraints,
        risk_tolerance: selectedTemplate.risk_tolerance as ContextLock["risk_tolerance"],
        human_approval_policy: selectedTemplate.human_approval_policy,
        default_evidence_urls: selectedTemplate.default_evidence_urls,
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : null;

  const handleSubmit = async (data: CreateExecutionInput) => {
    if (!selectedTemplate || !demoLock) return;
    setIsSubmitting(true);

    const requestId = generateRequestId();
    const packet: EvidencePacket = {
      sources: data.evidence_sources,
      metrics: (data.metrics || {}) as Record<string, string>,
      notes: data.notes || "",
    };
    setEvidencePacket(packet);

    try {
      // If wallet connected, do real GenLayer transaction
      if (address) {
        // Create lock in Supabase
        let lock: ContextLock;
        try {
          lock = await createContextLock({
            owner_wallet: address,
            title: selectedTemplate.title,
            category: selectedTemplate.category,
            actor_type: selectedTemplate.actor_type as ContextLock["actor_type"],
            action_description: selectedTemplate.action_description,
            original_assumptions: selectedTemplate.original_assumptions,
            execution_constraints: selectedTemplate.execution_constraints,
            risk_tolerance: selectedTemplate.risk_tolerance as ContextLock["risk_tolerance"],
            human_approval_policy: selectedTemplate.human_approval_policy,
            default_evidence_urls: selectedTemplate.default_evidence_urls,
            status: "ACTIVE",
          });
        } catch {
          lock = demoLock;
        }

        let execReqId: string | null = null;
        try {
          const execReq = await createExecutionRequest({
            lock_id: lock.id,
            owner_wallet: address,
            requested_action: data.requested_action,
            executor_type: data.executor_type,
            current_context_summary: data.current_context_summary,
            changed_conditions: data.changed_conditions || null,
            evidence_packet: packet,
            status: "SUBMITTED",
            contract_request_id: requestId,
            contract_tx_hash: null,
            contract_verdict: null,
            contract_confidence: null,
            contract_risk_level: null,
            contract_reason_summary: null,
            contract_raw_result: null,
          });
          execReqId = execReq.id;
        } catch {
          // Supabase might not be configured
        }

        let contractResult = null;
        const contractAddress = (await import("@/lib/genlayer/client")).getContractAddress();

        if (contractAddress) {
          try {
            toast.info("Submitting to GenLayer for consensus review...");
            const genlayerPacket = buildExecutionPacket(
              requestId, lock, data.requested_action,
              data.current_context_summary, data.changed_conditions || "", packet,
            );
            const txHash = await requestExecutionReview(genlayerPacket);
            if (execReqId) {
              await updateExecutionRequest(execReqId, { status: "REVIEWING", contract_tx_hash: txHash });
            }
            toast.info("Waiting for GenLayer verdict...");
            for (let i = 0; i < 30; i++) {
              await new Promise((r) => setTimeout(r, 2000));
              contractResult = await getExecutionResult(requestId);
              if (contractResult) break;
            }
          } catch {
            toast.warning("GenLayer unavailable, using simulated consensus...");
          }
        }

        if (!contractResult) {
          toast.info("Running simulated GenLayer consensus review...");
          await new Promise((r) => setTimeout(r, 1500));
          contractResult = simulateVerdict(requestId, lock.id, address, selectedTemplate.original_assumptions, selectedTemplate.risk_tolerance, packet);
        }

        setResult(contractResult);
        if (execReqId) {
          try {
            await updateExecutionRequest(execReqId, {
              status: "DECIDED",
              contract_verdict: contractResult.decision,
              contract_confidence: contractResult.confidence,
              contract_risk_level: contractResult.risk_level,
              contract_reason_summary: contractResult.reason_summary,
              contract_raw_result: contractResult,
            });
          } catch { /* Supabase may not be configured */ }
        }
        toast.success(`GenLayer verdict: ${contractResult.decision}`);
      } else {
        // No wallet - show simulated result
        toast.info("Running simulated GenLayer consensus review...");
        await new Promise((r) => setTimeout(r, 1500));

        const simulated = simulateVerdict(
          requestId,
          "demo",
          "0xDEMO",
          selectedTemplate.original_assumptions,
          selectedTemplate.risk_tolerance,
          packet,
        );

        setResult(simulated);
        toast.success(`GenLayer verdict: ${simulated.decision}`);
      }

      setStep("result");
    } catch (err) {
      toast.error("Failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        {step !== "pick" && (
          <Button variant="ghost" size="sm" onClick={() => { setStep("pick"); setResult(null); }}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Demo Cases</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {step === "pick" && "Select a sample case to see ContextLock in action."}
            {step === "review" && "Review the pre-filled execution request and submit to GenLayer."}
            {step === "result" && "GenLayer consensus decision for this execution case."}
          </p>
        </div>
      </div>

      {!address && (
        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">
              Connect your wallet for a real GenLayer consensus review. Without a wallet, demo results are simulated.
            </p>
          </div>
        </Card>
      )}

      {step === "pick" && <DemoTemplatePicker onSelect={handleSelectTemplate} />}

      {step === "review" && selectedTemplate && demoLock && (
        <div className="space-y-6">
          <LockSummary lock={demoLock} />
          <ExecutionForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            defaultEvidenceUrls={selectedTemplate.default_evidence_urls}
          />
        </div>
      )}

      {step === "result" && result && (
        <div className="space-y-6">
          {demoLock && <LockSummary lock={demoLock} />}
          <VerdictCard result={result} />
          <AssumptionCheckTable checks={result.assumption_checks || []} />
          {evidencePacket && <EvidencePanel packet={evidencePacket} />}
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => { setStep("pick"); setResult(null); }}>
              Try Another Case
            </Button>
            {address && (
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
