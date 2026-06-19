"use client";

import Link from "next/link";
import { useWallet } from "@/lib/wallet/context";
import { shortenAddress } from "@/lib/utils/format";
import Button from "../ui/Button";
import { Shield, LayoutDashboard, FlaskConical, Plus } from "lucide-react";

export default function Navbar() {
  const { address, isConnecting, connect, disconnect } = useWallet();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-white font-mono">ContextLock</span>
            </Link>
            {address && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/locks/new"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Lock
                </Link>
                <Link
                  href="/demo"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <FlaskConical className="w-4 h-4" />
                  Demo
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {address ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg">
                  {shortenAddress(address)}
                </span>
                <Button variant="ghost" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connect} disabled={isConnecting}>
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
