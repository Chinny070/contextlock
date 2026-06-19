# ContextLock

**GenLayer-powered execution guard that prevents users and AI agents from acting blindly by making actions depend on real-world context, validator reasoning, and consensus-backed execution decisions.**

## Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Database:** Supabase (Postgres + RLS)
- **Smart Contract:** GenLayer Intelligent Contract (Python)
- **Wallet:** MetaMask / any EVM wallet
- **Chain:** GenLayer Simulator (Chain ID 61999)

## How It Works

1. **Create a ContextLock** — define an action, lock assumptions that must remain true, set risk tolerance
2. **Request Execution Review** — when ready to act, submit current evidence and context
3. **GenLayer Decides** — validators independently reason over the case and reach consensus
4. **Act on the Verdict** — EXECUTE, PAUSE, REJECT, or HUMAN_APPROVAL_REQUIRED

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in your Supabase and GenLayer values.

### 3. Set up Supabase

Run the SQL files in your Supabase SQL editor:

1. `supabase/schema.sql` — creates tables
2. `supabase/rls.sql` — enables row level security
3. `supabase/seed.sql` — adds demo data (optional)

### 4. Deploy the GenLayer contract

Deploy `contracts/ContextLockGuard.py` to GenLayer Simulator and set `NEXT_PUBLIC_CONTEXTLOCK_CONTRACT_ADDRESS` in your `.env.local`.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo

Visit `/demo` to try pre-built execution cases:

- **GPU Compute Purchase Guard** — buy compute only if supply, price, and provider status support it
- **Treasury Movement Guard** — move funds only if yield, TVL, and security conditions hold
- **Deployment Safety Guard** — deploy only if CI passes and no incidents are active
- **Inventory Purchase Guard** — order only if price, lead time, and supplier quality are acceptable
- **AI Agent Continuation Guard** — let an agent continue only if data sources are fresh and non-conflicting

## Contract

The `ContextLockGuard` contract uses GenLayer's `call_llm_with_principle` for non-deterministic validator reasoning with equivalence principle on the canonical decision. It:

- Rejects caller-supplied verdicts
- Accepts structured execution packets
- Forces validators to return strict JSON
- Stores consensus-backed decisions on-chain
- Exposes read methods for verdict retrieval

## Project Structure

```
app/                    # Next.js pages
  dashboard/            # User dashboard
  demo/                 # Demo cases
  locks/new/            # Create lock
  locks/[id]/           # Lock detail
  locks/[id]/execute/   # Request execution
  executions/[id]/      # Execution result
components/             # React components
  layout/               # AppShell, Navbar
  locks/                # LockCard, CreateLockForm, LockSummary
  executions/           # VerdictCard, AssumptionCheckTable, EvidencePanel
  demo/                 # DemoTemplatePicker
  ui/                   # Button, Card, Badge, Input, Textarea, Select
lib/                    # Library code
  supabase/             # Client, queries, types
  genlayer/             # Client, contract, packet
  validation/           # Zod schemas
  wallet/               # Wallet context
  utils/                # Formatting, IDs
contracts/              # GenLayer intelligent contract
supabase/               # SQL schema, RLS, seed
```
