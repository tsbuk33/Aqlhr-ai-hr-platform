import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'hr_manager' | 'super_admin' | 'employee' | 'manager' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setRole(userRole?.role as UserRole || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  const hasAdminAccess = role && ['admin', 'hr_manager', 'super_admin'].includes(role);
  const canManageIntegrations = hasAdminAccess;

  return {
    role,
    loading,
    hasAdminAccess,
    canManageIntegrations
  };
};

export const useFeatureAccess = (featureKey: string) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // Get user's company ID
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('company_id')
          .eq('user_id', user.id)
          .single();

        if (!userRole?.company_id) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // For now, allow access to gov_adapters feature for all authenticated users
        // This can be enhanced later with proper plan checking
        setHasAccess(true);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [featureKey]);

  return { hasAccess, loading };
};

interface GovernmentAdapter {
  system: string;
  mode: string;
  status: string;
  last_sync: string | null;
  last_error?: string | null;
}

interface GovernmentChange {
  id: string;
  system: string;
  change_type: string;
  reference: string;
  effective_date: string;
  processed: boolean;
  created_at: string;
}

export const useGovernmentAdapters = () => {
  const [adapters, setAdapters] = useState<GovernmentAdapter[]>([]);
  const [changes, setChanges] = useState<GovernmentChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const { toast } = useToast();

  // Get current company ID from user roles
  const getCurrentCompanyId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userRole } = await supabase
      .from('user_roles')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    return userRole?.company_id;
  };

  const fetchAdapters = async () => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase.rpc('gov_get_status_v1', {
        p_tenant: companyId
      });

      if (error) throw error;

      // Initialize missing adapters
      const systems = ['MOL', 'QIWA', 'GOSI', 'ABSHER'];
      const existingSystems = data?.map(d => d.system) || [];
      const missingAdapters = systems
        .filter(system => !existingSystems.includes(system))
        .map(system => ({
          system,
          mode: 'test',
          status: 'pending',
          last_sync: null,
          last_error: null
        }));

      // Map database results to match interface, ensuring all required properties exist
      const mappedData = (data || []).map(d => ({
        system: d.system,
        mode: 'live', // Set mode based on status or system type
        status: d.status,
        last_sync: d.last_sync,
        last_error: d.last_error || null
      }));
      
      setAdapters([...mappedData, ...missingAdapters]);
    } catch (error) {
      console.error('Error fetching adapters:', error);
      toast({
        title: "Error",
        description: "Failed to load government adapters",
        variant: "destructive",
      });
    }
  };

  const fetchChanges = async () => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase.rpc('gov_get_changes_v1', {
        p_tenant: companyId,
        p_limit: 50
      });

      if (error) throw error;
      setChanges(data || []);
    } catch (error) {
      console.error('Error fetching changes:', error);
    }
  };

  const syncSystem = async (system: string) => {
    try {
      setSyncing(system);
      const companyId = await getCurrentCompanyId();
      if (!companyId) throw new Error('No company ID available');

      const functionName = `gov_sync_${system.toLowerCase()}_v1`;
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { tenantId: companyId, testMode: true }
      });

      if (error) throw error;

      toast({
        title: "Sync Successful",
        description: `${system} sync completed with ${data.changes} changes`,
      });

      // Refresh data
      await Promise.all([fetchAdapters(), fetchChanges()]);
    } catch (error) {
      console.error(`Error syncing ${system}:`, error);
      toast({
        title: "Sync Failed",
        description: `Failed to sync ${system}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  const syncAllSystems = async () => {
    try {
      setSyncing('ALL');
      const companyId = await getCurrentCompanyId();
      if (!companyId) throw new Error('No company ID available');

      const { data, error } = await supabase.functions.invoke('gov_sync_all_v1', {
        body: { tenantId: companyId, testMode: true }
      });

      if (error) throw error;

      toast({
        title: "Comprehensive Sync Successful",
        description: `Synced ${data.summary.successful_syncs}/${data.summary.total_systems} systems with ${data.summary.total_changes} total changes`,
      });

      // Refresh data
      await Promise.all([fetchAdapters(), fetchChanges()]);
    } catch (error) {
      console.error('Error in comprehensive sync:', error);
      toast({
        title: "Comprehensive Sync Failed",
        description: `Failed to sync all systems: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setSyncing(null);
    }
  };

  const markChangeProcessed = async (changeId: string) => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) throw new Error('No company ID available');

      const { error } = await supabase.rpc('gov_mark_change_processed_v1', {
        p_tenant: companyId,
        p_change_id: changeId
      });

      if (error) throw error;

      toast({
        title: "Change Processed",
        description: "Change has been marked as processed",
      });

      // Refresh changes
      await fetchChanges();
    } catch (error) {
      console.error('Error marking change processed:', error);
      toast({
        title: "Error",
        description: "Failed to mark change as processed",
        variant: "destructive",
      });
    }
  };

  const createTaskFromChange = async (change: GovernmentChange) => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) throw new Error('No company ID available');

      // Check if task already exists for this change
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('id')
        .eq('tenant_id', companyId)
        .contains('metadata', { change_id: change.reference })
        .single();

      if (existingTask) {
        toast({
          title: "Task Already Exists",
          description: "A task has already been created for this change",
        });
        return;
      }

      const taskTitle = getChangeTaskTitle(change);
      const taskDescription = getChangeTaskDescription(change);

      const { error } = await supabase
        .from('tasks')
        .insert({
          tenant_id: companyId,
          module: 'government_compliance',
          title: taskTitle,
          description: taskDescription,
          priority: getChangePriority(change.change_type),
          owner_role: 'hr_manager',
          metadata: {
            source: change.system,
            change_id: change.reference,
            change_type: change.change_type,
            effective_date: change.effective_date
          }
        });

      if (error) throw error;

      toast({
        title: "Task Created",
        description: `Task created for ${change.system} ${change.change_type}`,
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task from change",
        variant: "destructive",
      });
    }
  };

  const getChangeTaskTitle = (change: GovernmentChange): string => {
    const titles = {
      new_hire: `معالجة توظيف جديد - ${change.reference}`,
      termination: `إجراءات إنهاء الخدمة - ${change.reference}`,
      iqama_update: `تحديث الإقامة - ${change.reference}`,
      saudization_rate: `مراجعة معدل السعودة`,
      contract_update: `تحديث العقد - ${change.reference}`
    };
    return titles[change.change_type as keyof typeof titles] || `إجراء مطلوب - ${change.reference}`;
  };

  const getChangeTaskDescription = (change: GovernmentChange): string => {
    const descriptions = {
      new_hire: `مطلوب معالجة بيانات الموظف الجديد من نظام ${change.system}. تاريخ السريان: ${change.effective_date}`,
      termination: `مطلوب إكمال إجراءات إنهاء الخدمة حسب ${change.system}. تاريخ السريان: ${change.effective_date}`,
      iqama_update: `تم تحديث بيانات الإقامة في ${change.system}. يرجى مراجعة التحديثات.`,
      saudization_rate: `تغيير في معدل السعودة حسب ${change.system}. يرجى مراجعة الإجراءات المطلوبة.`,
      contract_update: `مطلوب مراجعة تحديث العقد من ${change.system}. تاريخ السريان: ${change.effective_date}`
    };
    return descriptions[change.change_type as keyof typeof descriptions] || `مطلوب إجراء من ${change.system}`;
  };

  const getChangePriority = (changeType: string): string => {
    const priorities = {
      new_hire: 'high',
      termination: 'high',
      iqama_update: 'medium',
      saudization_rate: 'medium',
      contract_update: 'medium'
    };
    return priorities[changeType as keyof typeof priorities] || 'low';
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAdapters(), fetchChanges()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    adapters,
    changes,
    loading,
    syncing,
    syncSystem,
    syncAllSystems,
    markChangeProcessed,
    createTaskFromChange,
    refetch: () => Promise.all([fetchAdapters(), fetchChanges()])
  };
};