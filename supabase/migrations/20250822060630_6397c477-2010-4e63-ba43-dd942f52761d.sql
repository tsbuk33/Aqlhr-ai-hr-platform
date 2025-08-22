-- Fix security definer functions to include proper search_path
CREATE OR REPLACE FUNCTION public.trg_roi_letter_generated() 
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
BEGIN
  PERFORM public.roi_emit_event(
    NEW.tenant_id, 
    'letter_generated', 
    1, 
    'compliance', 
    NEW.id, 
    jsonb_build_object(
      'type', COALESCE(NEW.type, 'unknown'),
      'lang', COALESCE(NEW.lang, 'en'),
      'source', 'compliance_autopilot'
    )
  );
  PERFORM public.roi_snapshot_upsert_v1(NEW.tenant_id, now()::date);
  RETURN NEW;
END $fn$;

CREATE OR REPLACE FUNCTION public.trg_roi_autopilot_run() 
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $fn$
BEGIN
  PERFORM public.roi_emit_event(
    NEW.tenant_id, 
    'autopilot_run', 
    1, 
    'compliance', 
    NEW.id, 
    COALESCE(NEW.stats, '{}'::jsonb) || jsonb_build_object('source', 'compliance_autopilot')
  );
  PERFORM public.roi_snapshot_upsert_v1(NEW.tenant_id, now()::date);
  RETURN NEW;
END $fn$;