"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLockSchema, CreateLockInput, CATEGORY_OPTIONS, ACTOR_TYPE_OPTIONS, RISK_TOLERANCE_OPTIONS } from "@/lib/validation/lockSchema";
import { createContextLock } from "@/lib/supabase/queries";
import { useWallet } from "@/lib/wallet/context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function CreateLockForm() {
  const { address } = useWallet();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLockInput>({
    resolver: zodResolver(createLockSchema),
    defaultValues: {
      default_evidence_urls: [],
    },
  });

  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([""]);

  const onSubmit = async (data: CreateLockInput) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    setIsSubmitting(true);
    try {
      const urls = evidenceUrls.filter((u) => u.trim().length > 0);
      const lock = await createContextLock({
        ...data,
        owner_wallet: address,
        default_evidence_urls: urls,
        status: "ACTIVE",
      });
      toast.success("ContextLock created successfully");
      router.push(`/locks/${lock.id}`);
    } catch (err) {
      toast.error("Failed to create lock: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">1. Action Identity</h2>
        <div className="space-y-4">
          <Input label="Action Title" placeholder="e.g., Buy Cloud GPU Compute" error={errors.title?.message} {...register("title")} />
          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Category" options={CATEGORY_OPTIONS} error={errors.category?.message} {...register("category")} />
            <Select label="Actor Type" options={ACTOR_TYPE_OPTIONS} error={errors.actor_type?.message} {...register("actor_type")} />
          </div>
          <Textarea label="Action Description" placeholder="Describe what this action does and why it matters..." rows={3} error={errors.action_description?.message} {...register("action_description")} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">2. Original Assumptions</h2>
        <div className="space-y-4">
          <Textarea label="What must remain true for this action to be safe?" placeholder="e.g., A100 supply is available. Price is below $2.50/hour. No major outage reported..." rows={4} error={errors.original_assumptions?.message} {...register("original_assumptions")} />
          <Textarea label="Execution Constraints" placeholder="e.g., Proceed only if supply exists and pricing is below the stated limit..." rows={3} error={errors.execution_constraints?.message} {...register("execution_constraints")} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">3. Execution Rules</h2>
        <div className="space-y-4">
          <Select label="Risk Tolerance" options={RISK_TOLERANCE_OPTIONS} error={errors.risk_tolerance?.message} {...register("risk_tolerance")} />
          <Textarea label="Human Approval Policy" placeholder="e.g., Ask for human approval if evidence is mixed or risk is uncertain..." rows={2} error={errors.human_approval_policy?.message} {...register("human_approval_policy")} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">4. Evidence Setup</h2>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Default Evidence URLs</label>
          {evidenceUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={url}
                onChange={(e) => {
                  const updated = [...evidenceUrls];
                  updated[index] = e.target.value;
                  setEvidenceUrls(updated);
                }}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm"
              />
              {evidenceUrls.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={() => setEvidenceUrls([...evidenceUrls, ""])}>
            + Add URL
          </Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting || !address}>
          {isSubmitting ? "Creating Lock..." : "Create ContextLock"}
        </Button>
      </div>
    </form>
  );
}
