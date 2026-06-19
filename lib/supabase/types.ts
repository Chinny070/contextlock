export type ActorType = "USER" | "AI_AGENT" | "BOT" | "DAO" | "SYSTEM";
export type LockStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";
export type RiskTolerance = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ExecutionRequestStatus = "DRAFT" | "SUBMITTED" | "REVIEWING" | "DECIDED" | "FAILED";
export type Verdict = "EXECUTE" | "PAUSE" | "REJECT" | "HUMAN_APPROVAL_REQUIRED";
export type Confidence = "LOW" | "MEDIUM" | "HIGH";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EvidenceQuality = "POOR" | "LIMITED" | "GOOD" | "STRONG";
export type AssumptionStatus = "SUPPORTED" | "WEAKLY_SUPPORTED" | "CONTRADICTED" | "UNKNOWN";
export type SourceType = "WEBSITE" | "API" | "STATUS_PAGE" | "MARKET_DATA" | "USER_NOTE" | "FILE_METADATA" | "OTHER";

export interface Profile {
  id: string;
  wallet_address: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContextLock {
  id: string;
  owner_wallet: string;
  title: string;
  category: string;
  actor_type: ActorType;
  action_description: string;
  original_assumptions: string;
  execution_constraints: string;
  risk_tolerance: RiskTolerance;
  human_approval_policy: string;
  default_evidence_urls: string[];
  status: LockStatus;
  created_at: string;
  updated_at: string;
}

export interface ExecutionRequest {
  id: string;
  lock_id: string;
  owner_wallet: string;
  requested_action: string;
  executor_type: string;
  current_context_summary: string;
  changed_conditions: string | null;
  evidence_packet: EvidencePacket;
  status: ExecutionRequestStatus;
  contract_request_id: string | null;
  contract_tx_hash: string | null;
  contract_verdict: Verdict | null;
  contract_confidence: Confidence | null;
  contract_risk_level: RiskLevel | null;
  contract_reason_summary: string | null;
  contract_raw_result: ContractResult | null;
  created_at: string;
  updated_at: string;
}

export interface EvidenceSource {
  id: string;
  execution_request_id: string;
  source_type: SourceType;
  title: string | null;
  url: string | null;
  summary: string | null;
  content_hash: string | null;
  freshness_note: string | null;
  created_at: string;
}

export interface ExecutionEvent {
  id: string;
  lock_id: string;
  execution_request_id: string;
  event_type: string;
  event_title: string;
  event_body: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface EvidencePacket {
  sources: {
    type: string;
    title: string;
    url: string;
    summary: string;
    freshness: string;
  }[];
  metrics: Record<string, string>;
  notes: string;
  generatedAt?: string;
}

export interface AssumptionCheck {
  assumption: string;
  status: AssumptionStatus;
  note: string;
}

export interface ContractResult {
  request_id: string;
  lock_id: string;
  owner_wallet: string;
  decision: Verdict;
  confidence: Confidence;
  risk_level: RiskLevel;
  reason_summary: string;
  assumption_checks: AssumptionCheck[];
  evidence_quality: EvidenceQuality;
  recommended_next_step: string;
  created_at: string;
}
