-- Create prompt_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.prompt_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID DEFAULT auth.uid(),
  company_id UUID DEFAULT public.get_user_company_id(),
  user_prompt TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
  summary TEXT,
  commit_hash TEXT,
  git_commit_hash TEXT,
  implementation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompt_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their company prompt logs" 
ON public.prompt_logs 
FOR SELECT 
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can insert prompt logs for their company" 
ON public.prompt_logs 
FOR INSERT 
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update their company prompt logs" 
ON public.prompt_logs 
FOR UPDATE 
USING (company_id = public.get_user_company_id());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_logs_company_created 
ON public.prompt_logs(company_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompt_logs_status_priority 
ON public.prompt_logs(status, priority);

CREATE INDEX IF NOT EXISTS idx_prompt_logs_category 
ON public.prompt_logs(category);

-- Create trigger for auto-setting defaults
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
    NEW.summary := LEFT(NEW.user_prompt, 100) 
      || CASE WHEN LENGTH(NEW.user_prompt) > 100 THEN '…' ELSE '' END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER prompt_logs_defaults_trigger
  BEFORE INSERT ON public.prompt_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prompt_logs_set_defaults();

-- Create updated_at trigger
CREATE TRIGGER prompt_logs_updated_at_trigger
  BEFORE UPDATE ON public.prompt_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();