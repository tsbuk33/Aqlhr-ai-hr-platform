BEGIN;

-- 1) Table
CREATE TABLE IF NOT EXISTS public.prompt_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  company_id UUID NOT NULL DEFAULT public.get_user_company_id(),
  user_prompt TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','completed','archived')),
  summary TEXT,
  commit_hash TEXT,
  implementation_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Defaults trigger
CREATE OR REPLACE FUNCTION public.prompt_logs_set_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  IF NEW.company_id IS NULL THEN
    NEW.company_id := public.get_user_company_id();
  END IF;
  IF NEW.summary IS NULL OR NEW.summary = '' THEN
    NEW.summary := LEFT(NEW.user_prompt,100)
      || CASE WHEN LENGTH(NEW.user_prompt)>100 THEN '…' ELSE '' END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_prompt_logs_set_defaults ON public.prompt_logs;
CREATE TRIGGER trigger_prompt_logs_set_defaults
  BEFORE INSERT ON public.prompt_logs
  FOR EACH ROW EXECUTE FUNCTION public.prompt_logs_set_defaults();

DROP TRIGGER IF EXISTS trigger_prompt_logs_updated_at ON public.prompt_logs;
CREATE TRIGGER trigger_prompt_logs_updated_at
  BEFORE UPDATE ON public.prompt_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Enable RLS
ALTER TABLE public.prompt_logs ENABLE ROW LEVEL SECURITY;

-- 4) RLS Policies
CREATE POLICY prompt_logs_select
  ON public.prompt_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY prompt_logs_insert
  ON public.prompt_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY prompt_logs_update
  ON public.prompt_logs FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY prompt_logs_delete
  ON public.prompt_logs FOR DELETE
  USING (user_id = auth.uid());

-- 5) Ownership & Permissions
ALTER FUNCTION public.prompt_logs_set_defaults() OWNER TO postgres;
ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.prompt_logs_set_defaults() TO authenticated;

-- 6) Performance indexes
CREATE INDEX IF NOT EXISTS idx_prompt_logs_user_id ON public.prompt_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_created_at ON public.prompt_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_status ON public.prompt_logs(status);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_text_search
  ON public.prompt_logs
  USING gin(to_tsvector('english', user_prompt || ' ' || COALESCE(summary, '')));

COMMIT;