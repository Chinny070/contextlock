import { getSupabaseClient } from "./client";
import type { ContextLock, ExecutionRequest, EvidenceSource, ExecutionEvent } from "./types";

function db() {
  const client = getSupabaseClient();
  if (!client) throw new Error("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return client;
}

export async function getProfile(walletAddress: string) {
  const { data, error } = await db()
    .from("profiles")
    .select("*")
    .eq("wallet_address", walletAddress)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function upsertProfile(walletAddress: string, displayName?: string) {
  const { data, error } = await db()
    .from("profiles")
    .upsert({ wallet_address: walletAddress, display_name: displayName || walletAddress.slice(0, 10) }, { onConflict: "wallet_address" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createContextLock(lock: Omit<ContextLock, "id" | "created_at" | "updated_at">) {
  const { data, error } = await db().from("context_locks").insert(lock).select().single();
  if (error) throw error;
  return data as ContextLock;
}

export async function getContextLocks(ownerWallet: string) {
  const { data, error } = await db()
    .from("context_locks")
    .select("*")
    .eq("owner_wallet", ownerWallet)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as ContextLock[];
}

export async function getAllContextLocks() {
  const { data, error } = await db()
    .from("context_locks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as ContextLock[];
}

export async function getContextLock(id: string) {
  const { data, error } = await db().from("context_locks").select("*").eq("id", id).single();
  if (error) throw error;
  return data as ContextLock;
}

export async function createExecutionRequest(req: Omit<ExecutionRequest, "id" | "created_at" | "updated_at">) {
  const { data, error } = await db().from("execution_requests").insert(req).select().single();
  if (error) throw error;
  return data as ExecutionRequest;
}

export async function updateExecutionRequest(id: string, updates: Partial<ExecutionRequest>) {
  const { data, error } = await db().from("execution_requests").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as ExecutionRequest;
}

export async function getExecutionRequests(lockId: string) {
  const { data, error } = await db()
    .from("execution_requests")
    .select("*")
    .eq("lock_id", lockId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as ExecutionRequest[];
}

export async function getExecutionRequest(id: string) {
  const { data, error } = await db().from("execution_requests").select("*").eq("id", id).single();
  if (error) throw error;
  return data as ExecutionRequest;
}

export async function createEvidenceSource(source: Omit<EvidenceSource, "id" | "created_at">) {
  const { data, error } = await db().from("evidence_sources").insert(source).select().single();
  if (error) throw error;
  return data as EvidenceSource;
}

export async function getEvidenceSources(executionRequestId: string) {
  const { data, error } = await db()
    .from("evidence_sources")
    .select("*")
    .eq("execution_request_id", executionRequestId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as EvidenceSource[];
}

export async function createExecutionEvent(event: Omit<ExecutionEvent, "id" | "created_at">) {
  const { data, error } = await db().from("execution_events").insert(event).select().single();
  if (error) throw error;
  return data as ExecutionEvent;
}

export async function getExecutionEvents(lockId: string) {
  const { data, error } = await db()
    .from("execution_events")
    .select("*")
    .eq("lock_id", lockId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as ExecutionEvent[];
}
