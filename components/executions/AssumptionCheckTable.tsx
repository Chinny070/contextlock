"use client";

import type { AssumptionCheck } from "@/lib/supabase/types";
import Card from "../ui/Card";
import { getAssumptionStatusColor, getAssumptionStatusIcon } from "@/lib/utils/format";
import { ClipboardCheck } from "lucide-react";

export default function AssumptionCheckTable({ checks }: { checks: AssumptionCheck[] }) {
  if (!checks || checks.length === 0) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="w-4 h-4 text-blue-400" />
        <h3 className="font-medium text-slate-200">Assumption-by-Assumption Review</h3>
        <span className="text-xs text-slate-500 font-mono ml-auto">Decided by GenLayer validators</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-3 text-xs font-mono text-slate-500 uppercase">Locked Assumption</th>
              <th className="text-left py-2 px-3 text-xs font-mono text-slate-500 uppercase">Status</th>
              <th className="text-left py-2 px-3 text-xs font-mono text-slate-500 uppercase">Evidence Note</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((check, i) => (
              <tr key={i} className="border-b border-slate-800/50">
                <td className="py-3 px-3 text-sm text-slate-300">{check.assumption}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-1 font-mono text-xs ${getAssumptionStatusColor(check.status)}`}>
                    <span>{getAssumptionStatusIcon(check.status)}</span>
                    {check.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-slate-400">{check.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
