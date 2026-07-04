"use client";

import { useWallet } from "@/lib/wallet/context";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Shield, ArrowRight, Zap, Eye, Scale, Lock, Bot, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const { address, connect, isConnecting } = useWallet();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="text-center pt-16 pb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <Shield className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Do not let agents<br />execute blindly.
        </h1>
        <p className="text-xl md:text-2xl text-blue-400 font-medium mb-6">
          ContextLock checks reality before execution.
        </p>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-lg">
          Create instructions, lock assumptions, and let GenLayer decide whether an action should
          execute, pause, reject, or require human approval when conditions change.
        </p>
        <div className="flex items-center justify-center gap-4">
          {address ? (
            <>
              <Link href="/dashboard">
                <Button size="lg">
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" size="lg">Try Demo</Button>
              </Link>
            </>
          ) : (
            <>
              <Button size="lg" onClick={connect} disabled={isConnecting}>
                {isConnecting ? "Connecting..." : "Connect Wallet to Start"}
              </Button>
              <Link href="/demo">
                <Button variant="secondary" size="lg">Explore Demo</Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Problem */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">The Problem</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Most automation systems execute when a fixed trigger happens. They never ask whether the action still makes sense.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Blind Execution</h3>
            <p className="text-sm text-slate-400">Traditional triggers fire regardless of whether the world has changed since the rule was set.</p>
          </Card>
          <Card className="p-6 text-center">
            <Bot className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Unguarded AI Agents</h3>
            <p className="text-sm text-slate-400">AI agents execute multi-step workflows without checking if their original assumptions still hold.</p>
          </Card>
          <Card className="p-6 text-center">
            <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">No Contextual Safety</h3>
            <p className="text-sm text-slate-400">There is no standard way to make execution conditional on interpreted, real-world context.</p>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">How ContextLock Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Create Lock", desc: "Define your action, lock the assumptions that must remain true, and set risk tolerance.", icon: Lock },
            { step: "2", title: "Request Execution", desc: "When ready to act, submit current evidence and context for review.", icon: Eye },
            { step: "3", title: "GenLayer Decides", desc: "Validators independently reason over your case and reach consensus.", icon: Scale },
            { step: "4", title: "Act on Verdict", desc: "Execute, pause, reject, or escalate based on the consensus decision.", icon: CheckCircle2 },
          ].map((item) => (
            <Card key={item.step} className="p-5 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <item.icon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Why GenLayer */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why GenLayer Is The Star</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Traditional smart contracts can check deterministic rules. ContextLock needs something more: interpreted reasoning over real-world context.
          </p>
        </div>
        <Card className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-500 mb-3 text-sm uppercase tracking-wider">Traditional Contracts Can Check</h3>
              <ul className="space-y-2">
                {["Is the deadline reached?", "Is the sender authorised?", "Is the balance enough?", "Is this number above a threshold?"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-slate-600">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-3 text-sm uppercase tracking-wider">GenLayer Validators Can Reason</h3>
              <ul className="space-y-2">
                {[
                  "Has the market changed too much?",
                  "Does the original risk assumption still hold?",
                  "Is the action still reasonable based on new information?",
                  "Should the agent continue, pause, or escalate?",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-200">
                    <span className="text-blue-400">✦</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* Use Cases */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Use Cases</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Buying compute", "Moving treasury funds", "Executing a trade",
            "Renewing a subscription", "Purchasing inventory", "Triggering a deployment",
            "Accepting a market order", "Paying an invoice", "Continuing an AI agent workflow",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 px-4 py-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
              <ArrowRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Example Decision */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Example Execution Decision</h2>
        </div>
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs text-slate-500 font-mono mb-1">LOCKED INSTRUCTION</p>
              <p className="text-sm text-slate-300">Buy GPU compute only if A100 supply is available, price stays below $2.50/hour, and the provider has no major outage.</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-xs text-slate-500 font-mono mb-1">CURRENT EVIDENCE</p>
              <p className="text-sm text-slate-300">Price: $2.10/hour · Supply: Available · Status: Degraded API incident</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-xs font-mono text-amber-400 mb-1">GENLAYER CONSENSUS VERDICT: PAUSE</p>
              <p className="text-sm text-slate-300">Pricing and supply support execution, but the provider status page shows degraded service. Because the action depends on reliable compute availability, execution should pause until the incident clears or a human approves.</p>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Guard Your Executions?</h2>
        <p className="text-slate-400 mb-6">Connect your wallet and create your first ContextLock.</p>
        <div className="flex items-center justify-center gap-4">
          {address ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          ) : (
            <Button size="lg" onClick={connect} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          <Link href="/demo">
            <Button variant="secondary" size="lg">Try Demo Cases</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
