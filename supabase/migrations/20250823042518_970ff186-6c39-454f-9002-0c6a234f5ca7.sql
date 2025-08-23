-- Fix audit triggers with correct column names
CREATE OR REPLACE FUNCTION public.trigger_audit_cci_scores()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.audit_log (tenant_id, actor, action, entity, entity_id, details)
  VALUES (
    NEW.tenant_id,
    auth.uid(),
    TG_OP || '_cci_score',
    'cci_scores',
    NEW.id,
    jsonb_build_object('survey_id', NEW.survey_id, 'wave_id', NEW.wave_id)
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_audit_employees()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.audit_log (tenant_id, actor, action, entity, entity_id, details)
  VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    auth.uid(),
    TG_OP || '_employee',
    'employees',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object('employee_number', COALESCE(NEW.employee_number, OLD.employee_number))
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers (check if tables exist first)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cci_scores') THEN
    DROP TRIGGER IF EXISTS audit_cci_scores ON cci_scores;
    CREATE TRIGGER audit_cci_scores
      AFTER INSERT OR UPDATE ON cci_scores
      FOR EACH ROW EXECUTE FUNCTION trigger_audit_cci_scores();
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employees') THEN
    DROP TRIGGER IF EXISTS audit_employees ON employees;
    CREATE TRIGGER audit_employees
      AFTER INSERT OR UPDATE OR DELETE ON employees
      FOR EACH ROW EXECUTE FUNCTION trigger_audit_employees();
  END IF;
END $$;