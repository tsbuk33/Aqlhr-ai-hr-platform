// Deno Edge Function: kernel-worker-v1
// Polls job_queue and runs jobs. Uses service role (secure env var).
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Job = {
  id: number;
  tenant_id: string;
  type: string;
  payload: Record<string, unknown>;
  attempts: number;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MAX_CLAIM = Number(Deno.env.get("KERNEL_MAX_CLAIM") || 10);

const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { headers: { "x-kernel-worker": "v1" } },
});

// Simple router to allow HTTP invoke (and scheduled)
serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname.endsWith("/health")) {
    const { data } = await supa.from("aqlhr_core.job_queue").select("id", { count: "exact", head: true });
    return new Response(JSON.stringify({ ok: true, queued: data?.length ?? 0 }), { headers: { "content-type": "application/json" } });
  }

  try {
    const jobs = await claimJobs(MAX_CLAIM);
    for (const j of jobs) {
      await runJob(j);
    }
    return new Response(JSON.stringify({ ok: true, claimed: jobs.length }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});

async function claimJobs(limit: number): Promise<Job[]> {
  const { data, error } = await supa.rpc("core_claim_jobs", { p_limit: limit });
  if (error) throw error;
  return (data ?? []) as Job[];
}

async function completeJob(id: number, status: "completed" | "failed" | "dead", err?: string) {
  const { error } = await supa.rpc("core_complete_job", { p_id: id, p_status: status, p_error: err ?? null });
  if (error) throw error;
}

async function runJob(job: Job) {
  try {
    switch (job.type) {
      case "recompute_kpis":
        await recomputeKpis(job);
        break;
      case "refresh_materialized_views":
        await refreshMatViews(job);
        break;
      case "send_export":
        await sendExport(job);
        break;
      case "pulse_schedule":
        await schedulePulses(job);
        break;
      case "evidence_embed":
        await evidenceEmbed(job);
        break;
      case "compliance_run":
        await complianceRun(job);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
    await completeJob(job.id, "completed");
  } catch (e) {
    const msg = String(e?.message ?? e);
    const attempts = job.attempts + 1;
    if (attempts >= 5) {
      await completeJob(job.id, "dead", msg);
    } else {
      // mark failed; attempts++ handled in RPC; leave for next poll/backoff
      await completeJob(job.id, "failed", msg);
    }
  }
}

// ===== Handlers (wire to existing RPCs you already have) =====
async function recomputeKpis(job: Job) {
  // example: call your existing KPI refresh
  // await supa.rpc("dashboard_recompute_v1", { p_tenant: job.tenant_id });
  console.log(`Recomputing KPIs for tenant ${job.tenant_id}`);
}

async function refreshMatViews(job: Job) {
  // await supa.rpc("refresh_cci_quality_stats");
  console.log(`Refreshing materialized views for tenant ${job.tenant_id}`);
}

async function sendExport(job: Job) {
  // payload: { module: 'cci'|'osi'|'retention', wave_id?, options? }
  // Call your export function and email or store in storage.
  console.log(`Sending export for tenant ${job.tenant_id}:`, job.payload);
}

async function schedulePulses(job: Job) {
  // e.g., create pulse survey waves based on job.payload.schedule
  console.log(`Scheduling pulses for tenant ${job.tenant_id}:`, job.payload);
}

async function evidenceEmbed(job: Job) {
  // e.g., vectorize new evidence using existing pgvector and store embedding
  console.log(`Processing evidence embeddings for tenant ${job.tenant_id}:`, job.payload);
}

async function complianceRun(job: Job) {
  // e.g., trigger your compliance autopilot run and task creation
  console.log(`Running compliance check for tenant ${job.tenant_id}:`, job.payload);
}