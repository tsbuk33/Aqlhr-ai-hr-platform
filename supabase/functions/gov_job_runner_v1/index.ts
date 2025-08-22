import { serve, createClient, corsHeaders } from "../_shared/deps.ts";

const corsResponse = () => new Response('ok', { headers: corsHeaders });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { jobId, tenantId, testMode = false } = await req.json();

    let job;

    if (jobId) {
      // Get specific job
      const { data, error } = await supabase
        .from('gov_sync_jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) throw error;
      job = data;
    } else {
      // Get next queued job
      const { data, error } = await supabase
        .from('gov_sync_jobs')
        .select('*')
        .eq('status', 'queued')
        .order('created_at')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) {
        return new Response(
          JSON.stringify({ success: true, message: 'No queued jobs found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      job = data;
    }

    // Mark job as running
    await supabase
      .from('gov_sync_jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', job.id);

    let result;
    let success = false;

    try {
      // Dispatch to appropriate sync function based on system and job type
      const functionName = `${job.system}_${job.job_type.replace('_sync', '')}_sync_v1`;
      
      console.log(`Dispatching to function: ${functionName}`);
      
      switch (job.system) {
        case 'qiwa':
          if (job.job_type === 'status_check' || job.job_type === 'full_sync') {
            const { data, error } = await supabase.functions.invoke('qiwa_status_sync_v1', {
              body: { 
                tenantId: job.tenant_id, 
                testMode: testMode || job.payload?.demo_mode,
                jobId: job.id
              }
            });
            if (error) throw error;
            result = data;
          }
          break;
          
        case 'gosi':
          if (job.job_type === 'fetch_contribs' || job.job_type === 'full_sync') {
            const { data, error } = await supabase.functions.invoke('gosi_contrib_sync_v1', {
              body: { 
                tenantId: job.tenant_id, 
                testMode: testMode || job.payload?.demo_mode,
                jobId: job.id
              }
            });
            if (error) throw error;
            result = data;
          }
          break;
          
        case 'absher':
          if (job.job_type === 'validate_iqamas' || job.job_type === 'full_sync') {
            const { data, error } = await supabase.functions.invoke('absher_iqama_check_v1', {
              body: { 
                tenantId: job.tenant_id, 
                testMode: testMode || job.payload?.demo_mode,
                jobId: job.id
              }
            });
            if (error) throw error;
            result = data;
          }
          break;
          
        default:
          throw new Error(`Unknown system: ${job.system}`);
      }

      success = true;

      // Update job as successful
      await supabase
        .from('gov_sync_jobs')
        .update({
          status: 'success',
          result: result || {},
          finished_at: new Date().toISOString()
        })
        .eq('id', job.id);

      // Emit ROI event for successful government sync
      await supabase.rpc('roi_emit_event', {
        p_tenant: job.tenant_id,
        p_event: 'gov_sync',
        p_qty: 1,
        p_module: 'government',
        p_ref: job.id,
        p_meta: {
          system: job.system,
          job_type: job.job_type,
          success: true,
          processing_time_ms: Date.now() - new Date(job.started_at || job.created_at).getTime()
        }
      });

      // Update ROI snapshot
      await supabase.rpc('roi_snapshot_upsert_v1', {
        p_tenant: job.tenant_id,
        p_date: new Date().toISOString().split('T')[0]
      });

    } catch (error) {
      console.error('Job execution error:', error);
      
      // Update job as failed
      await supabase
        .from('gov_sync_jobs')
        .update({
          status: 'error',
          error: error.message,
          finished_at: new Date().toISOString()
        })
        .eq('id', job.id);

      // Log error event
      await supabase
        .from('gov_events')
        .insert({
          tenant_id: job.tenant_id,
          system: job.system,
          kind: 'job_execution_error',
          severity: 'error',
          message: `Job ${job.job_type} failed: ${error.message}`,
          data: { job_id: job.id, error: error.message }
        });
    }

    return new Response(
      JSON.stringify({
        success,
        job_id: job.id,
        system: job.system,
        job_type: job.job_type,
        result: result || null,
        message: success ? 'Job completed successfully' : 'Job failed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Gov job runner error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});