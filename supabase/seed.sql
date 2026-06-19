-- Seed data for ContextLock demo

-- Demo lock: GPU Compute Purchase Guard
INSERT INTO context_locks (id, owner_wallet, title, category, actor_type, action_description, original_assumptions, execution_constraints, risk_tolerance, human_approval_policy, default_evidence_urls, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '0xDEMO000000000000000000000000000000000001',
  'Buy Cloud GPU Compute',
  'COMPUTE_PURCHASE',
  'AI_AGENT',
  'Purchase A100 GPU compute hours from a cloud provider for model training workload.',
  'A100 supply is available. Price is below $2.50/hour. Provider reputation remains acceptable. No major outage is reported on the provider status page.',
  'Proceed only if supply exists, pricing is still below the stated limit, and no critical outage is currently active on the provider platform.',
  'MEDIUM',
  'Ask for human approval if evidence is mixed or risk assessment is uncertain.',
  '["https://status.example-cloud.com", "https://pricing.example-cloud.com/gpu"]',
  'ACTIVE'
);

-- Demo lock: Treasury Movement Guard
INSERT INTO context_locks (id, owner_wallet, title, category, actor_type, action_description, original_assumptions, execution_constraints, risk_tolerance, human_approval_policy, default_evidence_urls, status)
VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  '0xDEMO000000000000000000000000000000000001',
  'Move Treasury Funds to Yield Vault',
  'TREASURY_MANAGEMENT',
  'DAO',
  'Transfer 50,000 USDC from DAO treasury to approved yield vault for generating returns.',
  'Vault APY is above 3%. Vault TVL is above $10M. No security incidents reported in the last 30 days. Protocol audit is current.',
  'Execute only if yield target is met, vault has sufficient TVL for liquidity, and no security flags exist.',
  'LOW',
  'Require human approval for any amount above $25,000 or if risk is elevated.',
  '["https://defillama.com/protocol/example-vault", "https://audit.example-vault.com"]',
  'ACTIVE'
);

-- Demo lock: Deployment Safety Guard
INSERT INTO context_locks (id, owner_wallet, title, category, actor_type, action_description, original_assumptions, execution_constraints, risk_tolerance, human_approval_policy, default_evidence_urls, status)
VALUES (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  '0xDEMO000000000000000000000000000000000001',
  'Deploy Production Update v2.4',
  'DEPLOYMENT',
  'SYSTEM',
  'Deploy version 2.4 of the main application to production environment.',
  'All CI tests pass. No active P0/P1 incidents. Staging environment has been validated. Rollback plan is documented.',
  'Deploy only if CI is green, no active incidents on the status page, and staging validation passed within the last 2 hours.',
  'MEDIUM',
  'Require human approval if any CI checks are flaky or if there is an active incident of any severity.',
  '["https://ci.example.com/builds/latest", "https://status.example.com"]',
  'ACTIVE'
);

-- Demo lock: Inventory Purchase Guard
INSERT INTO context_locks (id, owner_wallet, title, category, actor_type, action_description, original_assumptions, execution_constraints, risk_tolerance, human_approval_policy, default_evidence_urls, status)
VALUES (
  'd4e5f6a7-b8c9-0123-defa-234567890123',
  '0xDEMO000000000000000000000000000000000001',
  'Purchase Inventory from Supplier',
  'INVENTORY_PURCHASE',
  'USER',
  'Order 500 units of product SKU-7890 from primary supplier at negotiated rate.',
  'Unit price remains at or below $12.50. Supplier lead time is under 14 days. Supplier quality rating is above 4.5/5. No shipping disruptions reported.',
  'Proceed only if pricing is within budget, lead time is acceptable, and supplier reliability is confirmed.',
  'MEDIUM',
  'Escalate to human approval if price increased more than 5% or if supplier rating dropped.',
  '["https://supplier-portal.example.com/sku-7890", "https://logistics.example.com/disruptions"]',
  'ACTIVE'
);

-- Demo lock: AI Agent Continuation Guard
INSERT INTO context_locks (id, owner_wallet, title, category, actor_type, action_description, original_assumptions, execution_constraints, risk_tolerance, human_approval_policy, default_evidence_urls, status)
VALUES (
  'e5f6a7b8-c9d0-1234-efab-345678901234',
  '0xDEMO000000000000000000000000000000000001',
  'Continue AI Research Agent Workflow',
  'AI_AGENT_WORKFLOW',
  'AI_AGENT',
  'Allow research AI agent to continue executing multi-step data collection and analysis workflow.',
  'Source data APIs are responding. Data freshness is within 1 hour. No conflicting data signals detected. Agent cost budget has not exceeded $50.',
  'Continue only if data sources are live, evidence is non-conflicting, and cost is within budget.',
  'HIGH',
  'Always require human approval if cost exceeds 80% of budget or if data sources conflict.',
  '["https://api.datasource1.com/health", "https://api.datasource2.com/health"]',
  'ACTIVE'
);
