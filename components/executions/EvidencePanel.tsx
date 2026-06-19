"use client";

import type { EvidencePacket } from "@/lib/supabase/types";
import Card from "../ui/Card";
import { FileSearch, Link as LinkIcon, BarChart3 } from "lucide-react";

export default function EvidencePanel({ packet }: { packet: EvidencePacket }) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <FileSearch className="w-4 h-4 text-purple-400" />
        <h3 className="font-medium text-slate-200">Evidence Submitted</h3>
      </div>

      {packet.sources && packet.sources.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-mono uppercase">Sources</p>
          {packet.sources.map((source, i) => (
            <div key={i} className="bg-slate-900/50 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-3 h-3 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">{source.title}</span>
                <span className="text-xs text-slate-600 font-mono">{source.type}</span>
              </div>
              {source.url && (
                <p className="text-xs text-blue-400/70 font-mono break-all">{source.url}</p>
              )}
              <p className="text-xs text-slate-400">{source.summary}</p>
              <p className="text-xs text-slate-600">{source.freshness}</p>
            </div>
          ))}
        </div>
      )}

      {packet.metrics && Object.keys(packet.metrics).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3 h-3 text-amber-400" />
            <p className="text-xs text-slate-500 font-mono uppercase">Metrics</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(packet.metrics).map(([key, value]) => (
              <div key={key} className="bg-slate-900/50 rounded-lg p-2">
                <p className="text-xs text-slate-500">{key.replace(/_/g, " ")}</p>
                <p className="text-sm font-mono text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {packet.notes && (
        <div>
          <p className="text-xs text-slate-500 font-mono uppercase mb-1">Notes</p>
          <p className="text-sm text-slate-400">{packet.notes}</p>
        </div>
      )}
    </Card>
  );
}
