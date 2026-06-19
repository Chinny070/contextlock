"use client";

import { useWallet } from "@/lib/wallet/context";
import { getContextLocks, getAllContextLocks } from "@/lib/supabase/queries";
import type { ContextLock } from "@/lib/supabase/types";
import { useEffect, useState } from "react";
import LockCard from "@/components/locks/LockCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Shield, Clock, AlertTriangle, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { address } = useWallet();
  const [locks, setLocks] = useState<ContextLock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = address ? await getContextLocks(address) : await getAllContextLocks();
        setLocks(data);
      } catch {
        // Supabase may not be configured yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [address]);

  const activeLocks = locks.filter((l) => l.status === "ACTIVE").length;
  const stats = [
    { label: "Total Locks", value: locks.length, icon: Shield, color: "text-blue-400" },
    { label: "Active", value: activeLocks, icon: Clock, color: "text-emerald-400" },
    { label: "High Risk", value: locks.filter((l) => l.risk_tolerance === "HIGH" || l.risk_tolerance === "CRITICAL").length, icon: AlertTriangle, color: "text-amber-400" },
    { label: "AI Agent", value: locks.filter((l) => l.actor_type === "AI_AGENT").length, icon: BarChart3, color: "text-purple-400" },
  ];

  if (!address) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
        <p className="text-slate-400 mb-6">Connect your wallet to view and manage your ContextLocks.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your execution guards</p>
        </div>
        <Link href="/locks/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Create Lock
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Loading locks...</p>
        </div>
      ) : locks.length === 0 ? (
        <Card className="p-12 text-center">
          <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No ContextLocks Yet</h3>
          <p className="text-sm text-slate-400 mb-4">Create your first execution guard to get started.</p>
          <Link href="/locks/new">
            <Button><Plus className="w-4 h-4 mr-2" /> Create Your First Lock</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {locks.map((lock) => (
            <LockCard key={lock.id} lock={lock} />
          ))}
        </div>
      )}
    </div>
  );
}
