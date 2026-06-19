"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExecutionSchema, CreateExecutionInput } from "@/lib/validation/executionSchema";
import { useWallet } from "@/lib/wallet/context";
import { useState } from "react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { ACTOR_TYPE_OPTIONS } from "@/lib/validation/lockSchema";
import { Loader2 } from "lucide-react";

interface ExecutionFormProps {
  onSubmit: (data: CreateExecutionInput) => Promise<void>;
  isSubmitting: boolean;
  defaultEvidenceUrls?: string[];
}

export default function ExecutionForm({ onSubmit, isSubmitting, defaultEvidenceUrls = [] }: ExecutionFormProps) {
  const { address } = useWallet();
  const [metricKey, setMetricKey] = useState("");
  const [metricValue, setMetricValue] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateExecutionInput>({
    resolver: zodResolver(createExecutionSchema),
    defaultValues: {
      evidence_sources: defaultEvidenceUrls.length > 0
        ? defaultEvidenceUrls.map((url) => ({ type: "WEBSITE", title: "", url, summary: "", freshness: "Checked at execution time" }))
        : [{ type: "WEBSITE", title: "", url: "", summary: "", freshness: "Checked at execution time" }],
      metrics: {},
      notes: "",
      changed_conditions: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "evidence_sources" });
  const metrics = watch("metrics") || {};

  const addMetric = () => {
    if (metricKey.trim() && metricValue.trim()) {
      setValue("metrics", { ...metrics, [metricKey.trim()]: metricValue.trim() });
      setMetricKey("");
      setMetricValue("");
    }
  };

  const sourceTypeOptions = [
    { value: "WEBSITE", label: "Website" },
    { value: "API", label: "API" },
    { value: "STATUS_PAGE", label: "Status Page" },
    { value: "MARKET_DATA", label: "Market Data" },
    { value: "USER_NOTE", label: "User Note" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">1. Requested Execution</h2>
        <div className="space-y-4">
          <Textarea label="What is about to happen?" placeholder="Describe the specific action to be taken now..." rows={3} error={errors.requested_action?.message} {...register("requested_action")} />
          <Select label="Who/what is executing?" options={ACTOR_TYPE_OPTIONS} error={errors.executor_type?.message} {...register("executor_type")} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">2. Current Reality</h2>
        <div className="space-y-4">
          <Textarea label="What is true now?" placeholder="Describe the current state of conditions relevant to the locked assumptions..." rows={3} error={errors.current_context_summary?.message} {...register("current_context_summary")} />
          <Textarea label="What changed since the lock was created?" placeholder="Note any shifts in market, availability, risk, or context..." rows={2} error={errors.changed_conditions?.message} {...register("changed_conditions")} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">3. Evidence</h2>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-slate-900/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-mono">Source {index + 1}</span>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>Remove</Button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Select label="Type" options={sourceTypeOptions} {...register(`evidence_sources.${index}.type`)} />
                <Input label="Title" placeholder="Source name..." {...register(`evidence_sources.${index}.title`)} />
              </div>
              <Input label="URL" placeholder="https://..." {...register(`evidence_sources.${index}.url`)} />
              <Textarea label="Summary" placeholder="What does this evidence show?" rows={2} {...register(`evidence_sources.${index}.summary`)} />
            </div>
          ))}
          {errors.evidence_sources?.message && <p className="text-xs text-red-400">{errors.evidence_sources.message}</p>}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ type: "WEBSITE", title: "", url: "", summary: "", freshness: "Checked at execution time" })}
          >
            + Add Evidence Source
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-slate-300">Metrics (optional)</p>
          <div className="flex gap-2">
            <input
              value={metricKey}
              onChange={(e) => setMetricKey(e.target.value)}
              placeholder="Key (e.g., current_price)"
              className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              placeholder="Value (e.g., $2.10/hour)"
              className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addMetric}>Add</Button>
          </div>
          {Object.entries(metrics).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 rounded text-xs font-mono text-slate-300">
                  {k}: {v}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...metrics };
                      delete updated[k];
                      setValue("metrics", updated);
                    }}
                    className="text-slate-500 hover:text-red-400 ml-1"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Textarea label="Additional Notes" placeholder="Any notes for the validators..." rows={2} {...register("notes")} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting || !address}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting to GenLayer...
            </span>
          ) : (
            "Submit to GenLayer for Review"
          )}
        </Button>
      </div>
    </form>
  );
}
