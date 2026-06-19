# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *

import json


class ContextLockGuard(gl.Contract):
    results: TreeMap[str, str]
    result_count: u256

    def __init__(self):
        self.result_count = u256(0)

    @gl.public.write
    def request_execution_review(
        self,
        request_id: str,
        lock_id: str,
        owner_wallet: str,
        action_title: str,
        action_description: str,
        original_assumptions: str,
        execution_constraints: str,
        risk_tolerance: str,
        human_approval_policy: str,
        requested_action: str,
        current_context_summary: str,
        changed_conditions: str,
        evidence_packet: str,
    ) -> None:
        if request_id in self.results:
            return

        prompt = f"""You are a ContextLock execution reviewer for the GenLayer protocol.

Your role: decide whether a requested action should still execute, given the original locked assumptions and the current real-world evidence.

## Original Instruction
Action Title: {action_title}
Action Description: {action_description}

## Locked Assumptions
{original_assumptions}

## Execution Constraints
{execution_constraints}

## Risk Tolerance
{risk_tolerance}

## Human Approval Policy
{human_approval_policy}

## Requested Action Now
{requested_action}

## Current Context Summary
{current_context_summary}

## What Changed Since Lock Was Created
{changed_conditions}

## Evidence Packet
{evidence_packet}

## Your Task
Evaluate whether the requested action should still execute. Compare each original assumption against the current evidence. Assess risk, evidence quality, and whether conditions still support execution.

EXECUTE: action matches original instruction, assumptions still valid, evidence fresh, risk within tolerance, no contradictions.
PAUSE: evidence stale or incomplete, conditions unstable, more checking needed.
REJECT: action no longer matches lock, key assumption contradicted, risk exceeds tolerance, evidence suggests unsafe.
HUMAN_APPROVAL_REQUIRED: case ambiguous but high-impact, evidence conflicts, risk high or critical, human approval policy requires escalation.

Respond using ONLY the following JSON format:
{{
  "decision": "EXECUTE or PAUSE or REJECT or HUMAN_APPROVAL_REQUIRED",
  "confidence": "LOW or MEDIUM or HIGH",
  "risk_level": "LOW or MEDIUM or HIGH or CRITICAL",
  "reason_summary": "string explaining the decision",
  "assumption_checks": [
    {{
      "assumption": "the original assumption text",
      "status": "SUPPORTED or WEAKLY_SUPPORTED or CONTRADICTED or UNKNOWN",
      "note": "explanation"
    }}
  ],
  "evidence_quality": "POOR or LIMITED or GOOD or STRONG",
  "recommended_next_step": "what to do next"
}}
It is mandatory that you respond only using the JSON format above,
nothing else. Don't include any other words or characters,
your output must be only JSON without any formatting prefix or suffix.
This result should be perfectly parsable by a JSON parser without errors.
"""

        def get_review_result():
            result = gl.nondet.exec_prompt(prompt)
            result = result.replace("```json", "").replace("```", "")
            print(result)
            return result

        result = gl.eq_principle.prompt_comparative(
            get_review_result,
            "The value of decision must match exactly. Both must return the same verdict: EXECUTE, PAUSE, REJECT, or HUMAN_APPROVAL_REQUIRED.",
        )

        parsed = json.loads(result)

        valid_decisions = ["EXECUTE", "PAUSE", "REJECT", "HUMAN_APPROVAL_REQUIRED"]
        if parsed.get("decision") not in valid_decisions:
            parsed["decision"] = "PAUSE"

        stored = {
            "request_id": request_id,
            "lock_id": lock_id,
            "owner_wallet": owner_wallet,
            "decision": parsed["decision"],
            "confidence": parsed.get("confidence", "MEDIUM"),
            "risk_level": parsed.get("risk_level", "MEDIUM"),
            "reason_summary": parsed.get("reason_summary", ""),
            "assumption_checks": parsed.get("assumption_checks", []),
            "evidence_quality": parsed.get("evidence_quality", "LIMITED"),
            "recommended_next_step": parsed.get("recommended_next_step", ""),
        }

        self.results[request_id] = json.dumps(stored)
        self.result_count = u256(int(self.result_count) + 1)

    @gl.public.view
    def get_execution_result(self, request_id: str) -> str:
        if request_id not in self.results:
            return json.dumps({"error": "No result found for this request_id"})
        return self.results[request_id]

    @gl.public.view
    def has_result(self, request_id: str) -> bool:
        return request_id in self.results

    @gl.public.view
    def get_decision(self, request_id: str) -> str:
        if request_id not in self.results:
            return "NOT_FOUND"
        parsed = json.loads(self.results[request_id])
        return parsed.get("decision", "NOT_FOUND")

    @gl.public.view
    def get_result_count(self) -> int:
        return int(self.result_count)
