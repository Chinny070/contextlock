"use client";

import { useWallet } from "@/lib/wallet/context";
import CreateLockForm from "@/components/locks/CreateLockForm";
import { Shield } from "lucide-react";

export default function CreateLockPage() {
  const { address } = useWallet();

  if (!address) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
        <p className="text-slate-400">Connect your wallet to create a ContextLock.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create ContextLock</h1>
        <p className="text-sm text-slate-400 mt-1">Define an action, lock assumptions, and set execution rules.</p>
      </div>
      <CreateLockForm />
    </div>
  );
}
