-- Task Center v1: Tables and RLS

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  module text NOT NULL,
  title text NOT NULL,
  description text,
  due_at timestamp with time zone,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'overdue')),
  owner_user_id uuid,
  owner_role text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  closed_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create notifications table  
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  channel text DEFAULT 'email' CHECK (channel IN ('email', 'system', 'sms')),
  to_user_id uuid,
  to_email text,
  message text NOT NULL,
  sent_at timestamp with time zone,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  created_at timestamp with time zone DEFAULT now(),
  error_details jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can manage tasks from their company" ON public.tasks
FOR ALL USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- RLS Policies for notifications  
CREATE POLICY "Users can manage notifications from their company" ON public.notifications
FOR ALL USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Add triggers for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_status ON public.tasks (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_module ON public.tasks (tenant_id, module);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_owner ON public.tasks (tenant_id, owner_user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON public.tasks (due_at) WHERE due_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_task ON public.notifications (task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications (tenant_id, status);