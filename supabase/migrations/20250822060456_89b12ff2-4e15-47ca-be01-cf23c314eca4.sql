-- Add ROI event emission for compliance autopilot runs
-- Add trigger to emit ROI events when compliance autopilot creates letters or runs

-- Create trigger for compliance letters (if table exists)
DO $$
BEGIN
  IF to_regclass('public.compliance_letters') IS NOT NULL THEN
    -- Create trigger function for letters
    CREATE OR REPLACE FUNCTION public.trg_roi_letter_generated() 
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER AS $fn$
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

    -- Drop existing trigger if it exists and create new one
    DROP TRIGGER IF EXISTS after_letter_generated_roi ON public.compliance_letters;
    CREATE TRIGGER after_letter_generated_roi 
      AFTER INSERT ON public.compliance_letters 
      FOR EACH ROW EXECUTE FUNCTION public.trg_roi_letter_generated();
  END IF;
END $$;

-- Create trigger for compliance runs/autopilot runs (if table exists)
DO $$
BEGIN
  IF to_regclass('public.compliance_runs') IS NOT NULL THEN
    -- Create trigger function for autopilot runs
    CREATE OR REPLACE FUNCTION public.trg_roi_autopilot_run() 
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER AS $fn$
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

    -- Drop existing trigger if it exists and create new one
    DROP TRIGGER IF EXISTS after_autopilot_run_roi ON public.compliance_runs;
    CREATE TRIGGER after_autopilot_run_roi 
      AFTER INSERT ON public.compliance_runs 
      FOR EACH ROW EXECUTE FUNCTION public.trg_roi_autopilot_run();
  END IF;
END $$;