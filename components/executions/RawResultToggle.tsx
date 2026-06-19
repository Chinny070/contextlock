"use client";

import { useState } from "react";
import type { ContractResult } from "@/lib/supabase/types";
import Card from "../ui/Card";
import { Code, ChevronDown, ChevronUp } from "lucide-react";

export default function RawResultToggle({ result }: { result: ContractResult }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-slate-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span>Raw Contract Result JSON</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <pre className="mt-3 p-4 bg-slate-900 rounded-lg text-xs text-slate-400 font-mono overflow-x-auto max-h-96">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </Card>
  );
}
