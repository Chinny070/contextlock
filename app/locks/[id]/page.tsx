"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getContextLock, getExecutionRequests } from "@/lib/supabase/queries";
import type { ContextLock, ExecutionRequest } from "@/lib/supabase/types";
import LockSummary from "@/components/locks/LockSummary";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { VerdictBadge, StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";
import { Play, Clock, ArrowRight } from "lucide-react";

export default function LockDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lock, setLock] = useState<ContextLock | null>(null);
  const [executions, setExecutions] = useState<ExecutionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [lockData, execData] = await Promise.all([
          getContextLock(id),
          getExecutionRequests(id),
        ]);
        setLock(lockData);
        setExecutions(execData);
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12"><p className="text-slate-400">Loading lock...</p></div>;
  }

  if (!lock) {
    return <div className="text-center py-12"><p className="text-slate-400">Lock not found.</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Lock Details</h1>
        <Link href={`/locks/${id}/execute`}>
          <Button>
            <Play className="w-4 h-4 mr-2" /> Request Execution Review
          </Button>
        </Link>
      </div>

      <LockSummary lock={lock} />

      {/* Past Execution Requests */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Execution History</h2>
        {executions.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-4">No execution requests yet.</p>
            <Link href={`/locks/${id}/execute`}>
              <Button variant="secondary">
                <Play className="w-4 h-4 mr-2" /> Request First Review
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {executions.map((exec) => (
              <Link key={exec.id} href={`/executions/${exec.id}`}>
                <Card hover className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <VerdictBadge verdict={exec.contract_verdict} size="sm" />
                      <div>
                        <p className="text-sm text-slate-200 line-clamp-1">{exec.requested_action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={exec.status} />
                          <span className="text-xs text-slate-500">{formatDate(exec.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
