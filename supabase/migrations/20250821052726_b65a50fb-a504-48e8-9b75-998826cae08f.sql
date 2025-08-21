-- Task Center v1: RPC Functions

-- Function to create a task
CREATE OR REPLACE FUNCTION public.task_create_v1(
  p_tenant_id uuid,
  p_module text,
  p_title text,
  p_description text DEFAULT NULL,
  p_due_at timestamp with time zone DEFAULT NULL,
  p_priority text DEFAULT 'medium',
  p_owner_user_id uuid DEFAULT NULL,
  p_owner_role text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_task_id uuid;
BEGIN
  -- Validate tenant access
  IF p_tenant_id != public.get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied to tenant %', p_tenant_id;
  END IF;

  -- Insert task
  INSERT INTO public.tasks (
    tenant_id, module, title, description, due_at, priority,
    owner_user_id, owner_role, created_by, metadata
  ) VALUES (
    p_tenant_id, p_module, p_title, p_description, p_due_at, p_priority,
    p_owner_user_id, p_owner_role, auth.uid(), p_metadata
  ) RETURNING id INTO v_task_id;

  -- Log the creation
  RAISE NOTICE 'Task created: % - %', v_task_id, p_title;

  RETURN v_task_id;
END;
$$;

-- Function to assign a task
CREATE OR REPLACE FUNCTION public.task_assign_v1(
  p_task_id uuid,
  p_owner_user_id uuid DEFAULT NULL,
  p_owner_role text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_task_record record;
BEGIN
  -- Get task and validate access
  SELECT * INTO v_task_record
  FROM public.tasks 
  WHERE id = p_task_id 
    AND tenant_id = public.get_user_company_id();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or access denied: %', p_task_id;
  END IF;

  -- Update assignment
  UPDATE public.tasks 
  SET 
    owner_user_id = p_owner_user_id,
    owner_role = p_owner_role,
    status = CASE 
      WHEN status = 'pending' THEN 'in_progress'
      ELSE status 
    END,
    updated_at = now()
  WHERE id = p_task_id;

  -- Log the assignment
  RAISE NOTICE 'Task assigned: % to user % / role %', p_task_id, p_owner_user_id, p_owner_role;

  RETURN TRUE;
END;
$$;

-- Function to complete a task
CREATE OR REPLACE FUNCTION public.task_complete_v1(
  p_task_id uuid,
  p_completion_notes text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_task_record record;
  v_completion_metadata jsonb;
BEGIN
  -- Get task and validate access
  SELECT * INTO v_task_record
  FROM public.tasks 
  WHERE id = p_task_id 
    AND tenant_id = public.get_user_company_id();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or access denied: %', p_task_id;
  END IF;

  -- Prepare completion metadata
  v_completion_metadata = v_task_record.metadata || jsonb_build_object(
    'completed_by', auth.uid(),
    'completion_notes', p_completion_notes,
    'completion_timestamp', now()
  );

  -- Update task status
  UPDATE public.tasks 
  SET 
    status = 'completed',
    closed_at = now(),
    metadata = v_completion_metadata,
    updated_at = now()
  WHERE id = p_task_id;

  -- Log the completion
  RAISE NOTICE 'Task completed: %', p_task_id;

  RETURN TRUE;
END;
$$;

-- Function to list tasks with filters
CREATE OR REPLACE FUNCTION public.task_list_v1(
  p_tenant_id uuid,
  p_status text DEFAULT NULL,
  p_module text DEFAULT NULL,
  p_owner_user_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
) RETURNS TABLE(
  id uuid,
  module text,
  title text,
  description text,
  due_at timestamp with time zone,
  priority text,
  status text,
  owner_user_id uuid,
  owner_role text,
  created_by uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  closed_at timestamp with time zone,
  metadata jsonb,
  is_overdue boolean,
  owner_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate tenant access
  IF p_tenant_id != public.get_user_company_id() THEN
    RAISE EXCEPTION 'Access denied to tenant %', p_tenant_id;
  END IF;

  RETURN QUERY
  SELECT 
    t.id,
    t.module,
    t.title,
    t.description,
    t.due_at,
    t.priority,
    t.status,
    t.owner_user_id,
    t.owner_role,
    t.created_by,
    t.created_at,
    t.updated_at,
    t.closed_at,
    t.metadata,
    (t.due_at < now() AND t.status NOT IN ('completed', 'cancelled')) as is_overdue,
    COALESCE(p.first_name || ' ' || p.last_name, 'Unassigned') as owner_name
  FROM public.tasks t
  LEFT JOIN public.profiles p ON t.owner_user_id = p.user_id
  WHERE t.tenant_id = p_tenant_id
    AND (p_status IS NULL OR t.status = p_status)
    AND (p_module IS NULL OR t.module = p_module)
    AND (p_owner_user_id IS NULL OR t.owner_user_id = p_owner_user_id)
  ORDER BY 
    CASE t.priority
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END,
    t.due_at ASC NULLS LAST,
    t.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Function to send task notifications
CREATE OR REPLACE FUNCTION public.task_notify_v1(
  p_task_id uuid,
  p_channel text DEFAULT 'email',
  p_to_user_id uuid DEFAULT NULL,
  p_to_email text DEFAULT NULL,
  p_message text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_task_record record;
  v_notification_id uuid;
  v_default_message text;
BEGIN
  -- Get task details
  SELECT * INTO v_task_record
  FROM public.tasks 
  WHERE id = p_task_id 
    AND tenant_id = public.get_user_company_id();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found or access denied: %', p_task_id;
  END IF;

  -- Generate default message if not provided
  IF p_message IS NULL THEN
    v_default_message = format(
      'Task Assignment: %s - Due: %s - Priority: %s',
      v_task_record.title,
      COALESCE(v_task_record.due_at::text, 'No due date'),
      v_task_record.priority
    );
  ELSE
    v_default_message = p_message;
  END IF;

  -- Insert notification
  INSERT INTO public.notifications (
    tenant_id, task_id, channel, to_user_id, to_email, message
  ) VALUES (
    v_task_record.tenant_id, p_task_id, p_channel, p_to_user_id, p_to_email, v_default_message
  ) RETURNING id INTO v_notification_id;

  -- Log the notification
  RAISE NOTICE 'Notification created: % for task %', v_notification_id, p_task_id;

  RETURN v_notification_id;
END;
$$;