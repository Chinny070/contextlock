"use client";

import Card from "../ui/Card";
import Button from "../ui/Button";
import { Cpu, Landmark, Rocket, Package, Bot } from "lucide-react";

export interface DemoTemplate {
  id: string;
  title: string;
  category: string;
  actor_type: string;
  action_description: string;
  original_assumptions: string;
  execution_constraints: string;
  risk_tolerance: string;
  human_approval_policy: string;
  default_evidence_urls: string[];
  demo_execution: {
    requested_action: string;
    current_context_summary: string;
    changed_conditions: string;
    evidence_sources: {
      type: string;
      title: string;
      url: string;
      summary: string;
      freshness: string;
    }[];
    metrics: Record<string, string>;
    notes: string;
  };
}

const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: "compute",
    title: "Buy Cloud GPU Compute",
    category: "COMPUTE_PURCHASE",
    actor_type: "AI_AGENT",
    action_description: "Purchase A100 GPU compute hours from a cloud provider for model training workload.",
    original_assumptions: "A100 supply is available. Price is below $2.50/hour. Provider reputation remains acceptable. No major outage is reported on the provider status page.",
    execution_constraints: "Proceed only if supply exists, pricing is still below the stated limit, and no critical outage is currently active on the provider platform.",
    risk_tolerance: "MEDIUM",
    human_approval_policy: "Ask for human approval if evidence is mixed or risk assessment is uncertain.",
    default_evidence_urls: ["https://status.example-cloud.com", "https://pricing.example-cloud.com/gpu"],
    demo_execution: {
      requested_action: "Purchase 8x A100 GPU instances for 4 hours at current market rate for fine-tuning job.",
      current_context_summary: "A100 GPUs are currently listed as available. Current price is $2.10/hour. The provider status page shows a degraded API incident that started 45 minutes ago.",
      changed_conditions: "Provider status page now shows degraded API performance. All other conditions remain within acceptable range.",
      evidence_sources: [
        { type: "STATUS_PAGE", title: "Provider Status Page", url: "https://status.example-cloud.com", summary: "Degraded API performance. Incident started 45 min ago. GPU provisioning may be affected.", freshness: "Checked at execution time" },
        { type: "MARKET_DATA", title: "GPU Pricing Dashboard", url: "https://pricing.example-cloud.com/gpu", summary: "A100 spot price: $2.10/hour. Supply: 24 units available.", freshness: "Real-time pricing data" },
      ],
      metrics: { price_limit: "$2.50/hour", current_price: "$2.10/hour", supply_available: "24 units", incident_status: "Degraded API" },
      notes: "Time-sensitive training job but not critical. Can wait if needed.",
    },
  },
  {
    id: "treasury",
    title: "Move Treasury Funds to Yield Vault",
    category: "TREASURY_MANAGEMENT",
    actor_type: "DAO",
    action_description: "Transfer 50,000 USDC from DAO treasury to approved yield vault for generating returns.",
    original_assumptions: "Vault APY is above 3%. Vault TVL is above $10M. No security incidents reported in the last 30 days. Protocol audit is current.",
    execution_constraints: "Execute only if yield target is met, vault has sufficient TVL for liquidity, and no security flags exist.",
    risk_tolerance: "LOW",
    human_approval_policy: "Require human approval for any amount above $25,000 or if risk is elevated.",
    default_evidence_urls: ["https://defillama.com/protocol/example-vault"],
    demo_execution: {
      requested_action: "Transfer 50,000 USDC to example-vault yield strategy.",
      current_context_summary: "Vault APY is currently 4.2%. TVL is $28M. Last audit was 3 weeks ago. No security incidents in the last 90 days.",
      changed_conditions: "APY has slightly decreased from 4.8% to 4.2% since lock creation, but still above threshold.",
      evidence_sources: [
        { type: "MARKET_DATA", title: "DeFi Llama Vault Data", url: "https://defillama.com/protocol/example-vault", summary: "Current APY: 4.2%. TVL: $28M. 30d volume: $5.2M.", freshness: "Live data" },
        { type: "WEBSITE", title: "Audit Report", url: "https://audit.example-vault.com", summary: "Latest audit completed 3 weeks ago. No critical findings.", freshness: "Published 3 weeks ago" },
      ],
      metrics: { target_apy: "3.0%", current_apy: "4.2%", tvl: "$28M", transfer_amount: "50,000 USDC" },
      notes: "DAO governance approved this strategy last month.",
    },
  },
  {
    id: "deployment",
    title: "Deploy Production Update v2.4",
    category: "DEPLOYMENT",
    actor_type: "SYSTEM",
    action_description: "Deploy version 2.4 of the main application to production environment.",
    original_assumptions: "All CI tests pass. No active P0/P1 incidents. Staging environment has been validated. Rollback plan is documented.",
    execution_constraints: "Deploy only if CI is green, no active incidents on the status page, and staging validation passed within the last 2 hours.",
    risk_tolerance: "MEDIUM",
    human_approval_policy: "Require human approval if any CI checks are flaky or if there is an active incident of any severity.",
    default_evidence_urls: ["https://ci.example.com/builds/latest", "https://status.example.com"],
    demo_execution: {
      requested_action: "Deploy v2.4.0 to production cluster via rolling update strategy.",
      current_context_summary: "All 47 CI tests pass. Staging validated 1 hour ago. No active incidents. Rollback plan documented in runbook.",
      changed_conditions: "One test was flaky earlier today but passed on re-run. No other changes.",
      evidence_sources: [
        { type: "API", title: "CI Pipeline Status", url: "https://ci.example.com/builds/latest", summary: "Build #1247: All 47 tests passed. Build time: 4m 32s.", freshness: "Completed 20 minutes ago" },
        { type: "STATUS_PAGE", title: "Production Status", url: "https://status.example.com", summary: "All systems operational. No incidents in last 48 hours.", freshness: "Live status" },
      ],
      metrics: { tests_passed: "47/47", build_status: "GREEN", staging_validated: "1 hour ago", active_incidents: "0" },
      notes: "Release includes 3 bug fixes and 1 performance improvement. Low risk change.",
    },
  },
  {
    id: "inventory",
    title: "Purchase Inventory from Supplier",
    category: "INVENTORY_PURCHASE",
    actor_type: "USER",
    action_description: "Order 500 units of product SKU-7890 from primary supplier at negotiated rate.",
    original_assumptions: "Unit price remains at or below $12.50. Supplier lead time is under 14 days. Supplier quality rating is above 4.5/5. No shipping disruptions reported.",
    execution_constraints: "Proceed only if pricing is within budget, lead time is acceptable, and supplier reliability is confirmed.",
    risk_tolerance: "MEDIUM",
    human_approval_policy: "Escalate to human approval if price increased more than 5% or if supplier rating dropped.",
    default_evidence_urls: ["https://supplier-portal.example.com/sku-7890"],
    demo_execution: {
      requested_action: "Place purchase order for 500 units of SKU-7890 at current negotiated rate.",
      current_context_summary: "Current unit price: $12.80 (2.4% above baseline). Lead time: 11 days. Supplier rating: 4.6/5. No shipping disruptions.",
      changed_conditions: "Price has increased slightly from $12.50 to $12.80 per unit. All other conditions stable.",
      evidence_sources: [
        { type: "WEBSITE", title: "Supplier Portal", url: "https://supplier-portal.example.com/sku-7890", summary: "SKU-7890: $12.80/unit, 500+ in stock, 11-day lead time.", freshness: "Current listing" },
        { type: "USER_NOTE", title: "Logistics Check", url: "", summary: "No major shipping disruptions on primary route. Carrier rates stable.", freshness: "Checked today" },
      ],
      metrics: { price_limit: "$12.50/unit", current_price: "$12.80/unit", quantity: "500 units", lead_time: "11 days", supplier_rating: "4.6/5" },
      notes: "Slight price increase but within 5% threshold. Inventory needed within 3 weeks.",
    },
  },
  {
    id: "ai-agent",
    title: "Continue AI Research Agent Workflow",
    category: "AI_AGENT_WORKFLOW",
    actor_type: "AI_AGENT",
    action_description: "Allow research AI agent to continue executing multi-step data collection and analysis workflow.",
    original_assumptions: "Source data APIs are responding. Data freshness is within 1 hour. No conflicting data signals detected. Agent cost budget has not exceeded $50.",
    execution_constraints: "Continue only if data sources are live, evidence is non-conflicting, and cost is within budget.",
    risk_tolerance: "HIGH",
    human_approval_policy: "Always require human approval if cost exceeds 80% of budget or if data sources conflict.",
    default_evidence_urls: ["https://api.datasource1.com/health", "https://api.datasource2.com/health"],
    demo_execution: {
      requested_action: "Continue research workflow: Phase 3 - cross-reference data from source A and source B, generate analysis report.",
      current_context_summary: "Both data source APIs are responsive. Data from source A is 15 minutes old. Data from source B is 32 minutes old. Current spend: $38.50 of $50.00 budget (77%).",
      changed_conditions: "Agent has consumed 77% of budget. Data source B latency increased from 200ms to 800ms. Source A data and Source B data show a minor discrepancy in volume metrics.",
      evidence_sources: [
        { type: "API", title: "Data Source A Health", url: "https://api.datasource1.com/health", summary: "API responsive. Latency: 150ms. Data age: 15 minutes.", freshness: "Live health check" },
        { type: "API", title: "Data Source B Health", url: "https://api.datasource2.com/health", summary: "API responsive but slow. Latency: 800ms (up from 200ms). Data age: 32 minutes.", freshness: "Live health check" },
      ],
      metrics: { budget_total: "$50.00", budget_spent: "$38.50", budget_pct: "77%", source_a_latency: "150ms", source_b_latency: "800ms", data_conflict: "Minor volume discrepancy" },
      notes: "Agent is approaching budget limit and data sources show minor conflicts. Phase 3 is the final analysis step.",
    },
  },
];

const icons: Record<string, typeof Cpu> = {
  compute: Cpu,
  treasury: Landmark,
  deployment: Rocket,
  inventory: Package,
  "ai-agent": Bot,
};

interface DemoTemplatePickerProps {
  onSelect: (template: DemoTemplate) => void;
}

export default function DemoTemplatePicker({ onSelect }: DemoTemplatePickerProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {DEMO_TEMPLATES.map((template) => {
        const Icon = icons[template.id] || Cpu;
        return (
          <Card key={template.id} hover className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{template.title}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{template.actor_type} · {template.risk_tolerance} risk</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 line-clamp-3">{template.action_description}</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={() => onSelect(template)}>
              Try This Case
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

export { DEMO_TEMPLATES };
