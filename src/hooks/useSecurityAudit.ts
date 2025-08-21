import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  user_email: string | null;
  user_role: string | null;
  action: string;
  table_name: string;
  record_id?: string | null;
  old_values?: any;
  new_values?: any;
  severity: string;
  category: string;
  ip_address?: string | null;
  user_agent?: string | null;
  session_id?: string | null;
  created_at: string;
}

interface SecurityConfig {
  id: string;
  tenant_id: string;
  session_idle_timeout_minutes: number;
  session_max_duration_hours: number;
  require_2fa_for_admins: boolean;
  password_min_length: number;
  password_require_special: boolean;
  login_attempt_limit: number;
  lockout_duration_minutes: number;
  audit_retention_days: number;
  data_encryption_at_rest: boolean;
  require_session_confirmation: boolean;
}

export const useSecurityAudit = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAuditLogs = async (limit = 50, category?: string, severity?: string) => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq('category', category);
      }
      if (severity) {
        query = query.eq('severity', severity);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAuditLogs((data || []) as AuditLog[]);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive",
      });
    }
  };

  const fetchSecurityConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('security_config')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setSecurityConfig(data);
    } catch (error) {
      console.error('Error fetching security config:', error);
      toast({
        title: "Error",
        description: "Failed to load security configuration",
        variant: "destructive",
      });
    }
  };

  const updateSecurityConfig = async (config: Partial<SecurityConfig>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('security_config')
        .upsert({
          tenant_id: securityConfig?.tenant_id,
          ...config
        });

      if (error) throw error;

      // Log this security change
      await supabase.functions.invoke('ask-aql-tools', {
        body: {
          tool: 'log_security_change',
          parameters: {
            action: 'security_config_updated',
            changes: config
          },
          tenantId: securityConfig?.tenant_id,
          userId: user.id,
          prompt: 'Security configuration updated'
        }
      });

      toast({
        title: "Security Updated",
        description: "Security configuration has been updated successfully",
      });

      await fetchSecurityConfig();
    } catch (error) {
      console.error('Error updating security config:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : 'Failed to update security configuration',
        variant: "destructive",
      });
    }
  };

  const logAdminAction = async (
    action: string,
    tableName: string,
    recordId?: string,
    oldValues?: any,
    newValues?: any,
    category = 'admin_action'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's company
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!userRoles) return;

      await supabase.functions.invoke('log-audit-event', {
        body: {
          companyId: userRoles.company_id,
          userId: user.id,
          action,
          tableName,
          recordId,
          oldValues,
          newValues,
          severity: 'info',
          category
        }
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const searchAuditLogs = async (
    searchTerm: string,
    dateFrom?: Date,
    dateTo?: Date
  ) => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,table_name.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%`);
      }

      if (dateFrom) {
        query = query.gte('created_at', dateFrom.toISOString());
      }

      if (dateTo) {
        query = query.lte('created_at', dateTo.toISOString());
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setAuditLogs((data || []) as AuditLog[]);
    } catch (error) {
      console.error('Error searching audit logs:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search audit logs",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAuditLogs(),
        fetchSecurityConfig()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    auditLogs,
    securityConfig,
    loading,
    fetchAuditLogs,
    fetchSecurityConfig,
    updateSecurityConfig,
    logAdminAction,
    searchAuditLogs,
    refetch: () => {
      fetchAuditLogs();
      fetchSecurityConfig();
    }
  };
};