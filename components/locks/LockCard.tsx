"use client";

import Link from "next/link";
import type { ContextLock } from "@/lib/supabase/types";
import Card from "../ui/Card";
import { StatusBadge, RiskBadge } from "../ui/Badge";
import { formatDate } from "@/lib/utils/format";
import { ChevronRight, Clock, User, Bot, Building, Cpu, Settings } from "lucide-react";

const actorIcons: Record<string, typeof User> = {
  USER: User,
  AI_AGENT: Bot,
  BOT: Cpu,
  DAO: Building,
  SYSTEM: Settings,
};

export default function LockCard({ lock }: { lock: ContextLock }) {
  const ActorIcon = actorIcons[lock.actor_type] || User;

  return (
    <Link href={`/locks/${lock.id}`}>
      <Card hover className="p-5 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <ActorIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {lock.title}
              </h3>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 mb-3">
              {lock.action_description}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={lock.status} />
              <RiskBadge risk={lock.risk_tolerance} />
              <span className="text-xs text-slate-500 font-mono">{lock.category}</span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {formatDate(lock.created_at)}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0 mt-1" />
        </div>
      </Card>
    </Link>
  );
}
