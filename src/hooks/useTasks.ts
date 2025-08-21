import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  module: string;
  title: string;
  description?: string;
  due_at?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  owner_user_id?: string;
  owner_role?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  metadata: any;
  is_overdue?: boolean;
  owner_name?: string;
}

export interface TaskFilters {
  status?: string;
  module?: string;
  owner_user_id?: string;
  limit?: number;
  offset?: number;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = async (filters: TaskFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user's company
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .single();

      if (!userRoles?.company_id) {
        throw new Error('User company not found');
      }

      // Call the RPC function
      const { data, error } = await supabase.rpc('task_list_v1', {
        p_tenant_id: userRoles.company_id,
        p_status: filters.status || null,
        p_module: filters.module || null,
        p_owner_user_id: filters.owner_user_id || null,
        p_limit: filters.limit || 50,
        p_offset: filters.offset || 0
      });

      if (error) throw error;

      setTasks((data || []) as Task[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: {
    module: string;
    title: string;
    description?: string;
    due_at?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    owner_user_id?: string;
    owner_role?: string;
    metadata?: any;
  }) => {
    try {
      setLoading(true);

      // Get current user's company
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .single();

      if (!userRoles?.company_id) {
        throw new Error('User company not found');
      }

      // Call the RPC function
      const { data: taskId, error } = await supabase.rpc('task_create_v1', {
        p_tenant_id: userRoles.company_id,
        p_module: taskData.module,
        p_title: taskData.title,
        p_description: taskData.description,
        p_due_at: taskData.due_at,
        p_priority: taskData.priority || 'medium',
        p_owner_user_id: taskData.owner_user_id,
        p_owner_role: taskData.owner_role,
        p_metadata: taskData.metadata || {}
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully"
      });

      // Refresh tasks
      await fetchTasks();
      return taskId;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignTask = async (taskId: string, ownerUserId?: string, ownerRole?: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.rpc('task_assign_v1', {
        p_task_id: taskId,
        p_owner_user_id: ownerUserId,
        p_owner_role: ownerRole
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task assigned successfully"
      });

      // Refresh tasks
      await fetchTasks();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign task';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string, completionNotes?: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.rpc('task_complete_v1', {
        p_task_id: taskId,
        p_completion_notes: completionNotes
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task completed successfully"
      });

      // Refresh tasks
      await fetchTasks();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete task';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (
    taskId: string, 
    channel: 'email' | 'system' | 'sms' = 'email',
    toUserId?: string,
    toEmail?: string,
    message?: string
  ) => {
    try {
      const { data: notificationId, error } = await supabase.rpc('task_notify_v1', {
        p_task_id: taskId,
        p_channel: channel,
        p_to_user_id: toUserId,
        p_to_email: toEmail,
        p_message: message
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification sent successfully"
      });

      return notificationId;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send notification';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    assignTask,
    completeTask,
    sendNotification
  };
};