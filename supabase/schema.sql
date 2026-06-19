-- ContextLock Supabase Schema

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Context Locks
CREATE TABLE IF NOT EXISTS context_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_wallet text NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  actor_type text NOT NULL CHECK (actor_type IN ('USER', 'AI_AGENT', 'BOT', 'DAO', 'SYSTEM')),
  action_description text NOT NULL,
  original_assumptions text NOT NULL,
  execution_constraints text NOT NULL,
  risk_tolerance text NOT NULL CHECK (risk_tolerance IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  human_approval_policy text NOT NULL,
  default_evidence_urls jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'ARCHIVED')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Execution Requests
CREATE TABLE IF NOT EXISTS execution_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id uuid REFERENCES context_locks(id) ON DELETE CASCADE,
  owner_wallet text NOT NULL,
  requested_action text NOT NULL,
  executor_type text NOT NULL,
  current_context_summary text NOT NULL,
  changed_conditions text,
  evidence_packet jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'REVIEWING', 'DECIDED', 'FAILED')),
  contract_request_id text,
  contract_tx_hash text,
  contract_verdict text CHECK (contract_verdict IS NULL OR contract_verdict IN ('EXECUTE', 'PAUSE', 'REJECT', 'HUMAN_APPROVAL_REQUIRED')),
  contract_confidence text,
  contract_risk_level text,
  contract_reason_summary text,
  contract_raw_result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Evidence Sources
CREATE TABLE IF NOT EXISTS evidence_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_request_id uuid REFERENCES execution_requests(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (source_type IN ('WEBSITE', 'API', 'STATUS_PAGE', 'MARKET_DATA', 'USER_NOTE', 'FILE_METADATA', 'OTHER')),
  title text,
  url text,
  summary text,
  content_hash text,
  freshness_note text,
  created_at timestamptz DEFAULT now()
);

-- Execution Events (timeline)
CREATE TABLE IF NOT EXISTS execution_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_id uuid REFERENCES context_locks(id) ON DELETE CASCADE,
  execution_request_id uuid REFERENCES execution_requests(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_title text NOT NULL,
  event_body text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_context_locks_owner ON context_locks(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_execution_requests_lock ON execution_requests(lock_id);
CREATE INDEX IF NOT EXISTS idx_execution_requests_owner ON execution_requests(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_evidence_sources_request ON evidence_sources(execution_request_id);
CREATE INDEX IF NOT EXISTS idx_execution_events_lock ON execution_events(lock_id);
CREATE INDEX IF NOT EXISTS idx_execution_events_request ON execution_events(execution_request_id);
